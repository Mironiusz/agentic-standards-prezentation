/**
 * Kontrola stylu repozytorium według standardów quantaska `standard_formatting.md` i `standard_code_quality.md`
 * w tym, czego nie załatwia prettier: znaki zakazane (w tym homoglify), emotikony, pogrubienia w prozie markdownu
 * i komentarze linijkowe w JavaScripcie. Użycie: npm run lint (razem z prettier --check). Kończy się błędem
 * z listą plików i linii, jeśli cokolwiek znajdzie.
 *
 * Znaki pokazywane na slajdach jako przykład (karta 3.2, reguły `formatting`) stoją w kodzie jako encje HTML,
 * więc ta kontrola ich nie widzi i nie musi mieć wyjątków. Lista znaków jest zapisana kodami, żeby skrypt sam
 * nie zawierał tego, czego zakazuje.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', 'snapshots', 'out', '.git', '.vite']);
const SKIP_FILES = new Set(['package-lock.json']);
const TEXT_EXT = new Set(['.js', '.mjs', '.css', '.md', '.html', '.json']);
const JS_EXT = new Set(['.js', '.mjs']);

/** Znaki zakazane z `standard_formatting.md`, sekcja Znaki zakazane, z nazwą do komunikatu. */
const FORBIDDEN = new Map([
  ['\u2014', 'myślnik em'],
  ['\u2013', 'myślnik en'],
  ['\u2212', 'minus'],
  ['\u201C', 'cudzysłów otwierający zakrzywiony'],
  ['\u201D', 'cudzysłów zamykający zakrzywiony'],
  ['\u2018', 'apostrof otwierający zakrzywiony'],
  ['\u2019', 'apostrof zamykający zakrzywiony'],
  ['\u02BC', 'modyfikujący apostrof'],
  ['\u2026', 'wielokropek'],
  ['\u00B7', 'kropka środkowa'],
  ['\u2192', 'strzałka w prawo'],
  ['\u2190', 'strzałka w lewo'],
  ['\u2194', 'strzałka dwustronna'],
  ['\u00D7', 'znak mnożenia'],
  ['\u0430', 'cyrylickie a'],
  ['\u037E', 'grecki znak zapytania'],
  ['\u2215', 'ukośnik dzielenia'],
]);
const EMOJI = /\p{Extended_Pictographic}/u;
const LINE_COMMENT = /^\s*\/\/|\s\/\/\s/;

/** Wszystkie pliki tekstowe repozytorium poza katalogami wynikowymi i zależnościami. */
function textFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : textFiles(path);
    return TEXT_EXT.has(extname(entry.name)) && !SKIP_FILES.has(entry.name) ? [path] : [];
  });
}

/** Linie prozy markdownu: bez bloków kodu, nagłówków i wierszy tabel, gdzie pogrubienie jest dozwolone. */
function proseLines(lines) {
  let inFence = false;
  return lines.map((line) => {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      return false;
    }
    const start = line.trimStart();
    return !inFence && !start.startsWith('#') && !start.startsWith('|');
  });
}

/** Naruszenia w jednym pliku jako lista `{ line, rule }`. */
function checkFile(path) {
  const ext = extname(path);
  const lines = readFileSync(path, 'utf8').split('\n');
  const prose = ext === '.md' ? proseLines(lines) : [];
  return lines.flatMap((text, i) => {
    const found = [...FORBIDDEN].filter(([ch]) => text.includes(ch)).map(([, name]) => `znak zakazany: ${name}`);
    if (EMOJI.test(text)) found.push('emotikon');
    if (prose[i] && text.includes('**')) found.push('pogrubienie w prozie');
    if (JS_EXT.has(ext) && LINE_COMMENT.test(text)) found.push('komentarz linijkowy');
    return found.map((rule) => ({ line: i + 1, rule }));
  });
}

const problems = textFiles(root).flatMap((path) => checkFile(path).map((p) => `${relative(root, path)}:${p.line}: ${p.rule}`));
if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\nKontrola stylu: ${problems.length} naruszeń.`);
  process.exit(1);
}
console.log('Kontrola stylu: bez naruszeń.');
