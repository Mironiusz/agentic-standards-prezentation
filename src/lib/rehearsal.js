/**
 * Pomiar próby z zegarem (D-010). Włącza się tylko z parametrem `?proba` w adresie.
 *
 * Mierzy, ile czasu slajd był na ekranie (sumując powroty), i trzyma wynik w localStorage,
 * więc odświeżenie strony go nie kasuje. Bez localStorage (np. zablokowanego w przeglądarce)
 * pomiar działa do odświeżenia strony. Po próbie w konsoli przeglądarki:
 * - `__proba()`: tabela czasów i gotowe wpisy do `src/slides/timing.js`;
 * - `__proba.reset()`: nowy pomiar.
 */

const KEY = 'proba-czasy';

export function isRehearsal() {
  return new URLSearchParams(window.location.search).has('proba');
}

export function startRehearsal(deck, slides) {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? {};
    } catch {
      return {};
    }
  };
  const times = load();
  let current = deck.getCurrentSlide()?.id;
  let since = performance.now();

  function flush() {
    const now = performance.now();
    if (current) times[current] = (times[current] ?? 0) + (now - since) / 1000;
    since = now;
    try {
      localStorage.setItem(KEY, JSON.stringify(times));
    } catch {}
  }

  deck.on('slidechanged', (event) => {
    flush();
    current = event.currentSlide.id;
  });
  window.addEventListener('pagehide', flush);

  window.__proba = () => {
    flush();
    const rows = slides.map((s) => ({ id: s.id, sekundy: Math.round(times[s.id] ?? 0) }));
    console.table(rows);
    const total = rows.reduce((sum, r) => sum + r.sekundy, 0);
    const entries = rows.map((r) => `  '${r.id}': ${Math.max(15, Math.round(r.sekundy / 15) * 15)},`).join('\n');
    return `Razem ${Math.round(total / 60)} min. Wpisy do src/slides/timing.js:\n${entries}`;
  };
  window.__proba.reset = () => {
    for (const id of Object.keys(times)) delete times[id];
    since = performance.now();
    flush();
  };

  console.info('Próba: czas slajdów jest mierzony. Po próbie wpisz w konsoli __proba().');
}
