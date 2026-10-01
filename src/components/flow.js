/**
 * Diagramy przepływu: prostokąty połączone strzałkami, w pionie albo w poziomie (D-009).
 * Wspólne dla wszystkich slajdów z przepływami, żeby miały ten sam rytm i te same odstępy.
 *
 * Węzeł: `{ label, sub, cls, w, h, plain }`. `plain` rysuje sam podpis, bez ramki.
 * Zwracane `boxes` mają gotową geometrię (x, y, w, h, cx, cy) do podpięcia animacji
 * i do rysowania własnych połączeń. Style: `.fl-*` w `src/styles/components.css`,
 * a kolor węzła wybiera `cls`: `is-accent`, `is-blue`, `is-orange`, `is-mint`, `is-violet`, `is-pink`, `is-alert`, `is-dim`.
 */

export const FLOW = { w: 320, h: 64, gap: 38 };

function renderNode(node, i) {
  const labelY = node.y + node.h / 2 + (node.sub ? -2 : 9);
  return `<g class="fl-node ${node.cls ?? ''}" data-i="${i}">
    ${node.plain ? '' : `<rect class="fl-box" x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="10" />`}
    <text class="fl-label" x="${node.cx}" y="${labelY}" text-anchor="middle">${node.label}</text>
    ${node.sub ? `<text class="fl-sub" x="${node.cx}" y="${node.y + node.h / 2 + 24}" text-anchor="middle">${node.sub}</text>` : ''}
  </g>`;
}

/** Strzałka w dół od `y1` do `y2` (grot kończy się dokładnie na `y2`). */
export const vArrow = (x, y1, y2, cls = '') => `<g class="fl-arrow ${cls}"><path class="fl-link" d="M${x} ${y1} V${y2 - 11}" /><path class="fl-head" d="M${x} ${y2} l-7 -12 h14 z" /></g>`;

/** Strzałka w górę: od `yBottom` do `yTop` (grot na górze). */
export const vArrowUp = (x, yBottom, yTop, cls = '') =>
  `<g class="fl-arrow ${cls}"><path class="fl-link" d="M${x} ${yBottom} V${yTop + 11}" /><path class="fl-head" d="M${x} ${yTop} l-7 12 h14 z" /></g>`;

/** Strzałka w prawo od `x1` do `x2`. */
export const hArrow = (x1, x2, y, cls = '') => `<g class="fl-arrow ${cls}"><path class="fl-link" d="M${x1} ${y} H${x2 - 11}" /><path class="fl-head" d="M${x2} ${y} l-12 -7 v14 z" /></g>`;

function place(nodes, step, geom) {
  return nodes.map((node, i) => {
    const w = node.w ?? geom.w;
    const h = node.h ?? geom.h;
    return { ...node, ...step(i, w, h), w, h };
  });
}

/** Kolumna pudełek wyśrodkowana na `cx`, od `top` w dół. */
export function flowColumn(nodes, { cx = 0, top = 0, w = FLOW.w, h = FLOW.h, gap = FLOW.gap } = {}) {
  let y = top;
  const boxes = place(
    nodes,
    (i, bw, bh) => {
      const box = { x: cx - bw / 2, y, cx, cy: y + bh / 2 };
      y += bh + gap;
      return box;
    },
    { w, h },
  );
  const svg = boxes.map((b, i) => (i > 0 ? vArrow(cx, boxes[i - 1].y + boxes[i - 1].h + 6, b.y - 4) : '') + renderNode(b, i)).join('');
  return { svg, boxes, bottom: y - gap };
}

/** Rząd pudełek na wysokości `cy`, od `left` w prawo. */
export function flowRow(nodes, { left = 0, cy = 0, w = FLOW.w, h = FLOW.h, gap = FLOW.gap } = {}) {
  let x = left;
  const boxes = place(
    nodes,
    (i, bw, bh) => {
      const box = { x, y: cy - bh / 2, cx: x + bw / 2, cy };
      x += bw + gap;
      return box;
    },
    { w, h },
  );
  const svg = boxes.map((b, i) => (i > 0 ? hArrow(boxes[i - 1].x + boxes[i - 1].w + 6, b.x - 4, cy) : '') + renderNode(b, i)).join('');
  return { svg, boxes, right: x - gap };
}
