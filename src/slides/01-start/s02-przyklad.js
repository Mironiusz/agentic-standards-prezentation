import { gsap } from 'gsap';

import { flowRow } from '../../components/flow.js';
import './start.css';

const FLOW = flowRow(
  [
    { label: 'Wejście na slajd', sub: 'intro gra samo', cls: 'is-blue' },
    { label: 'Pierwszy klik', sub: 'krok 1', cls: 'is-violet' },
    { label: 'Drugi klik', sub: 'krok 2', cls: 'is-accent' },
  ],
  { left: 130, cy: 100, w: 340, h: 96, gap: 80 },
);

/**
 * Slajd przykładowy: pokazuje API modułu slajdu (intro plus dwa kroki, notatki z [klik], mapa etapów
 * przez `stage`) i komponent `flowRow`. Do usunięcia razem z wpisami w `index.js` i `timing.js`.
 */
export default {
  id: 'przyklad',
  stage: 'przyklad',
  html: `
    <h2 class="slide-title">Przykładowy slajd: kroki animacji</h2>
    <p class="ex-lead">Każdy segment zwrócony z <span class="mono">animate()</span> to jedno kliknięcie pilota.
      Krok wstecz ustawia stan od razu, bez animacji.</p>
    <svg class="ex-flow" viewBox="0 0 1440 200" width="1440" height="200" aria-hidden="true">${FLOW.svg}</svg>
    <p class="footnote">Slajd przykładowy silnika. Własne slajdy opisuje docs/conventions.md.</p>`,
  notes: `
    <p>Intro pokazuje tytuł i pierwsze pudełko, gra samo po wejściu na slajd.</p>
    <p>[klik] Pojawia się strzałka i drugie pudełko.</p>
    <p>[klik] Trzecie pudełko. Liczbę kliknięć w notatkach porównuje z liczbą kroków npm run snapshots.</p>`,

  animate(root) {
    const nodes = [...root.querySelectorAll('.fl-node')];
    const arrows = [...root.querySelectorAll('.fl-arrow')];
    gsap.set([...nodes.slice(1), ...arrows], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.slide-title, .ex-lead'), { opacity: 0, y: 16, duration: 0.5, stagger: 0.12 });
        tl.from(nodes[0], { opacity: 0, y: 12, duration: 0.4 });
      },
      (tl) => {
        tl.to([arrows[0], nodes[1]], { opacity: 1, duration: 0.4, stagger: 0.15 });
      },
      (tl) => {
        tl.to([arrows[1], nodes[2]], { opacity: 1, duration: 0.4, stagger: 0.15 });
      },
    ];
  },
};
