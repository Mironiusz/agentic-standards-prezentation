import { gsap } from 'gsap';

import { renderPipeline } from '../../components/pipeline.js';
import './workflow.css';

const PIPE = renderPipeline(110);

/** Ten sam łańcuch co na poprzednim slajdzie, a na nim bramki (intro) i pętle powrotne (klik). */
export default {
  id: 'bramki',
  stage: 'workflow',
  summary: 'bramki między fazami i pętle powrotne',
  html: `
    <h2 class="slide-title">Bramki i pętle</h2>
    <div class="canvas wf-canvas">
      <svg viewBox="0 0 1440 400" width="1440" height="400" aria-hidden="true">
        ${PIPE.skills}${PIPE.arrows}${PIPE.gates}${PIPE.phases}${PIPE.loops}
      </svg>
    </div>`,
  notes: `
    <p>Na każdej granicy faz stoi bramka, czyli marker w pliku, który zamyka fazę: wywiad zamknięty, potwierdzenie PRD, plan zamknięty i werdykt ready w review. To są miejsca, w których człowiek może zatrzymać albo zawrócić proces.</p>
    <p>[klik] Do tego dwie pętle powrotne. Jeśli PLAN obali założenie z PRD, wracamy do PRD, bo PRD jest kontraktem i nie wolno go po cichu obejść. Jeśli implementacja zobaczy w SHAPE otwarte Block: yes, też wraca do plan-prd. Plan nie rośnie w trakcie implementacji: wszystko nieprzewidziane kończy się pytaniem.</p>`,

  animate(root) {
    const loops = root.querySelectorAll('.pl-loop');
    gsap.set(loops, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.pl-gate'), { opacity: 0, duration: 0.4, stagger: 0.15 });
      },
      (tl) => {
        tl.to(loops, { opacity: 1, duration: 0.5, stagger: 0.25 });
      },
    ];
  },
};
