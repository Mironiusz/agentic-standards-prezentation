import { gsap } from 'gsap';

import { CLUSTERS, STANDARDS, renderClusterFrames, renderClusterTile } from '../../components/standards.js';
import './anatomia.css';

const tiles = CLUSTERS.map(
  (c) => `<g class="kl-group" data-cluster="${c.key}">
    ${STANDARDS.filter((s) => s.cluster === c.key)
      .map((s) => renderClusterTile(s.key))
      .join('')}
  </g>`,
).join('');

/** 19 standardów w czterech klastrach. Układ kafelków jest ten sam co w grafie (blok 5) i na starcie mapy (blok 6). */
export default {
  id: 'klastry',
  stage: 'anatomia',
  summary: 'czego dotyczą standardy: 19 standardów w czterech klastrach',
  html: `
    <h2 class="slide-title">Czego dotyczą standardy</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 640" width="1440" height="640" aria-hidden="true">
        ${renderClusterFrames()}
        ${tiles}
      </svg>
    </div>`,
  notes: `
    <p>Dziewiętnaście standardów quantaska układa się w cztery grupy. Ten układ kafelków zobaczymy jeszcze w grafie odwołań i na mapie obszarów projektu.</p>
    <p>[klik] Sposób pracy: jak agent pracuje, a nie jak wygląda kod. Workflow, artefakty, review, git i Coolify.</p>
    <p>[klik] Kod: formatowanie, jakość, nazewnictwo, dokumentacja, testy i bezpieczeństwo.</p>
    <p>[klik] Budowa aplikacji: architektura systemu, konfiguracja, logowanie i obsługa błędów.</p>
    <p>[klik] Dane: baza, idempotencja, czas i worker. Te standardy najmocniej opierają się na specyfikacji produktu w MVP.md.</p>`,

  animate(root) {
    const groups = [...root.querySelectorAll('.kl-group')];
    gsap.set(groups, { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.cl-frame'), { opacity: 0, duration: 0.4, stagger: 0.1 });
      },
      ...groups.map((g) => (tl) => {
        tl.to(g, { opacity: 1, duration: 0.4 });
      }),
    ];
  },
};
