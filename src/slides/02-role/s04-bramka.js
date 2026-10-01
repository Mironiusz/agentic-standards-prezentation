import { gsap } from 'gsap';

import { STANDARDS } from '../../components/standards.js';
import { svgTile } from '../../components/tiles.js';
import { backdrop, enterBackdrop, focusPhase } from './backdrop.js';
import './role.css';

const REVIEW = 6;
const AUTO = STANDARDS.filter((s) => s.jobs.length);
const MANUAL = STANDARDS.filter((s) => !s.jobs.length);

const ROW = { x: 20, y: 186, step: 41, h: 33, w: 220 };

/** Standardy z komendą: kafelek standardu, a obok joby CI, które tę komendę odpalają. */
const autoRows = AUTO.map((s, i) => {
  const y = ROW.y + i * ROW.step;
  let x = ROW.x + ROW.w + 18;
  const jobs = s.jobs
    .map((job) => {
      const w = job.length * 10.2 + 22;
      const tile = svgTile({ x, y, w, h: ROW.h, lines: [job], cls: 'is-mint is-mono', font: 17 });
      x += w + 10;
      return tile;
    })
    .join('');
  return `<g class="rb-row">
    ${svgTile({ x: ROW.x, y, w: ROW.w, h: ROW.h, lines: [s.key], cls: 'is-orange is-mono', font: 18 })}
    <g class="rb-jobs">${jobs}</g>
  </g>`;
}).join('');

const manualTiles = MANUAL.map((s, i) =>
  svgTile({
    x: 905 + (i % 2) * 265,
    y: 186 + Math.floor(i / 2) * 58,
    w: 245,
    h: 44,
    lines: [s.key],
    cls: 'is-orange is-mono',
    font: 19,
  }),
).join('');

/** Rola 4: review przechodzi po wszystkich 19 standardach. 11 ma komendę i job w CI, 8 wymaga przeglądu ręcznego. */
export default {
  id: 'rola-bramka',
  stage: 'role',
  summary: 'rola 4: sprawdzenie przed oddaniem, czyli review po wszystkich 19 standardach',
  html: `
    <h2 class="slide-title">Rola 4: sprawdzenie przed oddaniem</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 660" width="1440" height="660" aria-hidden="true">
        ${backdrop()}
        ${focusPhase(REVIEW)}
        <g class="rb-groups">
          <rect class="rb-frame is-mint" x="0" y="130" width="830" height="520" rx="14" />
          <text class="role-head is-mint" x="20" y="168">${AUTO.length} - sprawdza komenda i CI</text>
          ${autoRows}
          <rect class="rb-frame is-violet" x="885" y="130" width="555" height="300" rx="14" />
          <text class="role-head is-violet" x="905" y="168">${MANUAL.length} - sprawdza człowiek</text>
          ${manualTiles}
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Rola czwarta to sprawdzenie przed oddaniem. Review przechodzi po wszystkich dziewiętnastu standardach, a każdy dostaje jeden z trzech stanów: nie dotyczy, sprawdzono automatycznie albo sprawdzono ręcznie. Jawna lista pozwala odróżnić standard pominięty od świadomie wykluczonego.</p>
    <p>[klik] Jedenaście standardów ma komendę, którą review odpala naprawdę, zamiast oceniać zgodność na oko. Osiem wymaga przeglądu ręcznego. W quantasku każda niezgodność blokuje review, bo repozytorium nie ma kodu zastanego, który trzeba by chronić.</p>
    <p>[klik] Te same komendy chodzą jako joby w potoku GitLaba przy każdym Merge Requeście do dev i main. Review agenta i CI sprawdzają więc dokładnie to samo.</p>`,

  animate(root) {
    const groups = root.querySelector('.rb-groups');
    const jobs = root.querySelectorAll('.rb-jobs');
    gsap.set([groups, ...jobs], { opacity: 0 });

    return [
      (tl) => enterBackdrop(tl, root),
      (tl) => {
        tl.to(groups, { opacity: 1, duration: 0.5 });
      },
      (tl) => {
        tl.to(jobs, { opacity: 1, duration: 0.3, stagger: 0.06 });
      },
    ];
  },
};
