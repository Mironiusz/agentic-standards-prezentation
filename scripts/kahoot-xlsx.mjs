/**
 * Quiz do wgrania w Kahoocie, złożony z banku pytań w docs/kahoot.md (D-011). Użycie: npm run kahoot
 * Wynik: out/kahoot.xlsx, czyli szablon KahootQuizTemplate.xlsx z podmienionymi wierszami pytań.
 * W Kahoocie: Create new kahoot > Blank canvas, potem w edytorze Import i wgranie tego pliku.
 *
 * Plik xlsx to zip z XML-ami. Bierzemy oryginalny szablon, zostawiamy nagłówek i formatowanie
 * bez zmian, a przepisujemy tylko listę tekstów (sharedStrings) i wiersze z pytaniami (sheet1).
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(root, 'docs/kahoot.md');
const TEMPLATE = resolve(root, 'KahootQuizTemplate.xlsx');
const OUTPUT = resolve(root, 'out/kahoot.xlsx');

/** Limity Kahoota: dłuższy tekst szablon zaznacza na czerwono, a import go przycina. */
const MAX_QUESTION = 120;
const MAX_ANSWER = 75;
const TIMES = [5, 10, 20, 30, 60, 90, 120, 240];

/** Pierwszy wiersz z pytaniem: wiersze 1-8 szablonu to instrukcja i nagłówek tabeli. */
const FIRST_ROW = 9;

/**
 * Czyta bank pytań. Blok zaczyna się od "## P<n>" i kończy na następnym nagłówku "## ", a kolejność pól
 * jest sztywna. Sekcje z innym nagłówkiem (np. pytania zapasowe) nie trafiają do quizu. Format opisuje docs/kahoot.md.
 */
