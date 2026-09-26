/**
 * Rząd tokenów jak w Tiktokenizerze: kawałki tekstu na naprzemiennym tle, spacje zachowane
 * wewnątrz tokenu (bez znaczników), opcjonalnie z numerem tokenu pod spodem.
 * Szerokość liczona z metryki fontu mono (0,6 em), bez pomiarów DOM (D-005).
 */

const ID_FONT = 15;

/** Szerokość jednego tokenu: tekst z marginesem, ale nie węższa niż jego numer pod spodem. */
export function chipWidth([text, id], { font = 32, pad = 6, ids = false } = {}) {
  const textW = text.length * font * 0.6 + pad * 2;
  return ids ? Math.max(textW, String(id).length * ID_FONT * 0.6 + 10) : textW;
}

export function chipsWidth(tokens, { gap = 3, ...opts } = {}) {
  return tokens.reduce((w, token) => w + chipWidth(token, opts) + gap, -gap);
}

/** `tokens`: lista `[tekst, id]`. Zwraca znacznik SVG `<g>` z klasą `cls`. */
export function renderChips(tokens, { x = 0, y = 0, font = 32, pad = 6, gap = 3, ids = false, cls = '' } = {}) {
  const h = font * 1.45;
  let cx = x;
  const chips = tokens.map(([text, id], i) => {
    const w = chipWidth([text, id], { font, pad, ids });
    const textX = cx + (w - (text.length * font * 0.6 + pad * 2)) / 2 + pad;
    const chip = `<g class="chip chip--${i % 2 ? 'b' : 'a'}" data-i="${i}">
      <rect x="${cx}" y="${y}" width="${w}" height="${h}" rx="4" />
      <text class="t-mono chip-text" x="${textX}" y="${y + h * 0.72}" style="font-size:${font}px">${escape(text)}</text>
      ${ids ? `<text class="t-mono chip-id" x="${cx + w / 2}" y="${y + h + 22}" text-anchor="middle">${id}</text>` : ''}
    </g>`;
    cx += w + gap;
    return chip;
  });
  return `<g class="chips ${cls}">${chips.join('')}</g>`;
}

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
