import { gsap } from 'gsap';

import { svgTile } from '../../components/tiles.js';
import './role.css';

/**
 * Ile standardów pracuje w każdej fazie i jak wchodzą do pracy, z macierzy standard x faza (`STANDARDY.html`,
 * sekcja 02, bez rdzenia, mapy, rejestru i `MVP.md`) oraz z `STANDARDY.md` 4.3. `process` to standardy w roli
 * procesu (litera P w macierzy: jak pracować i pisać artefakt), `tech` to wiedza o kodzie i danych oraz kontrola
 * (litery W, B, R). Fazy idą za kolumnami macierzy, więc pamięć i archiwum stoją razem.
 */
const PHASES = [
  { label: 'SEED / SHAPE', process: 3, tech: 4, how: ['sprawdza repo przed pytaniem', '4 standardy jako kategorie ryzyka'] },
  { label: 'PRD', process: 3, tech: 0, how: ['zakaz wiedzy technicznej'], blacklist: true },
  { label: 'PLAN', process: 3, tech: 11, how: ['otwiera to, co wskazuje mapa', 'każdy fakt z dowodem'] },
  { label: 'kod', process: 3, tech: 16, how: ['konwencje z 14 standardów', 'git i coolify: czego agent nie robi sam'] },
  { label: 'review', process: 1, tech: 18, how: ['sprawdza wszystkie 19', 'każdy w jednym z trzech stanów'] },
  { label: 'pamięć i archiwum', process: 2, tech: 3, how: ['format wpisu pamięci', 'zasady archiwizacji'] },
];

const BLACKLIST = [
  ['model danych', 'kolumny', 'migracje', 'ścieżki'],
  ['nazwy funkcji', 'biblioteki', 'deployment', 'sekrety'],
];

const COL = { label: 0, bar: 290, count: 905, how: 945 };
const SEG = { w: 22, gap: 7 };
const ROW = { top: 56, h: 60, tallH: 104, gap: 22 };

/** Pozycje wierszy: wiersz z czarną listą jest wyższy, bo pod hasłem mieszczą się dwa rzędy etykiet. */
const rows = (() => {
  let y = ROW.top;
  return PHASES.map((p) => {
    const h = p.blacklist ? ROW.tallH : ROW.h;
    const row = { ...p, y, h, cy: y + ROW.h / 2 };
    y += h + ROW.gap;
    return row;
  });
})();
const BOTTOM = rows[rows.length - 1].y + ROW.h;

const bar = (r) =>
  [...Array(r.process).fill('pd-process'), ...Array(r.tech).fill('pd-tech')]
    .map((cls, n) => `<rect class="${cls}" x="${COL.bar + n * (SEG.w + SEG.gap)}" y="${r.cy - 14}" width="${SEG.w}" height="28" rx="4" />`)
    .join('');

const how = (r) =>
  r.how
    .map((line, i) => {
      const y = r.how.length === 1 ? r.cy + 8 : r.cy - 6 + i * 28;
      return `<text class="rf-how ${r.blacklist ? 'is-alert' : ''}" x="${COL.how}" y="${y}">${line}</text>`;
    })
    .join('');

/** Czarna lista PRD z `STANDARDY.md` 4.3: przekreślone etykiety w dwóch rzędach pod hasłem wiersza. */
const blacklist = (r) =>
  BLACKLIST.map((line, k) => {
    let x = COL.how;
    return line
      .map((item) => {
        const w = item.length * 9.8 + 20;
        const y = r.cy + 24 + k * 34;
        const tile = `${svgTile({ x, y, w, h: 28, lines: [item], cls: 'is-plain', font: 17 })}<path class="bl-strike" d="M${x + 8} ${y + 14} H${x + w - 8}" />`;
        x += w + 8;
        return tile;
      })
      .join('');
  }).join('');

