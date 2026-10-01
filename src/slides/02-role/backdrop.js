import { pipelineBoxes, renderPipeline } from '../../components/pipeline.js';

/**
 * Tło slajdów bloku 2: ten sam pipeline co w bloku 1, przygaszony, w górnej części płótna.
 * Na nim slajdy nakładają role standardów. Pudełka zaczynają się na y = 10, więc nakładki rysujemy od y = 130.
 */

export const TOP = 10;
export const BOXES = pipelineBoxes(TOP);
const PIPE = renderPipeline(TOP);

export const backdrop = () => `<g class="role-pipe">${PIPE.arrows}${PIPE.phases}</g>`;

/** Akcentowy obrys z podpisem nad przygaszoną fazą: to, na co w tej chwili patrzymy. */
export function focusPhase(i) {
  const b = BOXES[i];
  return `<g class="role-focus">
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" />
    <text x="${b.cx}" y="${b.cy + 6}" text-anchor="middle">${b.label}</text>
  </g>`;
}

/** Intro wspólne dla slajdów bloku: tło wchodzi do swojej przygaszonej przezroczystości z CSS. */
export function enterBackdrop(tl, root) {
  tl.from(root.querySelectorAll('.role-pipe, .role-focus'), { opacity: 0, duration: 0.4 });
}