function parseQuestions(markdown) {
  const blocks = markdown.split(/^## /m).filter((block) => /^P\d+/.test(block));
  if (!blocks.length) throw new Error('docs/kahoot.md: nie znalazłem żadnego bloku "## P<numer>"');

  return blocks.map((block) => {
    const id = block.slice(0, block.indexOf('\n')).trim();
    const fail = (message) => {
      throw new Error(`docs/kahoot.md, ${id}: ${message}`);
    };

    const question = block.match(/^Pytanie: (.+)$/m)?.[1]?.trim();
    if (!question) fail('brak wiersza "Pytanie: ..."');

    const answers = [...block.matchAll(/^(\d)\. (.+)$/gm)].map((m) => m[2].trim());
    if (answers.length < 2 || answers.length > 4) {
      fail(`odpowiedzi musi być od 2 do 4, jest ${answers.length}`);
    }

    const meta = block.match(/^Poprawna: ([\d, ]+) - Czas: (\d+)$/m);
    if (!meta) fail('brak wiersza "Poprawna: ... - Czas: ..."');

    const correct = meta[1].split(',').map((n) => Number(n.trim()));
    for (const index of correct) {
      if (!Number.isInteger(index) || index < 1 || index > answers.length) {
        fail(`"Poprawna: ${meta[1]}" wskazuje odpowiedź, której nie ma`);
      }
    }

    const time = Number(meta[2]);
    if (!TIMES.includes(time)) fail(`czas ${time} s poza listą Kahoota: ${TIMES.join(', ')}`);

    if (question.length > MAX_QUESTION) {
      fail(`pytanie ma ${question.length} znaków, limit to ${MAX_QUESTION}`);
    }
    answers.forEach((answer, i) => {
      if (answer.length > MAX_ANSWER) {
        fail(`odpowiedź ${i + 1} ma ${answer.length} znaków, limit to ${MAX_ANSWER}`);
      }
    });

    return { id, question, answers, correct, time };
  });
}

const escapeXml = (text) => text.replace(/[&<>"']/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' }[c]};`);

/** Teksty szablonu (instrukcja, nagłówki) zostają na swoich indeksach, nasze dopisujemy na końcu. */
function buildSharedStrings(original, texts) {
  const kept = [...original.matchAll(/<si>.*?<\/si>/gs)].map((m) => m[0]);
  const added = texts.map((t) => `<si><t xml:space="preserve">${escapeXml(t)}</t></si>`);
  const all = [...kept, ...added];
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    `<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${all.length}" uniqueCount="${all.length}">` +
    all.join('') +
    '</sst>'
  );
}

/** Wiersz pytania ze stylami przepisanymi z wiersza przykładowego szablonu: numer, teksty, czas, poprawne odpowiedzi. */
function buildRow(rowNumber, order, stringIndex) {
  const columns = ['B', 'C', 'D', 'E', 'F'];
  const cells = [`<c r="A${rowNumber}" s="11"><v>${order}</v></c>`];
  stringIndex.texts.forEach((index, i) => {
    cells.push(`<c r="${columns[i]}${rowNumber}" s="14" t="s"><v>${index}</v></c>`);
  });
  cells.push(`<c r="G${rowNumber}" s="14"><v>${stringIndex.time}</v></c>`);
  cells.push(`<c r="H${rowNumber}" s="15" t="s"><v>${stringIndex.correct}</v></c>`);
  return `<row r="${rowNumber}" spans="1:27" ht="34">${cells.join('')}</row>`;
}

/** Arkusz szablonu z wierszami instrukcji i nagłówka oraz nowymi wierszami pytań w miejsce przykładu. */
function buildSheet(original, rows) {
  const head = original.slice(0, original.indexOf('<sheetData>') + '<sheetData>'.length);
  const tail = original.slice(original.indexOf('</sheetData>'));
  const keptRows = [...original.matchAll(/<row r="(\d+)"[^>]*>.*?<\/row>/gs)]
    .filter((m) => Number(m[1]) < FIRST_ROW)
    .map((m) => m[0])
    .join('');
  const lastRow = FIRST_ROW + rows.length - 1;
  return (head + keptRows + rows.join('') + tail).replace(/<dimension ref="[^"]*"\/>/, `<dimension ref="A1:AA${lastRow}"/>`);
}

/** Parametry nagłówków zip: wersja formatu, flaga nazw w UTF-8 i metoda deflate. */
const ZIP_VERSION = 20;
const ZIP_UTF8_NAMES = 0x0800;
const ZIP_DEFLATE = 8;

/** xlsx to zwykły zip z deflate. Czytamy po nagłówkach lokalnych, bez zależności na bibliotekę. */
function readZip(buffer) {
  const entries = [];
  let offset = 0;
  while (offset + 4 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const flags = buffer.readUInt16LE(offset + 6);
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLength);
    const start = offset + 30 + nameLength + extraLength;
    if (flags & 0x08) throw new Error(`${TEMPLATE}: wpis ${name} ma rozmiar w stopce, tego nie czytam`);
    if (method !== 0 && method !== ZIP_DEFLATE) throw new Error(`${TEMPLATE}: wpis ${name} ma kompresję ${method}`);
    const raw = buffer.subarray(start, start + compressedSize);
    entries.push({ name, data: method === ZIP_DEFLATE ? inflateRawSync(raw) : raw });
    offset = start + compressedSize;
  }
  if (!entries.length) throw new Error(`${TEMPLATE}: nie wygląda na plik xlsx`);
  return entries;
}

/** Składa zip z wpisów `{ name, data }`, każdy skompresowany deflate. */
function writeZip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const sum = crc32(data);
    const packed = deflateRawSync(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(ZIP_VERSION, 4);
    local.writeUInt16LE(ZIP_UTF8_NAMES, 6);
    local.writeUInt16LE(ZIP_DEFLATE, 8);
    local.writeUInt32LE(sum, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    locals.push(local, nameBytes, packed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(ZIP_VERSION, 4);
    central.writeUInt16LE(ZIP_VERSION, 6);
    central.writeUInt16LE(ZIP_UTF8_NAMES, 8);
    central.writeUInt16LE(ZIP_DEFLATE, 10);
    central.writeUInt32LE(sum, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);

    offset += 30 + nameBytes.length + packed.length;
  }

  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, directory, end]);
}

const questions = parseQuestions(readFileSync(SOURCE, 'utf8'));
const entries = readZip(readFileSync(TEMPLATE));

const sharedStrings = entries.find((e) => e.name === 'xl/sharedStrings.xml');
const sheet = entries.find((e) => e.name === 'xl/worksheets/sheet1.xml');
if (!sharedStrings || !sheet) throw new Error(`${TEMPLATE}: brak sharedStrings.xml albo sheet1.xml`);

const originalStrings = sharedStrings.data.toString('utf8');
const base = [...originalStrings.matchAll(/<si>.*?<\/si>/gs)].length;

const newTexts = [];
const addText = (text) => {
  newTexts.push(text);
  return base + newTexts.length - 1;
};

const rows = questions.map((q, i) =>
  buildRow(FIRST_ROW + i, i + 1, {
    texts: [q.question, ...q.answers].map(addText),
    time: q.time,
    correct: addText(q.correct.join(',')),
  }),
);

sharedStrings.data = Buffer.from(buildSharedStrings(originalStrings, newTexts), 'utf8');
sheet.data = Buffer.from(buildSheet(sheet.data.toString('utf8'), rows), 'utf8');

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, writeZip(entries));

const positions = questions.map((q) => q.correct.join(','));
const spread = [1, 2, 3, 4].map((n) => positions.filter((p) => p === String(n)).length);
console.log(`Zapisano ${OUTPUT}`);
console.log(`Pytań: ${questions.length}. Poprawna odpowiedź na miejscach 1-4: ${spread.join(', ')}.`);
console.log(`Łączny czas na odpowiedzi: ${questions.reduce((sum, q) => sum + q.time, 0)} s.`);
