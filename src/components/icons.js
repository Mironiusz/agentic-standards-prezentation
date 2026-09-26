/**
 * Symbole, których nie ma w dołączonych fontach IBM Plex (strzałka, znak "w przybliżeniu", ptaszek, krzyżyk).
 * Przeglądarka wzięłaby je z fontu systemowego i na innym komputerze wyglądałyby inaczej, więc rysujemy je w SVG (D-006).
 * Rozmiar i kolor dziedziczą po tekście (1em, currentColor).
 */

const icon = (body, label) =>
  `<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-label="${label}">${body}</svg>`;

export const ARROW = icon('<path d="M3 12h16M13 6l6 6-6 6" />', 'do');
export const APPROX = icon('<path d="M4 9.5c2.7-2.6 5.3-2.6 8 0s5.3 2.6 8 0M4 16.5c2.7-2.6 5.3-2.6 8 0s5.3 2.6 8 0" />', 'w przybliżeniu');

/** Strzałka w prawo wewnątrz rysunku SVG: od (x, y) na długość `w`, na wysokości środka tekstu. */
export const svgArrow = (x, y, w = 28, cls = 'svg-arrow') => `<path class="${cls}" d="M${x} ${y} h${w - 6} M${x + w - 12} ${y - 7} l7 7 l-7 7" />`;

export const CHECK = icon('<path d="M4 12.5l5.5 5.5L20 6" />', 'tak');
export const CROSS = icon('<path d="M6 6l12 12M18 6L6 18" />', 'nie');

/** Ptaszek i krzyżyk wewnątrz rysunku SVG, wyśrodkowane w punkcie (x, y). */
export const svgCheck = (x, y, cls = '') => `<path class="svg-check ${cls}" d="M${x - 9} ${y} l6 7 l12 -15" />`;
export const svgCross = (x, y, cls = '') => `<path class="svg-cross ${cls}" d="M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16" />`;

/** Strzałka w dół wewnątrz rysunku SVG: od (x, y) na długość `h`. */
export const svgArrowDown = (x, y, h = 28, cls = 'svg-arrow') => `<path class="${cls}" d="M${x} ${y} v${h - 6} M${x - 7} ${y + h - 12} l7 7 l7 -7" />`;
