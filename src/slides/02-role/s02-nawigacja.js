import { gsap } from 'gsap';

import { hArrow } from '../../components/flow.js';
import { STANDARDS } from '../../components/standards.js';
import { svgTile } from '../../components/tiles.js';
import { BOXES, backdrop, enterBackdrop } from './backdrop.js';
import './role.css';

const GRID = { x: 980, y: 170, w: 107, h: 40, gap: 10, step: 50, cols: 4 };
const LOADED = ['config', 'logging'];

const gridPos = (i) => ({ x: GRID.x + (i % GRID.cols) * (GRID.w + GRID.gap), y: GRID.y + Math.floor(i / GRID.cols) * GRID.step, w: GRID.w, h: GRID.h });

/** Wszystkie standardy jako szare kafelki bez podpisu, a dwa otwarte przez mapę na pomarańczowo, z nazwą. */
const grid = STANDARDS.map((s, i) => {
  const loaded = LOADED.includes(s.key);
  return svgTile({ ...gridPos(i), lines: loaded ? [s.key] : [], cls: loaded ? 'is-orange is-mono rn-loaded' : 'is-ghost', font: 17 });
}).join('');

const fan = STANDARDS.map((s, i) => ({ s, p: gridPos(i) }))
  .filter(({ s }) => LOADED.includes(s.key))
  .map(({ p }) => `<path class="role-link" d="M904 265 C940 265 940 ${p.y + p.h / 2} ${p.x - 4} ${p.y + p.h / 2}" />`)
  .join('');

/** Rola 2: droga agenta do reguły od startu sesji, przez rdzeń i mapę, do dwóch standardów z dziewiętnastu. */
export default {
  id: 'rola-nawigacja',
  stage: 'role',
  summary: 'rola 2: gdzie szukać zasad, czyli jak agent trafia do właściwego standardu',
  html: `
    <h2 class="slide-title">Rola 2: gdzie szukać zasad</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 660" width="1440" height="660" aria-hidden="true">
        ${backdrop()}
        <g class="rn-path">
          <path class="role-link is-dim" d="M${BOXES[0].cx} 98 V216" />
          <text class="role-caption" x="${BOXES[0].cx + 14}" y="170">start sesji</text>
          ${svgTile({ x: 0, y: 220, w: 250, h: 90, lines: ['SessionStart'], sub: 'hook: wskazania', cls: 'is-mint is-mono', font: 22 })}
          ${hArrow(254, 316, 265)}
          ${svgTile({ x: 320, y: 220, w: 240, h: 90, lines: ['CLAUDE.md'], sub: 'twarde zakazy', cls: 'is-mono', font: 22 })}
          ${hArrow(564, 626, 265)}
          ${svgTile({ x: 630, y: 220, w: 270, h: 90, lines: ['README.md'], sub: 'mapa: status, co otworzyć', cls: 'is-mono', font: 22 })}
        </g>
        <g class="rn-grid">
          <text class="role-caption" x="${GRID.x}" y="${GRID.y - 16}">19 standardów</text>
          ${fan}
          ${grid}
          <text class="role-head is-accent" x="${GRID.x}" y="${GRID.y + 5 * GRID.step + 40}">tylko to, czego trzeba</text>
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Rola druga to odpowiedź na pytanie, gdzie szukać zasad: jak agent znajduje właściwy standard, zanim zacznie pracę.</p>
    <p>[klik] Na starcie sesji hook dopisuje do kontekstu wskazania, a nie treść plików, żeby start był tani. Rdzeń, czyli CLAUDE.md, zawiera tylko twarde zakazy stosowalne bez kontekstu i odsyła do mapy standardów w README.md.</p>
    <p>[klik] Mapa przekłada typ zadania na listę plików do otwarcia. Z dziewiętnastu standardów do kontekstu trafiają tylko te, których zadanie dotyka, tutaj na przykład config i logging. Agent dostaje tylko to, czego potrzebuje, a nie cały zbiór naraz.</p>`,

  animate(root) {
    const path = [...root.querySelectorAll('.rn-path > *')];
    const gridGroup = root.querySelector('.rn-grid');
    gsap.set([...path, gridGroup], { opacity: 0 });

    return [
      (tl) => enterBackdrop(tl, root),
      (tl) => {
        tl.to(path, { opacity: 1, duration: 0.35, stagger: 0.12 });
      },
      (tl) => {
        tl.to(gridGroup, { opacity: 1, duration: 0.5 });
      },
    ];
  },
};
