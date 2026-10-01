import { gsap } from 'gsap';

import { renderPipeline } from '../../components/pipeline.js';
import './workflow.css';

const PIPE = renderPipeline(110);

/** Grupy faz prowadzone przez jeden skill: plan-shape, plan-prd, plan-implement (indeksy z `pipeline.js`). */
const GROUPS = [
  { phases: [0, 1], skill: 0 },
  { phases: [2, 3], skill: 1 },
  { phases: [4, 5, 6, 7], skill: 2 },
];

/** Łańcuch faz budowany grupami: intro pokazuje pierwszą grupę, każde kliknięcie dokłada następną. */
export default {
  id: 'lancuch',
  stage: 'workflow',
  summary: 'workflow agentowy w quantasku: łańcuch faz od SEED do archiwum',
  html: `
    <h2 class="slide-title">Workflow w quantasku</h2>
    <div class="canvas wf-canvas">
      <svg viewBox="0 0 1440 360" width="1440" height="360" aria-hidden="true">
        ${PIPE.skills}${PIPE.arrows}${PIPE.phases}
      </svg>
    </div>`,
  notes: `
    <p>Krótkie przypomnienie, jak wygląda workflow agentowy w quantasku. Inne zespoły mają go trochę inaczej, więc mówimy o konkretnym repozytorium. Pierwszy skill, plan-shape, zapisuje SEED, czyli dosłowne zgłoszenie, zanim padnie pierwsze pytanie, a potem prowadzi wywiad, którego wynik ląduje w SHAPE.</p>
    <p>[klik] plan-prd ma dwie fazy. Najpierw PRD, czyli co i dlaczego, bez żadnej treści technicznej. Dopiero po potwierdzeniu przez człowieka powstaje PLAN, czyli jak, z faktami popartymi dowodem.</p>
    <p>[klik] plan-implement pisze kod, zapisuje pamięć, sam woła review i na końcu przenosi inicjatywę do archiwum. Dwie rzeczy są tu ważne: stan procesu żyje wyłącznie w plikach, a przejścia między skillami są ręczne. Przerwanie sesji nic nie kosztuje, bo skill wznawia pracę od pierwszej niewypełnionej rzeczy.</p>`,

  animate(root) {
    const phases = [...root.querySelectorAll('.pl-phase')];
    const arrows = [...root.querySelectorAll('.pl-arrow')];
    const skills = [...root.querySelectorAll('.pl-skill')];
    const sequence = (g) => [skills[g.skill], ...g.phases.flatMap((p) => (p > 0 ? [arrows[p - 1], phases[p]] : [phases[p]]))];
    gsap.set([...phases, ...arrows, ...skills], { opacity: 0 });

    return GROUPS.map((g) => (tl) => {
      tl.to(sequence(g), { opacity: 1, duration: 0.35, stagger: 0.1 });
    });
  },
};
