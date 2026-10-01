import { gsap } from 'gsap';

import './granice.css';

/** Strona pliku z jedną regułą: nagłówek z nazwą i linia reguły. Wersja zmieniona leży w tym samym miejscu, ukryta. */
const page = (x, name, rule, changed = '') => `<g>
    <rect class="gr-page" x="${x}" y="60" width="440" height="240" rx="12" />
    <path class="sk-head-line" d="M${x} 104 H${x + 440}" />
    <text class="gr-file" x="${x + 24}" y="90">${name}</text>
    <rect class="sk-line" x="${x + 24}" y="140" width="300" height="8" rx="4" />
    <text class="gr-rule${changed ? ' is-old' : ''}" x="${x + 24}" y="205">${rule}</text>
    ${changed ? `<text class="gr-rule is-changed" x="${x + 24}" y="205">${changed}</text>` : ''}
    <rect class="sk-line" x="${x + 24}" y="245" width="340" height="8" rx="4" />
  </g>`;

/** Ta sama reguła w dwóch plikach: jedna kopia się zmienia, a agent pośrodku nie ma jak ustalić, która jest aktualna. */
export default {
  id: 'duplikat',
  stage: 'granice',
  summary: 'co się dzieje, gdy ta sama reguła ma dwie kopie',
  html: `
    <h2 class="slide-title">Dwie kopie jednej reguły</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 400" width="1440" height="400" aria-hidden="true">
        <path class="gr-dash" d="M520 180 H640" />
        <path class="gr-dash" d="M800 180 H920" />
        ${page(80, 'plik A', 'limit linii: 200')}
        ${page(920, 'plik B', 'limit linii: 200', 'limit linii: 120')}
        <g class="gr-agent"><circle cx="720" cy="180" r="72" /><text x="720" y="189" text-anchor="middle">agent</text></g>
      </svg>
      <div class="gr-outcomes">
        <span class="tag is-alert">bierze jedną</span>
        <span class="tag is-alert">skleja obie w fallback</span>
      </div>
    </div>`,
  notes: `
    <p>Przechodzimy do odpowiedzialności standardów i do tego, jak pilnować, żeby nie nachodziły na siebie. Najpierw problem: ta sama reguła stoi w dwóch plikach. Przykład jest umowny.</p>
    <p>[klik] Ktoś zmienia jedną kopię, bo akurat edytował ten plik. Druga zostaje po staremu i nikt tego nie zauważa.</p>
    <p>[klik] Człowiek w takiej sytuacji zapyta kolegę albo sprawdzi historię. Agent nie ma jak ustalić, która kopia jest aktualna: bierze tę, którą akurat przeczytał, albo skleja obie w fallback. Dla agenta duplikat to sprzeczność, która tylko czeka na swój moment.</p>`,

  animate(root) {
    const oldRule = root.querySelector('.gr-rule.is-old');
    const newRule = root.querySelector('.gr-rule.is-changed');
    const outcomes = root.querySelectorAll('.gr-outcomes .tag');
    gsap.set([newRule, ...outcomes], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.canvas svg > g'), { opacity: 0, duration: 0.4, stagger: 0.15 });
      },
      (tl) => {
        tl.to(oldRule, { opacity: 0, duration: 0.3 });
        tl.to(newRule, { opacity: 1, duration: 0.4 });
      },
      (tl) => {
        tl.to(outcomes, { opacity: 1, duration: 0.4, stagger: 0.25 });
      },
    ];
  },
};
