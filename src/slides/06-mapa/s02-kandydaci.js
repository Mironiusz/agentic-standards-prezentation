import { CANDIDATES } from '../../components/candidates.js';
import { AREAS, MAP_LAYOUT, areaKey, renderArea, renderBandLabels, renderGhosts } from '../../components/infra-map.js';
import './mapa.css';

/** Kandydat rysowany drugi raz nad przygaszoną mapą, w pełnej jasności, z obrysem i numerem. */
const picks = CANDIDATES.map(({ area: key }, i) => {
  const p = MAP_LAYOUT[key];
  return `<g class="im-pick-group">
    ${renderArea(AREAS.find((a) => areaKey(a) === key))}
    <rect class="im-pick" x="${p.x - 5}" y="${p.y - 5}" width="${p.w + 10}" height="${p.h + 10}" rx="11" />
    <g class="im-badge"><circle cx="${p.x + p.w - 2}" cy="${p.y + 2}" r="16" /><text x="${p.x + p.w - 2}" y="${p.y + 9}" text-anchor="middle">${i + 1}</text></g>
  </g>`;
}).join('');

/** Ta sama mapa w stanie końcowym, przygaszona, z czterema kandydatami do ćwiczenia na akcent. */
export default {
  id: 'kandydaci',
  stage: 'mapa',
  summary: 'czterech kandydatów do ćwiczenia: config, potok CI, kontenery i wydajność',
  html: `
    <h2 class="slide-title">Kandydaci do ćwiczenia</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 600" width="1440" height="600" aria-hidden="true">
        <g class="kd-map">
          ${renderBandLabels()}
          ${renderGhosts()}
          ${AREAS.map(renderArea).join('')}
        </g>
        ${picks}
      </svg>
    </div>`,
  notes: `<p>Czterech kandydatów do ćwiczenia, czyli obszary, które da się sensownie opisać w dwadzieścia pięć minut. Każdy jest w innym stanie. Config ma już gotowy standard, który widzieliśmy w bloku z przykładami. Potok CI i wydajność mają reguły rozproszone po innych standardach. Kontenery z lokalnym środowiskiem nie mają nic.</p>`,

  animate(root) {
    return [
      (tl) => {
        tl.to(root.querySelector('.kd-map'), { opacity: 0.3, duration: 0.6 });
        tl.from(root.querySelectorAll('.im-pick-group'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.15 });
      },
    ];
  },
};
