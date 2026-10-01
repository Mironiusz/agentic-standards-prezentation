import { CANDIDATES } from '../../components/candidates.js';
import { svgTile } from '../../components/tiles.js';
import './cwiczenie.css';

/**
 * Plansza do omówienia wyników: wybrany obszar pośrodku, a wokół jego sąsiedzi. Na każdej krawędzi stoi
 * miejsce na granicę, którą zespoły zaznaczają na żywo. Każdy kandydat ma swoją planszę jako wariant slajdu
 * (`src/lib/variants.js`), a klawisz z numerem kandydata z głosowania przełącza na właściwą.
 */
const CENTER = { cx: 720, cy: 300, w: 300, h: 96 };
const RADIUS = { x: 470, y: 220 };
const NODE = { w: 240, h: 60 };

/**
 * Plansza jednego kandydata: sąsiedzi rozłożeni równo na elipsie wokół środka, pierwszy na górze. Przy
 * nieparzystej liczbie sąsiadów elipsa nie jest symetryczna w pionie, więc cała plansza przesuwa się tak,
 * żeby skrajne węzły stały w równej odległości od środka płótna.
 */
function board(candidate, i) {
  const raw = candidate.neighbours.map((key, k) => {
    const angle = (-90 + (k * 360) / candidate.neighbours.length) * (Math.PI / 180);
    return { key, cx: CENTER.cx + RADIUS.x * Math.cos(angle), cy: CENTER.cy + RADIUS.y * Math.sin(angle) };
  });
  const ys = raw.map((n) => n.cy);
  const shift = CENTER.cy - (Math.min(...ys) + Math.max(...ys)) / 2;
  const nodes = raw.map((n) => ({ ...n, cy: n.cy + shift }));
  const c = { x: CENTER.cx, y: CENTER.cy + shift };

  const links = nodes.map((n) => `<path class="wy-link" d="M${c.x} ${c.y} L${n.cx} ${n.cy}" />`).join('');
  const slots = nodes
    .map((n) => {
      const x = (c.x + n.cx) / 2;
      const y = (c.y + n.cy) / 2;
      return `<g class="wy-slot"><circle cx="${x}" cy="${y}" r="20" /><text x="${x}" y="${y + 6}" text-anchor="middle">?</text></g>`;
    })
    .join('');
  const tiles = nodes.map((n) => svgTile({ x: n.cx - NODE.w / 2, y: n.cy - NODE.h / 2, w: NODE.w, h: NODE.h, lines: [n.key], cls: 'is-orange is-mono wy-node', font: 22 })).join('');
  const center = svgTile({
    x: c.x - CENTER.w / 2,
    y: c.y - CENTER.h / 2,
    w: CENTER.w,
    h: CENTER.h,
    lines: candidate.lines,
    cls: 'is-accent wy-center',
    font: 30,
    lineH: 36,
  });
  return `<g data-variant="${i + 1}"${i === 0 ? ' class="is-active"' : ''}>${links}${slots}${tiles}${center}</g>`;
}

/** Wyniki zespołów: plansza wchodzi od środka, a granice zaznacza się na żywo. */
export default {
  id: 'wyniki',
  stage: 'cwiczenie',
  summary: 'porównanie wyników: gdzie każdy zespół narysował granice',
  html: `
    <h2 class="slide-title">Gdzie kto narysował granice</h2>
    <div class="canvas">
      <svg viewBox="0 0 1440 600" width="1440" height="600" aria-hidden="true">
        ${CANDIDATES.map(board).join('')}
      </svg>
    </div>`,
  notes: `
    <p>Najpierw klawisz z numerem obszaru wybranego w głosowaniu: ${CANDIDATES.map((c, i) => `${i + 1} to ${c.name}`).join(', ')}. Plansza przełącza się od razu, także na projektorze, kiedy klawisz wciśniesz w widoku prezentera.</p>
    <p>Każdy zespół ma dwie, trzy minuty na pokazanie swojego standardu. Przy każdym sąsiedzie zaznaczamy, czy zespoły narysowały granicę w tym samym miejscu. Rozbieżności są puentą: to dokładnie problem z bloku o granicach, tylko zobaczony w praktyce.</p>`,

  /** Wszystkie plansze wchodzą równolegle, żeby ukryte warianty nie wydłużały wejścia tej widocznej. */
  animate(root) {
    const boards = [...root.querySelectorAll('[data-variant]')];
    return [
      (tl) => {
        tl.from(root.querySelectorAll('.wy-center'), { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.4 });
        boards.forEach((b, i) => {
          tl.from(b.querySelectorAll('.wy-link, .wy-slot, .wy-node'), { opacity: 0, duration: 0.4, stagger: 0.04 }, i === 0 ? '>' : '<');
        });
      },
    ];
  },
};
