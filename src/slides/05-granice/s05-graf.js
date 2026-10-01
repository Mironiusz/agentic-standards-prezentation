import { gsap } from 'gsap';

import { BOUNDARY_PAIRS, CLUSTER_LAYOUT, GRAPH_EDGES, STANDARDS, renderClusterFrames, renderClusterTile } from '../../components/standards.js';
import './granice.css';

const HUBS = ['MVP', 'review'];
const FOCUS = 'database';

const width = (weight) => 1.4 + Math.min(weight, 14) * 0.38;
const isPair = (e) => BOUNDARY_PAIRS.some(([a, b]) => (e.a === a && e.b === b) || (e.a === b && e.b === a));

/** Krawędzie jednej warstwy: wszystkie (tło) albo tylko te, które spełniają warunek (podświetlenie). */
const edges = (filter, cls) =>
  GRAPH_EDGES.filter(filter)
    .map((e) => {
      const a = CLUSTER_LAYOUT[e.a];
      const b = CLUSTER_LAYOUT[e.b];
      return `<line class="gr-edge ${cls}" x1="${a.cx}" y1="${a.cy}" x2="${b.cx}" y2="${b.cy}" style="stroke-width:${width(e.weight)}px" />`;
    })
    .join('');

const focusRing = (key) => {
  const p = CLUSTER_LAYOUT[key];
  return `<rect class="gr-focus" x="${p.x - 5}" y="${p.y - 5}" width="${p.w + 10}" height="${p.h + 10}" rx="11" />`;
};

const mvp = CLUSTER_LAYOUT.MVP;

/**
 * Graf odwołań między standardami w układzie klastrów z bloku 3. Kliknięcia podświetlają kolejno:
 * huby (`MVP.md` i `review`), jeden węzeł z sąsiadami i pary graniczne.
 */
export default {
  id: 'graf',
  stage: 'granice',
  summary: 'graf: kto do kogo odsyła w zbiorze standardów',
  html: `
    <h2 class="slide-title">Kto do kogo odsyła</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 640" width="1440" height="640" aria-hidden="true">
        <g class="gr-frames">${renderClusterFrames()}</g>
        <g class="gr-base">${edges(() => true, '')}</g>
        <g class="gr-layer" data-layer="hubs">${edges((e) => HUBS.includes(e.a) || HUBS.includes(e.b), 'is-on')}</g>
        <g class="gr-layer" data-layer="focus">${edges((e) => e.a === FOCUS || e.b === FOCUS, 'is-on')}</g>
        <g class="gr-layer" data-layer="pairs">${edges(isPair, 'is-on')}</g>
        <g class="gr-nodes">
          ${STANDARDS.map((s) => renderClusterTile(s.key)).join('')}
          <g class="gr-mvp"><rect x="${mvp.x}" y="${mvp.y}" width="${mvp.w}" height="${mvp.h}" rx="8" /><text x="${mvp.cx}" y="${mvp.cy + 8}" text-anchor="middle">MVP.md</text></g>
        </g>
        <g class="gr-layer" data-layer="hubs">${HUBS.map(focusRing).join('')}</g>
        <g class="gr-layer" data-layer="focus">${focusRing(FOCUS)}</g>
      </svg>
    </div>`,
  notes: `
    <p>Cały obraz: kto do kogo odsyła. Krawędź to odwołanie w treści pliku, a jej grubość to liczba odwołań. Pominąłem odwołania do mapy standardów, bo ma je każdy plik.</p>
    <p>[klik] Huby: jedenaście z dziewiętnastu standardów cytuje MVP.md, a review odsyła do wszystkich osiemnastu pozostałych, bo przechodzi po nich w każdym przeglądzie.</p>
    <p>[klik] Jeden węzeł z bliska: database i jego sąsiedzi. Najwięcej odwołań prowadzi do MVP.md, a potem do time, idempotency i architecture.</p>
    <p>[klik] Pary graniczne, czyli wzajemne odesłania typu "to nie tutaj, tylko u mnie". W tym grafie krawędź oznacza odesłanie, a nie kopię treści.</p>`,

  animate(root) {
    const layer = (name) => root.querySelectorAll(`.gr-layer[data-layer="${name}"]`);
    const base = root.querySelector('.gr-base');
    gsap.set(root.querySelectorAll('.gr-layer'), { opacity: 0 });

    return [
      (tl) => {
        tl.from(root.querySelectorAll('.gr-frames, .gr-nodes'), { opacity: 0, duration: 0.4 });
        tl.from(base, { opacity: 0, duration: 0.6 });
      },
      (tl) => {
        tl.to(layer('hubs'), { opacity: 1, duration: 0.4 });
        tl.to(base, { opacity: 0.35, duration: 0.4 }, '<');
      },
      (tl) => {
        tl.to(layer('hubs'), { opacity: 0, duration: 0.3 });
        tl.to(layer('focus'), { opacity: 1, duration: 0.4 });
      },
      (tl) => {
        tl.to(layer('focus'), { opacity: 0, duration: 0.3 });
        tl.to(layer('pairs'), { opacity: 1, duration: 0.4 });
      },
    ];
  },
};