const table = rows
  .map(
    (r, k) => `<g class="rf-row" data-k="${k}">
    ${svgTile({ x: COL.label, y: r.y, w: 250, h: ROW.h, lines: [r.label], cls: 'is-blue rf-phase', font: 22 })}
    <g class="rf-data">
      ${bar(r)}
      <text class="rf-count" x="${COL.count}" y="${r.cy + 10}" text-anchor="end">${r.process + r.tech}</text>
      ${how(r)}
      ${r.blacklist ? blacklist(r) : ''}
    </g>
  </g>`,
  )
  .join('');

const legendY = BOTTOM + 56;

/**
 * Rola 3 jako tabela: wiersz na fazę, pasek z jednym segmentem na standard i hasła o tym, jak standardy
 * wchodzą do pracy. Najpierw wszystkie fazy poza PRD, potem PRD z czarną listą.
 */
export default {
  id: 'rola-fazy',
  stage: 'role',
  summary: 'rola 3: wiedza na właściwym etapie, czyli które standardy pracują w której fazie',
  html: `
    <h2 class="slide-title">Rola 3: wiedza na właściwym etapie</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 ${legendY + 20}" width="1440" height="${legendY + 20}" aria-hidden="true">
        <g class="rf-head">
          <text class="role-caption" x="${COL.label}" y="28">faza</text>
          <text class="role-caption" x="${COL.bar}" y="28">ile standardów w niej pracuje</text>
          <text class="role-caption" x="${COL.how}" y="28">jak wchodzą do pracy</text>
        </g>
        ${table}
        <g class="rf-legend">
          <rect class="pd-process" x="${COL.bar}" y="${legendY - 20}" width="${SEG.w}" height="28" rx="4" />
          <text class="rf-legend-text" x="${COL.bar + 36}" y="${legendY}">praca agenta: jak pracować i pisać artefakt</text>
          <rect class="pd-tech" x="${COL.bar + 480}" y="${legendY - 20}" width="${SEG.w}" height="28" rx="4" />
          <text class="rf-legend-text" x="${COL.bar + 516}" y="${legendY}">wiedza o kodzie i danych, sprawdzanie</text>
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Rola trzecia to wiedza ze standardów, która wchodzi do pracy w konkretnej fazie, a nie wszystko naraz. Tabela pokazuje dla każdej fazy, ile standardów w niej pracuje i w jaki sposób. Liczby pochodzą z macierzy standard razy faza, którą zrobiłem na podstawie skilli i standardów quantaska.</p>
    <p>[klik] Jeden segment paska to jeden standard. Obrys oznacza standard pracy agenta, czyli jak pracować i jak pisać artefakt. Wypełnienie to wiedza o kodzie i danych albo sprawdzanie. W SEED i SHAPE agent najpierw sprawdza repozytorium, a dopiero potem pyta, a cztery standardy służą jako kategorie ryzyka. W PLAN agent otwiera to, co wskazuje mapa, i każdy fakt podpiera dowodem. Przy kodzie i w review pracują wszystkie dziewiętnaście.</p>
    <p>[klik] Najciekawszy jest PRD: wiedza techniczna ma tu zakaz wejścia, a czarna lista wymienia, czego w PRD być nie może. Są tylko trzy standardy pracy agenta, bo sam zakaz i format PRD też stoją w standardzie. Tak jest wymuszone oddzielenie tego, co budujemy, od tego, jak.</p>`,

  animate(root) {
    const data = [...root.querySelectorAll('.rf-data')];
    const prd = data.splice(
      PHASES.findIndex((p) => p.blacklist),
      1,
    );
    gsap.set([...data, ...prd], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.rf-head, .rf-phase, .rf-legend'), { opacity: 0, duration: 0.4, stagger: 0.06 });
      },
      (tl) => {
        tl.to(data, { opacity: 1, duration: 0.4, stagger: 0.12 });
      },
      (tl) => {
        tl.to(prd, { opacity: 1, duration: 0.5 });
      },
    ];
  },
};
