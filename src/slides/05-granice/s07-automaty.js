import { gsap } from 'gsap';

import { fileCard } from '../../components/file-card.js';
import { CHECK } from '../../components/icons.js';
import { token } from '../../lib/theme.js';
import './granice.css';

/** Linie z obu kopii roli `dod-reviewer` (stan na 2026-10-01), skrócone do liczby standardów. */
const lines = (rows) => rows.map(([n, text]) => `<div><span class="ln">${n}</span>${text}</div>`).join('');

const CLAUDE = lines([
  ['15', '...wszystkich <mark>dziewiętnastu</mark> standardów z tej mapy...'],
  ['30', '- Weryfikacja: wszystkie <mark>osiemnaście</mark> standardów...'],
]);

const CODEX = lines([
  ['6', '...wszystkich <mark>dziewiętnastu</mark> standardów z tej mapy...'],
  ['21', '- Weryfikacja: wszystkie <mark>osiemnaście</mark> standardów...'],
]);

/** Granice automatów: test parytetu jest zielony, bo obie kopie mają ten sam błąd. Bonus: bramka, której nikt nie oglądał. */
export default {
  id: 'automaty',
  stage: 'granice',
  summary: 'granice automatów: zielony test nie znaczy, że treść jest prawdziwa',
  html: `
    <h2 class="slide-title">Granice automatów</h2>
    <div class="canvas">
      <div class="auto-cards">
        <div class="au-claude">${fileCard({ path: '.claude/agents/dod-reviewer.md', body: CLAUDE })}</div>
        <div class="au-codex">${fileCard({ path: '.codex/agents/dod-reviewer.toml', body: CODEX })}</div>
      </div>
      <div class="auto-row au-parity"><span class="tag is-mint">${CHECK} test_agent_docs_parity.py</span><span class="muted">identyczne, więc zielone</span></div>
      <div class="auto-row au-bonus"><span class="tag is-alert">ruff format --check: czerwony na gałęzi</span><span class="muted">nikt nie zgłosił</span></div>
    </div>`,
  notes: `
    <p>Granice automatów na przykładzie roli dod-reviewer, czyli subagenta, który robi review w Claude Code.</p>
    <p>[klik] W jednym pliku stoją dwie liczby standardów: dziewiętnaście i osiemnaście. Liczba standardów jest zapisana w wielu miejscach i jedna kopia została w tyle, czyli to znowu problem dwóch adresów.</p>
    <p>[klik] Ta sama para stoi w kopii tej roli dla Codeksa. Test parytetu jest zielony, bo obie kopie są identyczne. Ten test sprawdza identyczność, a nie prawdę.</p>
    <p>[klik] Bonus z sekcji długów w mapie: bramka formatowania stała czerwona na gałęzi i nikt tego nie zgłosił. Automat pomaga tylko wtedy, gdy ktoś patrzy na jego wynik.</p>`,

  animate(root) {
    const marks = root.querySelectorAll('.au-claude mark');
    const codex = root.querySelector('.au-codex');
    const codexMarks = codex.querySelectorAll('mark');
    const parity = root.querySelector('.au-parity');
    const bonus = root.querySelector('.au-bonus');
    gsap.set([codex, parity, bonus], { opacity: 0 });
    gsap.set([...marks, ...codexMarks], { backgroundColor: 'rgba(0, 0, 0, 0)' });
    const alert = { backgroundColor: token('--c-alert-soft'), color: token('--c-alert') };

    return [
      (tl) => {
        tl.from(root.querySelector('.au-claude'), { opacity: 0, y: 18, duration: 0.5 });
      },
      (tl) => {
        tl.to(marks, { ...alert, duration: 0.4, stagger: 0.2 });
      },
      (tl) => {
        tl.set(codexMarks, alert);
        tl.to([codex, parity], { opacity: 1, duration: 0.4, stagger: 0.3 });
      },
      (tl) => {
        tl.to(bonus, { opacity: 1, duration: 0.4 });
      },
    ];
  },
};
