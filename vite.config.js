import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Build daje jeden samowystarczalny plik dist/index.html (JS, CSS i fonty w środku), który działa
 * otwarty z dysku, bez serwera i bez internetu (D-003).
 */

/** Podzbiory znaków Fontsource, których polska prezentacja nie używa (D-012). */
const SUBSETS_OUT = /-(cyrillic|cyrillic-ext|greek|greek-ext|vietnamese)-/;

/**
 * W jednym pliku każdy font ląduje w środku jako base64, więc waży tam, ile naprawdę waży.
 * Fontsource i KaTeX dają ten sam krój w kilku formatach naraz (woff2, woff, ttf), a Fontsource
 * dokłada podzbiory znaków spoza latin i latin-ext. Wtyczka odsiewa jedno i drugie w źródle CSS,
 * zanim Vite zauważy te pliki, bo plik bez odwołania nie trafia do builda (D-012).
 *
 * Najpierw znikają całe reguły `@font-face` zbędnych podzbiorów. Pozostałe zostają z `unicode-range`
 * nietkniętym, bo to on decyduje, który plik obsługuje które znaki. Potem z `src` każdej reguły
 * zostaje sam woff2, który obsługuje każda przeglądarka od 2017 roku.
 */
function trimFonts() {
  return {
    name: 'trim-fonts',
    enforce: 'pre',
    transform(code, id) {
      if (!id.split('?')[0].endsWith('.css') || !code.includes('@font-face')) return null;

      let out = code.replace(/@font-face\s*{[^}]*}/g, (rule) => (SUBSETS_OUT.test(rule) ? '' : rule));
      out = out.replace(/src:\s*([^;}]+)/g, (whole, sources) => {
        if (!sources.includes('woff2')) return whole;
        const kept = sources
          .split(/,(?![^(]*\))/)
          .map((part) => part.trim())
          .filter((part) => part.includes('woff2'));
        return `src: ${kept.join(', ')}`;
      });

      return out === code ? null : { code: out, map: null };
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [trimFonts(), viteSingleFile()],
  build: { target: 'es2022' },
});
