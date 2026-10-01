import { gsap } from 'gsap';

import { svgTile } from '../../components/tiles.js';
import { BOXES, backdrop, enterBackdrop } from './backdrop.js';
import './role.css';

/**
 * Pięć ról z bloku, nazwanych tak jak tytuły ich slajdów, i fazy, w których każda działa, jako zakresy indeksów
 * faz z `pipeline.js`. Zakresy wynikają z poprzednich slajdów bloku (`STANDARDY.md` 4.1-4.5): szukanie zasad
 * to start sesji, trafność w SHAPE i mapa w PLAN, wiedza to SHAPE, PLAN, kod i pamięć, sprawdzenie to review,
 * a powstawanie standardów w praktyce to review i archiwum. Nazwa roli 4 nie mieści się w pasku nad jedną
 * fazą, więc stoi obok niego (`nameOutside`).
 */
const ROLES = [
  { name: 'kontrakt pracy agenta', ranges: [[0, 7]] },
  {
    name: 'gdzie szukać zasad',
    ranges: [
      [0, 1],
      [3, 3],
    ],
  },
  {
    name: 'wiedza na właściwym etapie',
    ranges: [
      [1, 1],
      [3, 5],
    ],
  },
  { name: 'sprawdzenie przed oddaniem', ranges: [[6, 6]], nameOutside: true },
  { name: 'standardy powstają w praktyce', ranges: [[6, 7]] },
];
const ROW = { top: 140, step: 56, h: 40 };

/**
 * Pasek roli: nazwa stoi w najszerszym odcinku, a pozostałe odcinki dostają sam numer roli. Przy `nameOutside`
 * wszystkie odcinki mają numer, a nazwa stoi na lewo od najszerszego, w pustej części wiersza.
 */
const bars = ROLES.map((role, k) => {
  const n = k + 1;
  const y = ROW.top + k * ROW.step;
  const segments = role.ranges.map(([from, to]) => ({ x: BOXES[from].x, w: BOXES[to].x + BOXES[to].w - BOXES[from].x }));
  const widest = segments.reduce((a, b) => (b.w > a.w ? b : a));
  const parts = segments
    .map((s) => {
      const label = s === widest && !role.nameOutside ? `${n}. ${role.name}` : `${n}`;
      return svgTile({ x: s.x, y, w: s.w, h: ROW.h, lines: [label], cls: 'is-orange', font: 20 });
    })
    .join('');
  const outside = role.nameOutside ? `<text class="rw-name" x="${widest.x - 16}" y="${y + ROW.h / 2 + 7}" text-anchor="end">${role.name}</text>` : '';
  return `<g class="rw-role">${parts}${outside}</g>`;
}).join('');

const outlines = BOXES.map((b) => `<rect class="rw-outline" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" />`).join('');

/** Podsumowanie bloku: pięć ról jako paski nad fazami, w których działają, a potem obrys każdej fazy. */
export default {
  id: 'wszedzie',
  stage: 'role',
  summary: 'podsumowanie pięciu ról: w każdej fazie pracuje jakiś standard',
  html: `
    <h2 class="slide-title">Wszędzie jest standard</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 ${ROW.top + ROLES.length * ROW.step}" width="1440" height="${ROW.top + ROLES.length * ROW.step}" aria-hidden="true">
        ${backdrop()}
        ${bars}
        <g class="rw-outlines">${outlines}</g>
      </svg>
    </div>`,
  notes: `
    <p>Podsumowanie bloku na tym samym pipelinie, od którego zaczęliśmy.</p>
    <p>[klik] Pięć ról jako paski nad fazami, w których działają. Kontrakt pracy agenta leży pod całym łańcuchem. Szukanie zasad pracuje na starcie, w SHAPE i przy planowaniu. Wiedza wchodzi w SHAPE, PLAN, przy kodzie i przy pamięci, ale omija PRD. Sprawdzenie przed oddaniem to review, a standardy powstają w praktyce z tego, co wyjdzie między review a archiwum.</p>
    <p>[klik] Każda faza ma co najmniej jedną rolę standardów, także PRD, gdzie pracuje sam kontrakt pracy agenta. Wniosek, do którego zmierzał cały blok: bez standardu w danej fazie nie dostajemy tego, czego chcemy, tylko to, co agent akurat zgadnie.</p>`,

  animate(root) {
    const roles = root.querySelectorAll('.rw-role');
    const outlineEls = root.querySelectorAll('.rw-outline');
    gsap.set([...roles, ...outlineEls], { opacity: 0 });

    return [
      (tl) => enterBackdrop(tl, root),
      (tl) => {
        tl.to(roles, { opacity: 1, duration: 0.35, stagger: 0.2 });
      },
      (tl) => {
        tl.to(outlineEls, { opacity: 1, duration: 0.3, stagger: 0.08 });
      },
    ];
  },
};
