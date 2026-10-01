/**
 * Materiały do ćwiczenia (blok 7): dla każdego kandydata z `src/components/candidates.js` jeden plik
 * z sekcjami "Zakres i granice" jego sąsiadów, przepisanymi bez zmian ze standardów quantaska. Bez nich
 * zespoły nie mają jak narysować granic swojego obszaru.
 *
 * Użycie: npm run cwiczenie -- <katalog repozytorium quantask>
 * Wynik: materialy/cwiczenie/granice_<obszar>.md. Szablon standardu dla zespołów
 * (materialy/cwiczenie/standard_twoj_obszar.md) jest pisany ręcznie i skrypt go nie rusza.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CANDIDATES } from '../src/components/candidates.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(root, 'materialy/cwiczenie');
const SECTION = '## Zakres i granice';

const quantask = process.argv[2];
if (!quantask) throw new Error('podaj katalog repozytorium quantask: npm run cwiczenie -- <katalog>');
const standardsDir = resolve(quantask, 'docs/standards');
if (!existsSync(standardsDir)) throw new Error(`nie ma katalogu ${standardsDir}`);

/** Czyta ze standardu linię "Stan dokumentu" i treść sekcji "Zakres i granice", bez jej nagłówka. */
function readScope(key) {
  const file = `standard_${key}.md`;
  const lines = readFileSync(resolve(standardsDir, file), 'utf8').split(/\r?\n/);
  const state = lines.find((line) => line.startsWith('Stan dokumentu:'));
  const start = lines.indexOf(SECTION);
  if (!state || start < 0) throw new Error(`${file}: brak linii "Stan dokumentu:" albo sekcji "${SECTION}"`);
  const end = lines.findIndex((line, i) => i > start && line.startsWith('## '));
  const body = lines
    .slice(start + 1, end < 0 ? undefined : end)
    .join('\n')
    .trim();
  return { file, state, body };
}

/** Plik dla jednego kandydata: nagłówek, ewentualny standard do porównania i sekcje sąsiadów. */
function renderCandidate(candidate) {
  const compare = candidate.standard ? [`Do porównania po ćwiczeniu: \`docs/standards/standard_${candidate.standard}.md\`.`, ''] : [];
  const sections = candidate.neighbours.map(readScope).flatMap(({ file, state, body }) => [`## ${file}`, '', state, '', body, '']);
  return [
    `# Granice: ${candidate.name}`,
    '',
    `Sąsiedzi: ${candidate.neighbours.map((n) => `\`${n}\``).join(', ')}. Sekcje "Zakres i granice" bez zmian, z \`docs/standards\` w quantasku.`,
    '',
    ...compare,
    ...sections,
  ].join('\n');
}

mkdirSync(OUTPUT, { recursive: true });
for (const candidate of CANDIDATES) {
  const path = resolve(OUTPUT, `granice_${candidate.area}.md`);
  writeFileSync(path, renderCandidate(candidate));
  console.log(`Zapisano ${path}`);
}
