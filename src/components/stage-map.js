/**
 * Mini-mapa etapów w prawym dolnym rogu slajdu: rząd prostokątów połączonych strzałkami,
 * z podświetlonym etapem, na którym jest bieżący slajd.
 *
 * Lista etapów należy do prezentacji (`src/slides/stages.js`), a slajd wybiera etap polem `stage`.
 * Geometria bez pomiarów DOM (D-005): IBM Plex Mono ma stałą szerokość znaku 0,6 em.
 * Skrajne prostokąty stoją na krawędziach rysunku, a obrys ma 1,5 px, więc `EDGE` daje mu miejsce
 * w `viewBox`, żeby nie był ucinany (D-012). Style: `.stage-map` w `src/styles/components.css`.
 */

const FONT = 15;
const CHAR = FONT * 0.6;
const PAD = 10;
const GAP = 22;
const H = 30;
const TOP = 8;
const EDGE = 2;

/**
 * Rysuje mapę etapów `stages` (lista `{ key, label }`) z podświetlonym etapem `active`.
 * Nieznany klucz to błąd w module slajdu, więc funkcja go zgłasza, zamiast rysować mapę bez podświetlenia.
 */
export function renderStageMap(stages, active) {
  if (!stages.some((s) => s.key === active)) throw new Error(`Mapa etapów: nie ma etapu "${active}" w src/slides/stages.js`);

  let x = 0;
  const nodes = [];
  const arrows = [];
  stages.forEach((stage, i) => {
    const w = stage.label.length * CHAR + PAD * 2;
    nodes.push({ ...stage, x, w });
    x += w;
    if (i < stages.length - 1) {
      arrows.push(x + (GAP - 6) / 2);
      x += GAP;
    }
  });

  const midY = TOP + H / 2;
  const nodeSvg = nodes
    .map(
      (n) => `<g class="sm-node${n.key === active ? ' is-active' : ''}">
        <rect x="${n.x}" y="${TOP}" width="${n.w}" height="${H}" rx="6" />
        <text x="${n.x + n.w / 2}" y="${midY + 5}" text-anchor="middle">${n.label}</text>
      </g>`,
    )
    .join('');
  const arrowSvg = arrows.map((ax) => `<path class="sm-arrow" d="M${ax} ${midY - 5} l6 5 l-6 5" />`).join('');

  const width = x + EDGE * 2;
  const height = H + TOP * 2;
  return `<svg class="stage-map" viewBox="${-EDGE} 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Mapa etapów, bieżący etap: ${active}">
    ${arrowSvg}${nodeSvg}
  </svg>`;
}
