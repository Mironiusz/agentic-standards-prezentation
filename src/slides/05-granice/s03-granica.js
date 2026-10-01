import { gsap } from 'gsap';

import { fileCard } from '../../components/file-card.js';
import { token } from '../../lib/theme.js';
import './granice.css';

/** Fragmenty sekcji "Czego tu nie ma" z obu standardów (stan na 2026-10-01). Zdanie graniczne jest w `<mark>`. */
const ERRORS = `<ul>
  <li class="gb-other">format zapisu błędu w logu... - to <code>standard_logging.md</code>;</li>
  <li><mark>czy ponowienie zdubluje efekt - to <code>standard_idempotency.md</code>; ten standard mówi, czy ponawiać, tamten, czy ponowienie jest bezpieczne;</mark></li>
  <li class="gb-other">strategia ponawiania pojedynczego wywołania systemu zewnętrznego - to <code>standard_architecture.md</code>;</li>
</ul>`;

const IDEMPOTENCY = `<ul>
  <li class="gb-other">Dostęp do danych, struktura zapytań i połączenie z bazą - to jest <code>standard_database.md</code>.</li>
  <li><mark>Zdanie rozstrzygające: błędy mówią, czy ponowić, idempotencja mówi, że to ponowienie jest bezpieczne...</mark></li>
</ul>`;

/** Granica między dwoma standardami: jedno zdanie zapisane po obu stronach. Kliknięcie je zapala, a resztę przygasza. */
export default {
  id: 'granica',
  stage: 'granice',
  summary: 'jak wygląda granica między dwoma standardami: errors i idempotency',
  html: `
    <h2 class="slide-title">Granica to jedno zdanie</h2>
    <div class="canvas bound-cards">
      ${fileCard({ path: 'docs/standards/standard_errors.md', heading: 'Czego tu nie ma:', body: ERRORS })}
      ${fileCard({ path: 'docs/standards/standard_idempotency.md', heading: 'Czego tu nie ma:', body: IDEMPOTENCY })}
    </div>`,
  notes: `
    <p>Jak wygląda granica w praktyce, na przykładzie errors i idempotency. Każdy standard ma sekcję Zakres i granice, a w niej listę tego, czego w nim nie ma, z adresem sąsiada, który się tym zajmuje.</p>
    <p>[klik] Po obu stronach powtórzone jest tylko zdanie graniczne: błędy mówią, czy ponowić operację, a idempotencja, czy ponowienie jest bezpieczne. To zdanie jest adresem, a nie treścią reguły, więc wolno je powtórzyć.</p>`,

  animate(root) {
    const marks = root.querySelectorAll('mark');
    const others = root.querySelectorAll('.gb-other');
    gsap.set(marks, { backgroundColor: 'rgba(0, 0, 0, 0)' });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.file-card'), { opacity: 0, y: 18, duration: 0.5, stagger: 0.2 });
      },
      (tl) => {
        tl.to(marks, { backgroundColor: token('--accent-soft'), color: token('--accent'), duration: 0.4 });
        tl.to(others, { opacity: 0.4, duration: 0.4 }, '<');
      },
    ];
  },
};
