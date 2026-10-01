import { gsap } from 'gsap';

import { ARROW, CROSS } from '../../components/icons.js';
import './granice.css';

const sep = (icon) => `<span class="case-sep">${icon}</span>`;

/**
 * Trzy rozjazdy z quantaska na 2026-10-01, wybrane z pięciu z `PLAN_SLAJDY.md` 5.6: status w dwóch miejscach
 * (mapa kontra `standard_time.md`), pogrubienia (`code_quality` kontra `formatting`) i martwe odsyłacze z numerem linii
 * (sekcja długów w mapie).
 */
const CASES = [
  {
    label: 'status w dwóch miejscach',
    flow: `<span class="tag">README.md: częściowy</span>${sep(CROSS)}<span class="tag">standard_time.md: gotowy</span>${sep(ARROW)}<span class="tag is-alert">agent nie zapyta</span>`,
  },
  {
    label: 'para z bloku 4',
    flow: `<span class="tag">code_quality: pogrubienie z umiarem</span>${sep(CROSS)}<span class="tag">formatting: zakaz</span>${sep(ARROW)}<span class="tag is-mint">test: wersja formatting</span>`,
  },
  {
    label: 'odsyłacz z numerem linii',
    flow: `<span class="case-big">3 / 6</span><span class="tag is-alert is-struck">VERSION_2_STATUS.md:1603-1607</span>${sep(ARROW)}<span class="tag">odsyłacz do sekcji</span>`,
  },
];

/** Gdy reguła albo fakt ma dwa adresy: trzy prawdziwe przypadki, każdy na jedno kliknięcie. */
export default {
  id: 'sypie-sie',
  stage: 'granice',
  summary: 'trzy prawdziwe rozjazdy z repozytorium quantaska',
  html: `
    <h2 class="slide-title">Gdy to się sypie</h2>
    <div class="canvas cases">
      ${CASES.map((c) => `<div class="case"><span class="case-label">${c.label}</span><div class="case-flow">${c.flow}</div></div>`).join('')}
    </div>`,
  notes: `
    <p>Trzy przypadki z repozytorium quantaska, w których fakt albo reguła miały dwa adresy i się rozjechały.</p>
    <p>[klik] Status standardu czasu: mapa mówi częściowy, a sam plik mówi gotowy. Status częściowy każe agentowi pytać, więc agent, który przeczyta sam plik, nie zapyta.</p>
    <p>[klik] Para z poprzedniego bloku: code_quality dopuszcza pogrubienia z umiarem, a formatting zakazuje ich całkowicie. Test egzekwuje wersję z formatting, więc tekst jednego standardu mówi co innego niż automat.</p>
    <p>[klik] Odsyłacze z numerem linii do cudzego pliku: z sześciu takich odsyłaczy trzy były martwe, bo treść przesunęła się w pliku. Praktyczna rada: odsyłaj do sekcji, a nie do linii.</p>`,

  animate(root) {
    const cases = [...root.querySelectorAll('.case')];
    gsap.set(cases, { opacity: 0 });

    return [
      null,
      ...cases.map((c) => (tl) => {
        tl.to(c, { opacity: 1, duration: 0.4 });
      }),
    ];
  },
};
