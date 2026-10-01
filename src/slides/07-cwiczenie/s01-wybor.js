import { CANDIDATES } from '../../components/candidates.js';
import './cwiczenie.css';

/** Karty kandydatów do głosowania: nazwa, sąsiedzi i jedna informacja dodatkowa. */
export default {
  id: 'wybor',
  stage: 'cwiczenie',
  summary: 'głosowanie: który obszar opisujemy na ćwiczeniu',
  html: `
    <h2 class="slide-title">Wybieramy obszar</h2>
    <div class="canvas picks">
      ${CANDIDATES.map(
        (p, i) => `<div class="pick">
        <div class="pick-head"><span class="pick-num">${i + 1}</span>${p.name}</div>
        <span class="pick-label">sąsiedzi</span>
        <div class="pick-tags">${p.neighbours.map((n) => `<span class="tag is-orange">${n}</span>`).join('')}</div>
        <span class="pick-extra">${p.extra}</span>
      </div>`,
      ).join('')}
    </div>`,
  notes: `<p>Czterech kandydatów razem z sąsiadami, z którymi trzeba będzie narysować granice.</p>
    <p>Config jest najbezpieczniejszy, bo standard już istnieje i na koniec można porównać wyniki zespołów z prawdziwym plikiem. Minus: widzieliśmy go w bloku z przykładami, więc część odpowiedzi ludzie będą pamiętać. Potok CI wszyscy znają, a jego reguły stoją dziś w PRD zamkniętego zadania, a nie w standardzie. Kontenery i lokalne środowisko to czysty brak: są pliki compose, katalog docker i makefile, ale żadnych zapisanych reguł. Wydajność ma dziś tylko sekcję w code_quality, więc trzeba zdecydować, co z niej wyciągnąć do osobnego standardu.</p>
    <p>Głosujemy ręką. Wszystkie zespoły biorą ten sam obszar, żeby na koniec porównać, gdzie kto narysował granice.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.from(root.querySelectorAll('.pick'), { opacity: 0, y: 18, duration: 0.4, stagger: 0.12 });
      },
    ];
  },
};
