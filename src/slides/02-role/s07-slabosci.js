import { gsap } from 'gsap';

import { ARROW } from '../../components/icons.js';
import './role.css';

/** Trzy słabości z tezy (0.3) i to, co w quantasku każdą z nich łata (`STANDARDY.md` 4.6). */
const ROWS = [
  {
    weak: 'zgaduje kontrakt',
    mech: '<span class="tag is-orange">nawigacja</span><span class="tag">Block: yes</span><span class="tag">4 sygnały trafności</span>',
  },
  {
    weak: 'dorabia fallbacki',
    mech: '<span class="tag is-orange">hierarchia rdzenia</span><span class="tag">2. brak zgadywania kontraktu</span><span class="gt">&gt;</span><span class="tag">3. zgodność ze standardem</span>',
  },
  {
    weak: 'halucynuje',
    mech: '<span class="tag is-orange">dowód w PLAN</span><span class="tag">kod:</span><span class="tag">cmd:</span><span class="tag">db:</span><span class="tag">dok:</span><span class="tag">ZAŁOŻENIE:</span>',
  },
];

/** Słabość i mechanizm: etykiety z tezy wracają, a każde kliknięcie dokłada mechanizm do jednej z nich. */
export default {
  id: 'slabosci',
  stage: 'role',
  summary: 'trzy słabości agenta i mechanizmy quantaska, które je łatają',
  html: `
    <h2 class="slide-title">Słabość i mechanizm</h2>
    <div class="canvas weak-grid">
      ${ROWS.map((r) => `<span class="tag is-alert">${r.weak}</span><span class="weak-arrow">${ARROW}</span><div class="weak-mech">${r.mech}</div>`).join('')}
    </div>`,
  notes: `
    <p>Wracają trzy czerwone etykiety z tezy. Teraz do każdej dokładamy mechanizm z quantaska, który ją łata.</p>
    <p>[klik] Zgadywanie kontraktu: agent wie, gdzie szukać, bo prowadzi go mapa. Temat oznaczony jako Block: yes albo trafiający w jeden z czterech sygnałów trafności wymusza pytanie, nawet jeśli agent coś w repozytorium znalazł.</p>
    <p>[klik] Fallbacki: w hierarchii rdzenia brak zgadywania kontraktu stoi wyżej niż zgodność ze standardem. Żaden parametr procesu nie zwalnia agenta z pytania o nieznany kontrakt.</p>
    <p>[klik] Halucynacje: każdy fakt w PLAN ma dowód z kodu, komendy, bazy albo dokumentu. Jeśli dowodu nie ma, musi stać jawne ZAŁOŻENIE. Format nie gwarantuje prawdy, ale podnosi koszt zmyślenia i robi je widocznym przy czytaniu.</p>`,

  animate(root) {
    const arrows = [...root.querySelectorAll('.weak-arrow')];
    const mechs = [...root.querySelectorAll('.weak-mech')];
    gsap.set([...arrows, ...mechs], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.weak-grid > .tag'), { opacity: 0, x: -20, duration: 0.4, stagger: 0.15 });
      },
      ...ROWS.map((_, i) => (tl) => {
        tl.to([arrows[i], mechs[i]], { opacity: 1, duration: 0.4, stagger: 0.15 });
      }),
    ];
  },
};
