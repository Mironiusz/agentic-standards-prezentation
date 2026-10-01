import { gsap } from 'gsap';

import { ARROW } from '../../components/icons.js';
import './wstep.css';

/** Teza z `PLAN.md`: trzy słabości agenta, przekreślony dłuższy prompt i kontrakty w zamian. */
export default {
  id: 'teza',
  summary: 'teza: agentowi potrzeba kontraktów, a nie dłuższego promptu',
  html: `
    <div class="canvas thesis">
      <div class="thesis-weak">
        <span class="tag is-alert">zgaduje kontrakt</span>
        <span class="tag is-alert">dorabia fallbacki</span>
        <span class="tag is-alert">halucynuje</span>
      </div>
      <div class="thesis-answer">
        <span class="thesis-prompt">dłuższy prompt<span class="thesis-strike"></span></span>
        <span class="thesis-arrow">${ARROW}</span>
        <span class="thesis-contract">kontrakty</span>
      </div>
    </div>`,
  notes: `
    <p>Trzy rzeczy, które agent robi, kiedy czegoś nie wie: zgaduje kontrakt, dorabia fallbacki i halucynuje, czyli podaje fakty, których nie sprawdził.</p>
    <p>[klik] Odruchowa reakcja to dopisać więcej do promptu. To się nie skaluje: prompt rośnie, a agent i tak nie wie, która reguła jest aktualna i kiedy ma ją zastosować.</p>
    <p>[klik] Teza na całą prezentację: agentowi potrzeba kontraktów. Standard mówi mu, gdzie szukać, czego nie zgadywać, jak zapisać wynik i kiedy przestać i zapytać. Te trzy czerwone etykiety wrócą pod koniec bloku o rolach standardów.</p>`,

  animate(root) {
    const prompt = root.querySelector('.thesis-prompt');
    const strike = root.querySelector('.thesis-strike');
    const answer = root.querySelectorAll('.thesis-arrow, .thesis-contract');
    gsap.set(prompt, { opacity: 0 });
    gsap.set(strike, { scaleX: 0 });
    gsap.set(answer, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.thesis-weak .tag'), { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 });
      },
      (tl) => {
        tl.to(prompt, { opacity: 1, duration: 0.4 });
        tl.to(strike, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '+=0.2');
      },
      (tl) => {
        tl.to(answer, { opacity: 1, duration: 0.5, stagger: 0.25 });
      },
    ];
  },
};
