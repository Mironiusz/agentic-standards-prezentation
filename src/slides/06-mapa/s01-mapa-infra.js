import { gsap } from 'gsap';

import { AREAS, MAP_LAYOUT, STATUS_COUNTS, renderArea, renderBandLabels, renderGhosts } from '../../components/infra-map.js';
import { CLUSTER_LAYOUT } from '../../components/standards.js';
import { svgTile } from '../../components/tiles.js';
import './mapa.css';

const LEGEND_Y = 530;
const LEGEND = [
  { status: 'std', cls: 'is-orange', label: 'pokryte' },
  { status: 'czesciowo', cls: 'is-orange is-dashed', label: 'częściowo' },
  { status: 'brak', cls: 'is-slate', label: 'brak' },
  { status: 'swiadomie', cls: 'is-slate is-dashed', label: 'świadomie' },
];

const legend = LEGEND.map((l, i) => {
  const x = 230 + i * 300;
  return `<g class="im-legend">
    ${svgTile({ x, y: LEGEND_Y, w: 52, h: 36, lines: [], cls: l.cls })}
    <text class="im-count" x="${x + 70}" y="${LEGEND_Y + 31}">${STATUS_COUNTS[l.status]}</text>
    <text class="im-legend-label" x="${x + 130}" y="${LEGEND_Y + 27}">${l.label}</text>
  </g>`;
}).join('');

/**
 * Mapa infra: najpierw pusta mapa obszarów, potem 19 standardów wlatuje z pozycji grafu z bloku 5
 * (oba płótna mają te same współrzędne), a kolejne kliknięcia dokładają obszary częściowe, braki,
 * świadome braki i liczniki.
 */
export default {
  id: 'mapa-infra',
  stage: 'mapa',
  summary: 'mapa obszarów projektu i ich pokrycie standardami',
  html: `
    <h2 class="slide-title">Mapa obszarów projektu</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 600" width="1440" height="600" aria-hidden="true">
        ${renderBandLabels()}
        ${renderGhosts()}
        ${AREAS.map(renderArea).join('')}
        ${legend}
      </svg>
    </div>`,
  notes: `
    <p>Skoro wiemy już, czym są standardy i jak dzielą się obszarem, patrzymy na całość: jakie obszary ma w ogóle projekt programistyczny, ułożone w pięć pasów. Cztery pierwsze to te same grupy co przy standardach. Piąty, wdrożenie i utrzymanie, dochodzi tylko tutaj, bo tam leży najwięcej braków.</p>
    <p>[klik] Dziewiętnaście standardów z grafu ląduje na swoich obszarach. Jedna zmiana względem grup: Coolify przechodzi ze sposobu pracy na dół, do wdrożenia. Przy grupach liczyło się, że Coolify mówi, czego agentowi nie wolno na serwerze. Na mapie liczy się obszar projektu, którego dotyczy, a to jest wdrożenie.</p>
    <p>[klik] Obszary częściowe: reguły istnieją, ale są rozproszone po innych standardach. Podpis pod kafelkiem mówi, gdzie ich szukać. Na przykład kopie zapasowe: standard Coolify zabrania agentowi je kasować, ale nic więcej o nich nie mówi.</p>
    <p>[klik] Braki: obszar istnieje w repozytorium, na przykład kontenery albo kontrakt API, a standardu dla niego nie ma.</p>
    <p>[klik] Świadome braki, czyli brak zapisany jako decyzja. Architektura jednej warstwy nie ma standardu, bo brakuje materiału, a nie decyzji. Komunikaty commitów są celowo nieobjęte żadną regułą.</p>
    <p>[klik] Podsumowanie liczbami: ${STATUS_COUNTS.std} obszarów ma własny standard, ${STATUS_COUNTS.czesciowo} ma reguły rozproszone po innych standardach, ${STATUS_COUNTS.brak} nie ma nic, a ${STATUS_COUNTS.swiadomie} to świadome braki.</p>`,

  animate(root) {
    const byStatus = (status) => [...root.querySelectorAll(`.im-area[data-status="${status}"]`)];
    const standards = byStatus('std');
    const later = ['czesciowo', 'brak', 'swiadomie'].map(byStatus);
    const legendEls = root.querySelectorAll('.im-legend');

    standards.forEach((el) => {
      const key = el.dataset.key;
      gsap.set(el, { x: CLUSTER_LAYOUT[key].cx - MAP_LAYOUT[key].cx, y: CLUSTER_LAYOUT[key].cy - MAP_LAYOUT[key].cy, opacity: 0 });
    });
    gsap.set([...later.flat(), ...legendEls], { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.im-band, .tile.is-ghost'), { opacity: 0, duration: 0.4, stagger: 0.01 });
      },
      (tl) => {
        tl.to(standards, { opacity: 1, duration: 0.2 });
        tl.to(standards, { x: 0, y: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.03 });
      },
      ...later.map((els) => (tl) => {
        tl.to(els, { opacity: 1, duration: 0.4, stagger: 0.06 });
      }),
      (tl) => {
        tl.to(legendEls, { opacity: 1, duration: 0.4, stagger: 0.12 });
      },
    ];
  },
};
