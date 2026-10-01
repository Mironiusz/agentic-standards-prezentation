import { hArrow } from './flow.js';

/**
 * Diagram pipeline'u agentowego: osiem faz w jednym rzędzie, nad nimi skille, które je prowadzą,
 * bramki na granicach faz i pętle powrotne pod spodem. Wspólny dla bloków 1, 2 i 7, żeby sala
 * oglądała ciągle ten sam rysunek, a zmieniało się tylko to, co na niego nałożono.
 *
 * Kolejność faz idzie za krokami skilla `plan-implement` (pamięć przed review), a nie za tekstem
 * standardu (`STANDARDY.md` 3.1). Geometria jest stała (D-005): osiem pudełek po 150 px z odstępem
 * 34 px wypełnia 1438 px, czyli całą szerokość treści slajdu.
 */

export const PIPE = { w: 150, h: 84, gap: 34 };

export const PHASES = [
  { key: 'seed', label: 'SEED', file: '_SEED.md' },
  { key: 'shape', label: 'SHAPE', file: '_SHAPE.md' },
  { key: 'prd', label: 'PRD', file: '_PRD.md' },
  { key: 'plan', label: 'PLAN', file: '_PLAN.md' },
  { key: 'kod', label: 'kod', file: '_REVIEW.md' },
  { key: 'pamiec', label: 'pamięć', file: 'memory/' },
  { key: 'review', label: 'review', file: 'raport DoD' },
  { key: 'archiwum', label: 'archiwum', file: 'finished/' },
];

const SKILLS = [
  { label: 'plan-shape', from: 0, to: 1 },
  { label: 'plan-prd', from: 2, to: 3 },
  { label: 'plan-implement', from: 4, to: 7 },
];

/** Bramka stoi w odstępie za fazą o indeksie `after`. */
const GATES = [
  { after: 1, label: 'wywiad zamknięty' },
  { after: 2, label: 'potwierdzenie' },
  { after: 3, label: 'plan zamknięty' },
  { after: 6, label: 'ready' },
];

/** Pętle powrotne z `STANDARDY.md` 3.2: obalone założenie z PRD i otwarte `Block: yes` widziane przy implementacji. */
const LOOPS = [
  { from: 3, to: 2, label: 'obalone założenie', depth: 56, fromDx: -20, toDx: 20 },
  { from: 4, to: 2, label: 'Block: yes', depth: 112, fromDx: 0, toDx: -20 },
];

/** Geometria pudełek faz, gdy rząd zaczyna się na wysokości `top`. */
export function pipelineBoxes(top = 0) {
  return PHASES.map((phase, i) => {
    const x = i * (PIPE.w + PIPE.gap);
    return { ...phase, i, x, y: top, w: PIPE.w, h: PIPE.h, cx: x + PIPE.w / 2, cy: top + PIPE.h / 2 };
  });
}

const renderPhase = (b) => `<g class="fl-node is-blue pl-phase">
    <rect class="fl-box" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" />
    <text class="fl-label" x="${b.cx}" y="${b.cy - 3}" text-anchor="middle">${b.label}</text>
    <text class="fl-sub" x="${b.cx}" y="${b.cy + 25}" text-anchor="middle">${b.file}</text>
  </g>`;

/**
 * Składa diagram z rzędem faz na wysokości `top`. Każda warstwa jest osobnym napisem SVG, żeby slajd
 * mógł wybrać, co pokazuje, i animować warstwy osobno po klasach: `.pl-phase`, `.pl-arrow` (w kolejności
 * faz, strzałka i prowadzi do fazy i + 1), `.pl-skill`, `.pl-gate`, `.pl-loop`. Skille i bramki potrzebują
 * około 90 px nad rzędem, pętle około 260 px pod jego górną krawędzią.
 */
export function renderPipeline(top = 0) {
  const boxes = pipelineBoxes(top);
  const cy = boxes[0].cy;
  const bottom = top + PIPE.h + 4;

  const phases = boxes.map(renderPhase).join('');
  const arrows = boxes
    .slice(1)
    .map((b, i) => hArrow(boxes[i].x + PIPE.w + 5, b.x - 4, cy, 'pl-arrow'))
    .join('');

  const skills = SKILLS.map((s) => {
    const x1 = boxes[s.from].x;
    const x2 = boxes[s.to].x + PIPE.w;
    const y = top - 62;
    return `<g class="pl-skill">
      <path class="pl-skill-line" d="M${x1} ${y + 10} V${y} H${x2} V${y + 10}" />
      <text class="pl-skill-label" x="${(x1 + x2) / 2}" y="${y - 12}" text-anchor="middle">${s.label}</text>
    </g>`;
  }).join('');

  const gates = GATES.map((g) => {
    const x = boxes[g.after].x + PIPE.w + PIPE.gap / 2;
    return `<g class="pl-gate">
      <path class="pl-gate-line" d="M${x} ${top - 12} V${cy - 13}" />
      <path class="pl-gate-mark" d="M${x} ${cy - 12} l12 12 l-12 12 l-12 -12 z" />
      <text class="pl-gate-label" x="${x}" y="${top - 26}" text-anchor="middle">${g.label}</text>
    </g>`;
  }).join('');

  const loops = LOOPS.map((l) => {
    const fx = boxes[l.from].cx + l.fromDx;
    const tx = boxes[l.to].cx + l.toDx;
    const yb = bottom + l.depth;
    return `<g class="pl-loop">
      <path class="pl-loop-line" d="M${fx} ${bottom} V${yb - 14} Q${fx} ${yb} ${fx - 14} ${yb} H${tx + 14} Q${tx} ${yb} ${tx} ${yb - 14} V${bottom + 12}" />
      <path class="pl-loop-head" d="M${tx} ${bottom} l-7 12 h14 z" />
      <text class="pl-loop-label" x="${(fx + tx) / 2}" y="${yb + 26}" text-anchor="middle">${l.label}</text>
    </g>`;
  }).join('');

  return { boxes, phases, arrows, skills, gates, loops };
}
