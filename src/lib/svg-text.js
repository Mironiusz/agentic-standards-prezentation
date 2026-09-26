/**
 * Kilka linii tekstu w SVG. SVG nie zawija tekstu sam, więc podziały robimy ręcznie:
 * treść podajemy jako listę linii, a `svgLines` składa je w jeden `<text>` z `<tspan>`.
 */
export function svgLines(lines, { x = 0, y = 0, lineH = 30, cls = '', anchor = 'start' } = {}) {
  const spans = lines.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineH}">${line}</tspan>`).join('');
  return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${spans}</text>`;
}

/**
 * Łamie tekst na linie po najwyżej `maxChars` znakach, tylko na spacjach.
 * Bez pomiarów DOM (D-005): długość szacujemy w znakach, a nie w pikselach.
 */
export function wrapText(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
