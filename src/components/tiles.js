/**
 * Kafelek w SVG: zaokrąglony prostokąt z podpisem w jednej albo kilku liniach, wyśrodkowanym w pionie.
 * Wspólny dla kafelków standardów, obszarów mapy infra i małych etykiet na diagramach.
 * Kolor wybiera klasa `is-*` (style `.tile` w `src/styles/components.css`), a `is-ghost` rysuje
 * sam przerywany kontur z wyciszonym podpisem. `dy` przesuwa podpis w pionie, a `sub` dokłada pod nim
 * drugą, mniejszą linię (podpis podnosi się wtedy sam). Geometria bez pomiarów DOM (D-005).
 */
export function svgTile({ x, y, w, h, lines, cls = '', font = 20, lineH = Math.round(font * 1.2), rx = 8, dy = 0, sub = '', attrs = '' }) {
  const cx = x + w / 2;
  const shift = sub ? -12 : 0;
  const first = y + h / 2 - ((lines.length - 1) * lineH) / 2 + font * 0.35 + dy + shift;
  const spans = lines.map((line, i) => `<tspan x="${cx}" y="${first + i * lineH}">${line}</tspan>`).join('');
  const subLine = sub ? `<text class="tile-sub" x="${cx}" y="${first + (lines.length - 1) * lineH + 28}" text-anchor="middle">${sub}</text>` : '';
  return `<g class="tile ${cls}" ${attrs}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" />
    <text text-anchor="middle" style="font-size:${font}px">${spans}</text>
    ${subLine}
  </g>`;
}

/**
 * Dzieli nazwę standardu na dwie linie po podkreślniku, gdy jest dłuższa niż `max` znaków
 * (np. `agentic_workflow`), żeby zmieściła się w wąskim kafelku.
 */
export function splitKey(key, max) {
  const cut = key.indexOf('_');
  if (key.length <= max || cut < 0) return [key];
  return [key.slice(0, cut + 1), key.slice(cut + 1)];
}
