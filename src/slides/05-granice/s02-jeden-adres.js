import { gsap } from 'gsap';

import { svgTile } from '../../components/tiles.js';
import './granice.css';

/**
 * Pliki, które odsyłają do formatu sekcji Fakty zamiast go powtarzać. Sprawdzone w quantasku:
 * skille `plan-prd` i `plan-implement` w obu narzędziach i test kontraktu planu wskazują `standard_agent_docs.md`.
 */
const CENTER = { x: 240, y: 250, w: 380, h: 110 };
const REFS = [
  { x: 0, y: 40, lines: ['.claude/skills/plan-prd'], cls: 'is-mono', to: [340, CENTER.y] },
  { x: 510, y: 40, lines: ['.agents/skills/plan-prd'], cls: 'is-mono', to: [520, CENTER.y] },
  { x: 0, y: 500, lines: ['.claude/skills/plan-implement'], cls: 'is-mono', to: [340, CENTER.y + CENTER.h] },
  { x: 510, y: 500, lines: ['test_plan_document_contract.py'], cls: 'is-mint is-mono', to: [520, CENTER.y + CENTER.h] },
];
const REF = { w: 350, h: 60 };

const refs = REFS.map((r) => {
  const from = [r.x + REF.w / 2, r.y < CENTER.y ? r.y + REF.h : r.y];
  return `<g class="ja-ref">
    <path class="gr-ref ${r.cls.includes('mint') ? 'is-mint' : ''}" d="M${from[0]} ${from[1]} L${r.to[0]} ${r.to[1]}" />
    <circle class="gr-dot" cx="${r.to[0]}" cy="${r.to[1]}" r="6" />
    ${svgTile({ x: r.x, y: r.y, w: REF.w, h: REF.h, lines: r.lines, cls: r.cls, font: 17 })}
  </g>`;
}).join('');

/** Jedna reguła, jeden adres, a po kliknięciu wariant z kopią nieuniknioną, której zgodności pilnuje test. */
export default {
  id: 'jeden-adres',
  stage: 'granice',
  summary: 'zasada quantaska: jedna reguła, jeden adres',
  html: `
    <h2 class="slide-title">Jedna reguła, jeden adres</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 600" width="1440" height="600" aria-hidden="true">
        ${svgTile({ ...CENTER, lines: ['standard_agent_docs.md'], sub: 'format sekcji Fakty', cls: 'is-orange is-mono', font: 23 })}
        ${refs}
        <g class="ja-copy">
          <path class="gr-dash" d="M880 0 V580" />
          <text class="gr-head" x="960" y="70">kopia nieunikniona</text>
          ${svgTile({ x: 960, y: 110, w: 440, h: 96, lines: ['standard_formatting.md'], sub: 'lista znaków zakazanych', cls: 'is-orange is-mono', font: 22 })}
          <path class="gr-ref is-mint" d="M1180 210 V376" />
          <text class="gr-caption" x="1200" y="300">test zgodności</text>
          ${svgTile({ x: 960, y: 380, w: 440, h: 96, lines: ['test_prose_style.py'], sub: 'własna lista znaków', cls: 'is-mint is-mono', font: 22 })}
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Odpowiedź quantaska na duplikaty: każda reguła ma jeden adres. Format sekcji Fakty stoi tylko w standard_agent_docs.md, a skille w obu narzędziach i test kontraktu planu odsyłają tam, zamiast go powtarzać.</p>
    <p>[klik] Czasem kopia jest nieunikniona, bo narzędzie potrzebuje własnej listy. Wtedy zgodności pilnuje test: test_prose_style.py sprawdza, że standard formatowania nadal cytuje każdy znak z listy, którą test egzekwuje.</p>`,

  animate(root) {
    const copy = root.querySelector('.ja-copy');
    gsap.set(copy, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelector('.canvas svg > .tile'), { opacity: 0, duration: 0.4 });
        tl.from(root.querySelectorAll('.ja-ref'), { opacity: 0, duration: 0.4, stagger: 0.15 });
      },
      (tl) => {
        tl.to(copy, { opacity: 1, duration: 0.5 });
      },
    ];
  },
};
