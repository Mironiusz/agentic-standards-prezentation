import { gsap } from 'gsap';

import { renderSkeleton } from '../../components/skeleton.js';
import './cwiczenie.css';

const SK = renderSkeleton({ x: 0, y: 0, w: 560, file: 'standard_twoj_obszar.md' });

/**
 * Kolejność pracy zespołu: najpierw granice, potem po co, reguły, checklista i to, kto ich pilnuje.
 * Kroki 3 i 5 dzielą pas reguł, więc `noteDy` i `badgeDy` rozsuwają ich podpisy i numery w pionie.
 */
const ORDER = [
  { key: 'zakres', n: 1, note: 'granice: najpierw "Czego tu nie ma"', noteDy: 0, badgeDy: 0 },
  { key: 'poco', n: 2, note: 'po co', noteDy: 0, badgeDy: 0 },
  { key: 'reguly', n: 3, note: 'reguły z uzasadnieniem', noteDy: -20, badgeDy: 0 },
  { key: 'checklista', n: 4, note: 'checklista', noteDy: 0, badgeDy: 0 },
  { key: 'reguly', n: 5, note: 'kto pilnuje: narzędzie, CI, nic', noteDy: 30, badgeDy: 50 },
];
const READY = ['stan', 'odstepstwo'];

const badge = (band, n, dy) =>
  `<g class="tp-badge"><circle cx="${band.x + band.w - 24}" cy="${band.y + 22 + dy}" r="16" /><text x="${band.x + band.w - 24}" y="${band.y + 29 + dy}" text-anchor="middle">${n}</text></g>`;

const steps = ORDER.map((o) => {
  const band = SK.bands[o.key];
  return `<g class="tp-step">${badge(band, o.n, o.badgeDy)}<text class="tp-note" x="660" y="${band.cy + 10 + o.noteDy}">${o.n}. ${o.note}</text></g>`;
}).join('');

const ready = READY.map((key) => `<text class="tp-note is-ready" x="660" y="${SK.bands[key].cy + 10}">gotowe w szablonie</text>`).join('');

/** Szkielet z bloku 3 jako szablon ćwiczenia: sekcje stałe są gotowe, a kliknięcie numeruje kolejność pracy. */
export default {
  id: 'szablon',
  stage: 'cwiczenie',
  summary: 'szablon standardu i kolejność pracy w zespole',
  html: `
    <h2 class="slide-title">Szablon</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 ${SK.height}" width="1440" height="${SK.height}" aria-hidden="true">
        ${SK.svg}
        <g class="tp-ready">${ready}</g>
        ${steps}
      </svg>
    </div>`,
  notes: `
    <p>Szablon to ten sam szkielet co w bloku o anatomii standardu. Stan dokumentu i reguła odstępstwa są już wypełnione, więc zespoły ich nie wymyślają.</p>
    <p>[klik] Kolejność pracy: najpierw granice i sekcja Czego tu nie ma, bo bez sąsiadów nie wiadomo, co w ogóle należy do tego standardu. Potem po co, reguły z uzasadnieniem, checklista, a na końcu przy każdej regule to, kto jej pilnuje.</p>`,

  animate(root) {
    const stepEls = root.querySelectorAll('.tp-step');
    gsap.set(stepEls, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.sk-doc, .tp-ready'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.2 });
      },
      (tl) => {
        tl.to(stepEls, { opacity: 1, duration: 0.35, stagger: 0.25 });
      },
    ];
  },
};
