import { gsap } from 'gsap';

import { vArrow } from '../../components/flow.js';
import { STANDARDS } from '../../components/standards.js';
import { svgTile } from '../../components/tiles.js';
import { BOXES, backdrop, enterBackdrop, focusPhase } from './backdrop.js';
import './role.css';

const REVIEW = 6;
const STRIP = { x: 40, y: 400, w: 64, h: 44, gap: 8 };
const DEC3 = ['agent_docs', 'naming', 'documentation', 'tests'];
const CALLOUT = { x: 100, y: 520, w: 800, h: 96 };

const stripX = (i) => STRIP.x + i * (STRIP.w + STRIP.gap);
const stripCx = (key) => stripX(STANDARDS.findIndex((s) => s.key === key)) + STRIP.w / 2;

const strip = STANDARDS.map((s, i) => svgTile({ x: stripX(i), y: STRIP.y, w: STRIP.w, h: STRIP.h, lines: [], cls: 'is-orange' })).join('');
const lit = DEC3.map((key) => svgTile({ x: stripCx(key) - STRIP.w / 2, y: STRIP.y, w: STRIP.w, h: STRIP.h, lines: [], cls: 'is-accent' })).join('');
const dec3Links = DEC3.map((key) => `<path class="rl-dec" d="M${stripCx(key)} ${STRIP.y + STRIP.h + 4} V${CALLOUT.y - 2}" />`).join('');

const TARGETS = [
  { cx: 620, tile: { x: 470, w: 300, lines: ['decision_registry.md'], sub: 'decyzje na później' } },
  { cx: 970, tile: { x: 820, w: 300, lines: ['README.md'], sub: 'znane długi' } },
  { cx: 1305, tile: { x: 1170, w: 270, lines: ['agent_docs/memory'], sub: 'wzorce, tylko dopisywanie' } },
];

const review = BOXES[REVIEW];
const branches = TARGETS.map((t) => `<path class="role-link" d="M${review.cx} 98 V140 H${t.cx} V176" />`).join('');
const targets = TARGETS.map((t) => svgTile({ ...t.tile, y: 180, h: 80, cls: 'is-mono', font: 21 })).join('');

/** Rola 5: znaleziska z review przekraczające zadanie idą do rejestrów, a stamtąd do standardów. Przykład DEC-3. */
export default {
  id: 'rola-petla',
  stage: 'role',
  summary: 'rola 5: standardy powstają w praktyce, czyli co się dzieje ze znaleziskami z review',
  html: `
    <h2 class="slide-title">Rola 5: standardy powstają w praktyce</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 660" width="1440" height="660" aria-hidden="true">
        ${backdrop()}
        ${focusPhase(REVIEW)}
        <g class="rl-targets">${branches}${targets}</g>
        <g class="rl-strip">
          ${vArrow(620, 264, STRIP.y - 6)}
          ${vArrow(970, 264, STRIP.y - 6)}
          <text class="role-caption" x="795" y="338" text-anchor="middle">decyzja zapada</text>
          <text class="role-caption" x="${STRIP.x}" y="${STRIP.y - 14}">19 standardów</text>
          ${strip}
        </g>
        <g class="rl-dec3">
          ${lit}
          ${dec3Links}
          <rect class="rl-callout" x="${CALLOUT.x}" y="${CALLOUT.y}" width="${CALLOUT.w}" height="${CALLOUT.h}" rx="12" />
          <text class="role-head is-accent" x="${CALLOUT.x + 24}" y="${CALLOUT.y + 38}">DEC-3: jednostką kodu jest warstwa</text>
          <text class="role-caption" x="${CALLOUT.x + 24}" y="${CALLOUT.y + 74}">${DEC3.join(', ')}</text>
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Rola piąta: standardy powstają w praktyce. Nie są pisane raz na zawsze, tylko dopisujemy do nich to, co znajduje praca nad zadaniami.</p>
    <p>[klik] Znalezisko, które przekracza jedno zadanie, nie ginie w raporcie. Jeśli dotyczy decyzji na przyszłość, trafia do decision_registry.md. Jeśli to dług z przeszłości, trafia do sekcji granic i długów w mapie standardów. Trwały wzorzec dla modułu idzie do pamięci w agent_docs.</p>
    <p>[klik] Kiedy decyzja zapada, ląduje w standardzie, w MVP.md albo w kodzie, a wpis w rejestrze przechodzi do rozstrzygniętych.</p>
    <p>[klik] Przykład: DEC-3, czyli decyzja, że jednostką kodu jest warstwa, rozstrzygnięta 13 sierpnia. Weszła naraz do czterech standardów: agent_docs, naming, documentation i tests.</p>`,

  animate(root) {
    const targetsGroup = root.querySelector('.rl-targets');
    const stripGroup = root.querySelector('.rl-strip');
    const dec3 = root.querySelector('.rl-dec3');
    gsap.set([targetsGroup, stripGroup, dec3], { opacity: 0 });

    return [
      (tl) => enterBackdrop(tl, root),
      (tl) => {
        tl.to(targetsGroup, { opacity: 1, duration: 0.5 });
      },
      (tl) => {
        tl.to(stripGroup, { opacity: 1, duration: 0.5 });
      },
      (tl) => {
        tl.to(dec3, { opacity: 1, duration: 0.5 });
      },
    ];
  },
};
