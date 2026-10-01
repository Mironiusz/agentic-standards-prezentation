import { gsap } from 'gsap';

import { renderPipeline } from '../../components/pipeline.js';
import { svgTile } from '../../components/tiles.js';
import './cwiczenie.css';

const PIPE = renderPipeline(110);
const SEED = PIPE.boxes[0];
const LAST = PIPE.boxes[PIPE.boxes.length - 1];
const DOC = { x: 0, y: 330, w: 260, h: 80 };
const RESULT = { x: LAST.x + LAST.w - 260, y: 330, w: 260, h: 80 };

const lit = PIPE.boxes.map((b) => `<rect class="zm-lit" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" />`).join('');

/** Zamknięcie pętli: standard z ćwiczenia wchodzi jako SEED do tego samego łańcucha, który go potem wypuści. */
export default {
  id: 'zamkniecie',
  stage: 'cwiczenie',
  summary: 'zamknięcie pętli: standard z ćwiczenia wchodzi do łańcucha jako SEED',
  html: `
    <h2 class="slide-title">Zamknięcie pętli</h2>
    <div class="canvas zm-canvas">
      <svg viewBox="0 0 1440 440" width="1440" height="440" aria-hidden="true">
        ${PIPE.skills}${PIPE.arrows}${PIPE.phases}
        <g class="zm-lits">${lit}</g>
        ${svgTile({ ...DOC, lines: ['nowy standard'], sub: 'z ćwiczenia', cls: 'is-orange zm-doc', font: 26 })}
        ${svgTile({ ...RESULT, lines: ['19 + 1'], sub: 'standardów', cls: 'is-orange is-mono zm-result', font: 30 })}
      </svg>
    </div>`,
  notes: `
    <p>Na koniec ten sam łańcuch, od którego zaczęliśmy.</p>
    <p>[klik] To, co zespoły napisały na ćwiczeniu, nie zostaje na tablicy, tylko wchodzi do łańcucha jako SEED.</p>
    <p>[klik] Przechodzi wszystkie fazy i wychodzi jako dwudziesty standard. To jest rola piąta, czyli pętla zwrotna, w praktyce. Sam standard workflow agentowego też powstał tym łańcuchem, w inicjatywie moving_infra.</p>`,

  animate(root) {
    const doc = root.querySelector('.zm-doc');
    const lits = [...root.querySelectorAll('.zm-lit')];
    const result = root.querySelector('.zm-result');
    const dx = SEED.cx - (DOC.x + DOC.w / 2);
    const dy = SEED.cy - (DOC.y + DOC.h / 2);
    gsap.set([doc, ...lits, result], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.pl-skill, .pl-arrow, .pl-phase'), { opacity: 0, duration: 0.4, stagger: 0.03 });
      },
      (tl) => {
        tl.to(doc, { opacity: 1, duration: 0.3 });
        tl.to(doc, { x: dx, y: dy, scale: 0.5, transformOrigin: '50% 50%', duration: 0.8, ease: 'power2.in' });
        tl.to(doc, { opacity: 0, duration: 0.2 });
        tl.to(lits[0], { opacity: 1, duration: 0.3 }, '<');
      },
      (tl) => {
        tl.to(lits.slice(1), { opacity: 1, duration: 0.25, stagger: 0.15 });
        tl.to(result, { opacity: 1, duration: 0.4 });
      },
    ];
  },
};
