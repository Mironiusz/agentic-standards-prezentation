import { svgTile } from '../../components/tiles.js';
import './cwiczenie.css';

/** Podział 25 minut pracy zespołu (`PLAN_SLAJDY.md` 7.3). Szerokość odcinka jest proporcjonalna do minut. */
const SEGMENTS = [
  { min: 5, label: 'granice' },
  { min: 12, label: 'reguły z uzasadnieniem' },
  { min: 5, label: 'checklista + narzędzie' },
  { min: 3, label: 'zapas', dashed: true },
];
const TOTAL = SEGMENTS.reduce((sum, s) => sum + s.min, 0);
const BAR = { y: 230, h: 110, gap: 8 };

const bar = (() => {
  const unit = (1440 - BAR.gap * (SEGMENTS.length - 1)) / TOTAL;
  let x = 0;
  return SEGMENTS.map((s) => {
    const w = s.min * unit;
    const out = `<g class="ck-seg">
      <text class="ck-min" x="${x}" y="${BAR.y - 18}">${s.min} min</text>
      ${svgTile({ x, y: BAR.y, w, h: BAR.h, lines: [s.label], cls: s.dashed ? 'is-ghost' : '', font: 24 })}
    </g>`;
    x += w + BAR.gap;
    return out;
  }).join('');
})();

/** Plan czasu pracy zespołu: odcinki paska wchodzą po kolei, od lewej. */
export default {
  id: 'zegar',
  stage: 'cwiczenie',
  summary: 'praca w zespołach: 25 minut i podział czasu',
  html: `
    <h2 class="slide-title">Praca w zespołach</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 420" width="1440" height="420" aria-hidden="true">
        <text class="ck-total" x="0" y="90">${TOTAL} min</text>
        ${bar}
      </svg>
    </div>`,
  notes: `<p>Zespoły po trzy, cztery osoby, ten sam obszar dla wszystkich. Dwadzieścia pięć minut: pięć na granice, dwanaście na reguły z uzasadnieniem, pięć na checklistę i narzędzia, trzy minuty zapasu. Ten slajd stoi na ekranie przez całą pracę zespołów.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.from(root.querySelector('.ck-total'), { opacity: 0, duration: 0.4 });
        tl.from(root.querySelectorAll('.ck-seg'), { opacity: 0, x: -20, duration: 0.4, stagger: 0.2 });
      },
    ];
  },
};
