import './workflow.css';

/**
 * Liczby z quantaska na 2026-10-01 (`STANDARDY.md` 4.5). Do odświeżenia tuż przed prezentacją.
 *
 * Odpowiedzi na pytania agenta nie mają licznika w repozytorium, bo notatka po odpowiedzi trafia do sekcji
 * artefaktu bez stałego znacznika. Liczba pochodzi z transkryptów Claude Code dla quantaska
 * (`~/.claude/projects/C--Quanta-quantask`, od 2026-08-10, czyli od pierwszego commita w `plans/`):
 * pytania zadane przez `AskUserQuestion`, na które przyszła odpowiedź, bez powtórzeń po identyfikatorze wywołania.
 * Nie obejmuje pytań otwartych zadanych zwykłym tekstem ani sesji Codeksa, więc jest dolnym oszacowaniem.
 */
const STATS = [
  { n: 166, label: 'inicjatyw w archiwum' },
  { n: 14, label: 'inicjatyw w toku' },
  { n: 211, label: 'seedów' },
  { n: 369, label: 'wpisów pamięci' },
  { n: 1395, label: 'odpowiedzi na pytania agenta' },
];

/** Liczniki, które po wejściu na slajd odliczają w górę do wartości z repozytorium. */
export default {
  id: 'skala',
  stage: 'workflow',
  summary: 'skala: ile inicjatyw przeszło przez łańcuch w quantasku',
  html: `
    <h2 class="slide-title">Skala</h2>
    <div class="canvas stats">
      ${STATS.map((s) => `<div class="stat"><span class="stat-num">${s.n}</span><span class="stat-label">${s.label}</span></div>`).join('')}
    </div>
    <p class="footnote">stan na 2026-10-01 - odpowiedzi: pytania zamknięte w Claude Code, bez otwartych</p>`,
  notes: `<p>Żeby było jasne, że to nie eksperyment: tyle inicjatyw jest w archiwum quantaska, tyle w toku, tyle powstało seedów i wpisów pamięci. Ostatnia liczba mówi najwięcej o samym procesie: na tyle pytań agenta odpowiedział człowiek w tych inicjatywach. Liczone są tylko pytania zamknięte, z wyborem opcji, więc prawdziwa liczba jest jeszcze wyższa. Każda taka odpowiedź to miejsce, w którym agent nie zgadywał.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.from(root.querySelectorAll('.stat'), { opacity: 0, y: 20, duration: 0.4, stagger: 0.1 });
        tl.from(root.querySelectorAll('.stat-num'), { textContent: 0, duration: 1.4, ease: 'power2.out', snap: { textContent: 1 }, stagger: 0.1 }, 0.2);
      },
    ];
  },
};
