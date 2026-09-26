import katex from 'katex';
import 'katex/dist/katex.min.css';

const MINUS = '\u2212';

/**
 * Wzór LaTeX jako HTML (KaTeX ma własne fonty, więc pierwiastki i indeksy wyglądają wszędzie tak samo, D-006, D-008).
 * `\htmlClass{nazwa}{...}` pozwala pokolorować fragment wzoru klasą CSS.
 */
export function tex(source, { display = false } = {}) {
  return katex.renderToString(source, { displayMode: display, throwOnError: true, strict: false, trust: (context) => context.command === '\\htmlClass' });
}

/**
 * Liczba po polsku: przecinek dziesiętny i prawdziwy znak minus (U+2212), np. `decimal(-1.1)` daje "-1,1"
 * z typograficznym minusem. Zero po zaokrągleniu nie dostaje minusa.
 */
export function decimal(v, digits = 1) {
  const s = Math.abs(v).toFixed(digits).replace('.', ',');
  return v < 0 && Number(s.replace(',', '.')) !== 0 ? `${MINUS}${s}` : s;
}
