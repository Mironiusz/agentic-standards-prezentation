/**
 * Karta pliku w HTML: pasek ze ścieżką jak zakładka edytora, a pod nim nagłówek sekcji i fragment treści.
 * Służy do pokazywania fragmentów prawdziwych plików z repozytorium (bloki 4 i 5). Fragment do
 * podświetlenia slajd oznacza w `body` znacznikiem `<mark>`, a animacja zapala go klasą `.is-on`.
 */
export function fileCard({ path, heading = '', body, cls = '' }) {
  const head = heading ? `<div class="fc-heading">${heading}</div>` : '';
  return `<div class="file-card ${cls}">
    <div class="fc-path">${path}</div>
    <div class="fc-body">${head}${body}</div>
  </div>`;
}
