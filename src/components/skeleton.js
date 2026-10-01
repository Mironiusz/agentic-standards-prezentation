/**
 * Makieta dokumentu standardu: nagłówek z nazwą pliku i sześć pasów-sekcji ze wspólnego szkieletu
 * (`STANDARDY.md` 5.1). Treść sekcji to szare linie zastępcze, bo rysunek pokazuje budowę, a nie tekst.
 * Wspólna dla anatomii (blok 3) i szablonu ćwiczenia (blok 7).
 *
 * Każdy pas ma pod spodem obrys podświetlenia `.sk-hi` (domyślnie niewidoczny), żeby slajd mógł
 * zapalać sekcje po kolei samą przezroczystością.
 */

export const SECTIONS = [
  { key: 'stan', title: 'Stan dokumentu', h: 44, lines: 0 },
  { key: 'poco', title: 'Po co ten dokument', h: 80, lines: 2 },
  { key: 'zakres', title: 'Zakres i granice', h: 96, lines: 3 },
  { key: 'odstepstwo', title: 'Reguła odstępstwa', h: 60, lines: 1 },
  { key: 'reguly', title: 'Reguły z uzasadnieniem', h: 140, lines: 5 },
  { key: 'checklista', title: 'Checklista', h: 86, lines: 3 },
];

const HEADER = 44;
const PAD = 16;
const GAP = 10;
const LINE_WIDTHS = [0.86, 0.72, 0.8, 0.64, 0.76];

/**
 * Rysuje makietę od punktu (x, y) o szerokości `w`. Zwraca SVG i geometrię pasów (po kluczu sekcji),
 * do której slajd dorysowuje etykiety i znaczniki.
 */
export function renderSkeleton({ x = 0, y = 0, w = 560, file = 'standard_obszar.md' } = {}) {
  const bands = {};
  let by = y + HEADER + PAD;
  const inner = w - PAD * 2;

  const parts = SECTIONS.map((s) => {
    const band = { x: x + PAD, y: by, w: inner, h: s.h, cy: by + s.h / 2 };
    bands[s.key] = band;
    by += s.h + GAP;
    const lines = Array.from({ length: s.lines }, (_, k) => {
      const lw = Math.round((inner - 40) * LINE_WIDTHS[k % LINE_WIDTHS.length]);
      return `<rect class="sk-line" x="${band.x + 20}" y="${band.y + 42 + k * 18}" width="${lw}" height="8" rx="4" />`;
    }).join('');
    return `<g class="sk-band" data-key="${s.key}">
      <rect class="sk-hi" x="${band.x - 4}" y="${band.y - 4}" width="${band.w + 8}" height="${band.h + 8}" rx="10" />
      <rect class="sk-box" x="${band.x}" y="${band.y}" width="${band.w}" height="${band.h}" rx="7" />
      <text class="sk-title" x="${band.x + 20}" y="${band.y + 29}">## ${s.title}</text>
      ${lines}
    </g>`;
  }).join('');

  const height = by - GAP + PAD - y;
  const svg = `<g class="sk-doc">
    <rect class="sk-page" x="${x}" y="${y}" width="${w}" height="${height}" rx="12" />
    <path class="sk-head-line" d="M${x} ${y + HEADER} H${x + w}" />
    <text class="sk-file" x="${x + 20}" y="${y + 29}">${file}</text>
    ${parts}
  </g>`;
  return { svg, bands, height };
}
