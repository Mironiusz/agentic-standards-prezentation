import { CLUSTERS } from './standards.js';
import { splitKey, svgTile } from './tiles.js';

/**
 * Mapa obszarów projektu programistycznego z oceną, co quantask ma pokryte standardem
 * (`PLAN_SLAJDY.md`, blok 6). Klasyfikację obszarów bez własnego standardu prelegent przejrzał
 * i zatwierdził 2026-10-01. Pas wynika z tematu obszaru, a w ramach pasa kafelki idą od pokrytych
 * do świadomych braków. Wydajność stoi w pasie kodu, bo jej reguły są dziś w `code_quality`, a pas
 * budowy aplikacji ma już komplet siedmiu kafelków.
 *
 * Obszar ze standardem ma pole `std` (klucz z `standards.js`), pozostałe mają `lines` (podpis w liniach)
 * i `status`: `czesciowo` (reguły rozproszone po innych standardach, `note` mówi gdzie), `brak`
 * albo `swiadomie` (brak zapisany jako decyzja).
 *
 * Cztery pierwsze pasy to klastry standardów z bloku 3, pod tymi samymi nazwami. Piąty pas dochodzi tylko
 * na mapie, bo tam leży większość braków, i dlatego `coolify` przechodzi do niego z klastra sposobu pracy.
 */

const BANDS = [...CLUSTERS.map(({ key, lines }) => ({ key, lines })), { key: 'wdrozenie', lines: ['wdrożenie', 'i utrzymanie'] }];

export const AREAS = [
  { band: 'proces', std: 'agentic_workflow' },
  { band: 'proces', std: 'agent_docs' },
  { band: 'proces', std: 'review' },
  { band: 'proces', std: 'git' },
  { band: 'proces', key: 'commity', lines: ['komunikaty', 'commitów'], status: 'swiadomie' },
  { band: 'kod', std: 'formatting' },
  { band: 'kod', std: 'code_quality' },
  { band: 'kod', std: 'naming' },
  { band: 'kod', std: 'documentation' },
  { band: 'kod', std: 'tests' },
  { band: 'kod', std: 'security' },
  { band: 'kod', key: 'wydajnosc', lines: ['wydajność'], status: 'czesciowo', note: 'w code_quality' },
  { band: 'aplikacja', std: 'architecture' },
  { band: 'aplikacja', std: 'config' },
  { band: 'aplikacja', std: 'logging' },
  { band: 'aplikacja', std: 'errors' },
  { band: 'aplikacja', key: 'integracje', lines: ['integracje', 'zewnętrzne'], status: 'czesciowo', note: 'w architecture' },
  { band: 'aplikacja', key: 'api', lines: ['kontrakt API', 'i wersje'], status: 'brak' },
  { band: 'aplikacja', key: 'warstwa', lines: ['architektura', 'jednej warstwy'], status: 'swiadomie' },
  { band: 'dane', std: 'database' },
  { band: 'dane', std: 'idempotency' },
  { band: 'dane', std: 'time' },
  { band: 'dane', std: 'worker' },
  { band: 'dane', key: 'osobowe', lines: ['dane osobowe'], status: 'czesciowo', note: 'w logging' },
  { band: 'dane', key: 'backup', lines: ['kopie', 'zapasowe'], status: 'czesciowo', note: 'w coolify' },
  { band: 'wdrozenie', std: 'coolify' },
  { band: 'wdrozenie', key: 'ci', lines: ['potok CI'], status: 'czesciowo', note: 'w git, review' },
  { band: 'wdrozenie', key: 'zaleznosci', lines: ['zależności'], status: 'czesciowo', note: 'w 2 standardach' },
  { band: 'wdrozenie', key: 'monitoring', lines: ['monitoring', 'i alerty'], status: 'czesciowo', note: 'w config, errors' },
  { band: 'wdrozenie', key: 'kontenery', lines: ['kontenery i', 'lokalne env'], status: 'brak' },
  { band: 'wdrozenie', key: 'release', lines: ['release', 'i wersje'], status: 'brak' },
  { band: 'wdrozenie', key: 'runbooki', lines: ['runbooki', 'i incydenty'], status: 'brak' },
];

const MAP = { labelW: 230, w: 164, h: 84, gap: 10, step: 98 };

export const STATUS_COUNTS = {
  std: AREAS.filter((a) => a.std).length,
  czesciowo: AREAS.filter((a) => a.status === 'czesciowo').length,
  brak: AREAS.filter((a) => a.status === 'brak').length,
  swiadomie: AREAS.filter((a) => a.status === 'swiadomie').length,
};

/** Pozycje kafelków mapy, po kluczu obszaru (dla obszaru ze standardem kluczem jest nazwa standardu). */
export const MAP_LAYOUT = (() => {
  const layout = {};
  BANDS.forEach((band, b) => {
    AREAS.filter((a) => a.band === band.key).forEach((a, i) => {
      const x = MAP.labelW + i * (MAP.w + MAP.gap);
      const y = b * MAP.step;
      layout[a.std ?? a.key] = { x, y, w: MAP.w, h: MAP.h, cx: x + MAP.w / 2, cy: y + MAP.h / 2 };
    });
  });
  return layout;
})();

export const areaKey = (a) => a.std ?? a.key;

/** Podpisy pasów po lewej stronie mapy. */
export function renderBandLabels() {
  return BANDS.map((band, b) => {
    const cy = b * MAP.step + MAP.h / 2;
    const first = cy - ((band.lines.length - 1) * 26) / 2 + 8;
    const spans = band.lines.map((line, i) => `<tspan x="0" y="${first + i * 26}">${line}</tspan>`).join('');
    return `<text class="im-band">${spans}</text>`;
  }).join('');
}

/** Przerywane kontury wszystkich obszarów z wyciszonym podpisem: pusta mapa. */
export function renderGhosts() {
  return AREAS.map((a) => {
    const lines = a.std ? splitKey(a.std, 14) : a.lines;
    return svgTile({ ...MAP_LAYOUT[areaKey(a)], lines, cls: `is-ghost ${a.std ? 'is-mono' : ''}`, font: a.std ? 18 : 19 });
  }).join('');
}

/** Kafelek obszaru w jego docelowym stanie (pokryty, częściowo, brak, świadomie). */
export function renderArea(a) {
  const p = MAP_LAYOUT[areaKey(a)];
  const attrs = `data-key="${areaKey(a)}" data-status="${a.std ? 'std' : a.status}"`;
  if (a.std) return svgTile({ ...p, lines: splitKey(a.std, 14), cls: 'is-orange is-mono im-area', font: 18, attrs });

  const cls = { czesciowo: 'is-orange is-dashed', brak: 'is-slate', swiadomie: 'is-slate is-dashed' }[a.status];
  const extra = { czesciowo: a.note, swiadomie: 'świadomie' }[a.status];
  const tile = svgTile({ ...p, lines: a.lines, cls, font: 19, lineH: 22, dy: extra ? -10 : 0 });
  const note = extra ? `<text class="im-note" x="${p.cx}" y="${p.y + p.h - 12}" text-anchor="middle">${extra}</text>` : '';
  return `<g class="im-area" ${attrs}>${tile}${note}</g>`;
}
