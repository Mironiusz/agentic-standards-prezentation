import { gsap } from 'gsap';

import { fileCard } from '../../components/file-card.js';
import { ARROW } from '../../components/icons.js';
import './granice.css';

/** Cztery wiersze tabeli "Co otworzyć przed zadaniem" z mapy standardów (stan na 2026-10-01). */
const TABLE = `<table class="mh-table">
  <tr><td>Konfiguracja i sekrety</td><td>standard_config.md</td></tr>
  <tr><td>Logowanie</td><td>standard_logging.md</td></tr>
  <tr><td>Obsługa błędów, ponowienia, limity czasu</td><td>standard_errors.md</td></tr>
  <tr><td>Idempotencja, uzgadnianie, deduplikacja</td><td>standard_idempotency.md<br />MVP.md par. 6.6</td></tr>
</table>`;

const SOURCES = ['MVP.md', 'standard', 'CLAUDE.md'];
const RULES = ['1. poprawność danych', '2. brak zgadywania kontraktu', '3. zgodność z docs/standards', '4. czytelność', '5. wydajność', '6. DRY'];

const ladder = (head, items, hi = []) => `<div class="ladder">
    <span class="ladder-head">${head}</span>
    ${items.map((item, i) => `${i ? '<span class="ladder-gt">&gt;</span>' : ''}<span class="tag ${hi.includes(i) ? 'is-accent' : ''}">${item}</span>`).join('')}
  </div>`;

/** Mapa jako jedyne wejście do standardów i dwie drabiny rozstrzygania konfliktu, z rdzenia i z mapy. */
export default {
  id: 'mapa-hierarchia',
  stage: 'granice',
  summary: 'mapa standardów jako jedyne wejście i hierarchia przy konflikcie',
  html: `
    <h2 class="slide-title">Mapa i hierarchia</h2>
    <div class="canvas mh-grid">
      ${fileCard({ path: 'docs/standards/README.md', heading: '## Co otworzyć przed zadaniem', body: TABLE })}
      <div>
        <div class="ladders">
          <div class="mh-l1">${ladder('źródło prawdy', SOURCES)}</div>
          <div class="mh-l2">${ladder('zasada', RULES, [1, 2])}</div>
        </div>
        <div class="mh-signal"><span class="tag is-violet">dwa źródła się kłócą ${ARROW} agent pyta</span></div>
      </div>
    </div>`,
  notes: `
    <p>Mapa standardów w README.md jest jedynym wejściem do zbioru. Przekłada typ zadania na listę plików do otwarcia i jako jedyna mówi, który standard jest gotowy, a który częściowy.</p>
    <p>[klik] Kto wygrywa przy rozbieżności dokumentów: najpierw specyfikacja produktu w MVP.md, potem standard, a dopiero potem rdzeń w CLAUDE.md.</p>
    <p>[klik] Kto wygrywa przy konflikcie zasad: tu najważniejsze jest to, że punkt drugi, brak zgadywania kontraktu, stoi nad punktem trzecim, czyli zgodnością ze standardem.</p>
    <p>[klik] A gdy dwa źródła się kłócą, to jest pierwszy sygnał trafności: agent pyta człowieka, zamiast po cichu wybrać jedną wersję.</p>`,

  animate(root) {
    const steps = ['.mh-l1', '.mh-l2', '.mh-signal'].map((sel) => root.querySelector(sel));
    gsap.set(steps, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelector('.file-card'), { opacity: 0, y: 18, duration: 0.5 });
      },
      ...steps.map((el) => (tl) => {
        tl.to(el, { opacity: 1, duration: 0.4 });
      }),
    ];
  },
};
