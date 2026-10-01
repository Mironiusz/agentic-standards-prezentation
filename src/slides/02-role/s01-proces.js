import { gsap } from 'gsap';

import { hArrow } from '../../components/flow.js';
import { svgTile } from '../../components/tiles.js';
import { BOXES, backdrop, enterBackdrop } from './backdrop.js';
import './role.css';

const PROCESS = ['agentic_workflow', 'agent_docs', 'review', 'formatting', 'git', 'coolify'];

/** Sześć standardów pracy agenta jako etykiety w pasie pod całym łańcuchem, rozłożone równo od x = 340. */
const chips = (() => {
  const widths = PROCESS.map((key) => key.length * 12.6 + 28);
  const gap = (1440 - 340 - 20 - widths.reduce((a, b) => a + b, 0)) / (PROCESS.length - 1);
  let x = 340;
  return PROCESS.map((key, i) => {
    const tile = svgTile({ x, y: 214, w: widths[i], h: 48, lines: [key], cls: 'is-orange is-mono', font: 21 });
    x += widths[i] + gap;
    return tile;
  }).join('');
})();

const links = BOXES.map((b) => `<path class="role-link" d="M${b.cx} 98 V188" />`).join('');

const leftArrow = (x1, x2, y) => `<g class="fl-arrow"><path class="fl-link" d="M${x1} ${y} H${x2 + 11}" /><path class="fl-head" d="M${x2} ${y} l12 -7 v14 z" /></g>`;

/** Rola 1: standardy pracy agenta pod całym łańcuchem, a potem przykład skilla, który nie powtarza reguł, tylko odsyła do standardu. */
export default {
  id: 'rola-proces',
  stage: 'role',
  summary: 'rola 1: kontrakt pracy agenta, czyli standardy opisujące samą pracę agenta',
  html: `
    <h2 class="slide-title">Rola 1: kontrakt pracy agenta</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 660" width="1440" height="660" aria-hidden="true">
        ${backdrop()}
        <g class="rp-band">
          ${links}
          <g class="role-band"><rect x="0" y="190" width="1440" height="96" rx="14" /></g>
          <text class="role-band-label" x="28" y="246">kontrakt pracy agenta</text>
          ${chips}
        </g>
        <g class="rp-thin">
          ${svgTile({ x: 0, y: 420, w: 320, h: 76, lines: ['plan-prd'], sub: 'SKILL.md, krok 5', cls: 'is-mono', font: 22 })}
          <text class="role-caption" x="415" y="444" text-anchor="middle">odsyła</text>
          ${hArrow(330, 500, 458)}
          ${svgTile({ x: 510, y: 400, w: 420, h: 116, lines: ['standard_agent_docs.md'], sub: 'format sekcji Fakty', cls: 'is-orange is-mono', font: 22 })}
          <text class="role-caption" x="1005" y="444" text-anchor="middle">czyta</text>
          ${leftArrow(1070, 940, 458)}
          ${svgTile({ x: 1080, y: 420, w: 360, h: 76, lines: ['test_plan_document_contract.py'], sub: 'kontrola formatu', cls: 'is-mint is-mono', font: 18 })}
        </g>
      </svg>
    </div>`,
  notes: `
    <p>Ten sam pipeline, tylko przygaszony. Teraz nakładamy na niego standardy, po jednej roli na slajd. Ról jest pięć i razem pokazują, po co standardy w ogóle są w tym łańcuchu.</p>
    <p>[klik] Rola pierwsza to kontrakt pracy agenta: sześć standardów opisuje nie kod, tylko to, jak agent ma pracować. To workflow, format artefaktów, review, proza, git i wdrożenie przez Coolify. Leżą pod całym łańcuchem, bo dotyczą każdej fazy.</p>
    <p>[klik] Co z tego wynika: skill opisuje tylko kroki pracy, czyli co zrobić i w jakiej kolejności, a zasady, jak ma wyglądać wynik, zostawia standardowi. Skill plan-prd w kroku piątym mówi wprost: nie powtarzaj tu wzorca, standard jest jego jedynym adresem. Z tego samego pliku format czyta test kontraktu planu. Gdy reguła się zmienia, poprawiamy jeden standard, a nie siedem par skilli dla Claude Code i Codeksa.</p>`,

  animate(root) {
    const band = root.querySelector('.rp-band');
    const thin = root.querySelector('.rp-thin');
    gsap.set([band, thin], { opacity: 0 });

    return [
      (tl) => enterBackdrop(tl, root),
      (tl) => {
        tl.to(band, { opacity: 1, duration: 0.5 });
      },
      (tl) => {
        tl.to(thin, { opacity: 1, duration: 0.5 });
      },
    ];
  },
};
