import { splitKey, svgTile } from './tiles.js';

/**
 * Dane o 19 standardach quantaska (`C:\Quanta\quantask\docs\standards`, stan na 2026-10-01) i wspólny
 * układ ich kafelków. Ten sam układ widać na slajdzie z klastrami (blok 3), w grafie zależności (blok 5)
 * i jako punkt startu kafelków lecących na mapę infra (blok 6), więc pozycje liczymy tylko tutaj.
 *
 * `jobs` to joby CI z mapy standard -> narzędzie (`STANDARDY.md` 4.4). Standard bez jobów sprawdza
 * tylko przegląd ręczny. `process` oznacza sześć standardów opisujących pracę agenta (`STANDARDY.md` 4.1).
 *
 * Klastry to podział z `STANDARDY.md` 5.2 pod prostszymi nazwami. Te same nazwy, w tych samych liniach,
 * podpisują pasy mapy infra (`infra-map.js`), więc `lines` służy obu slajdom.
 */

export const CLUSTERS = [
  { key: 'proces', lines: ['sposób pracy'], x: 0, y: 0 },
  { key: 'kod', lines: ['kod'], x: 840, y: 0 },
  { key: 'aplikacja', lines: ['budowa', 'aplikacji'], x: 0, y: 340 },
  { key: 'dane', lines: ['dane'], x: 840, y: 340 },
];

const CLUSTER_FRAME = { w: 600, h: 280 };

export const STANDARDS = [
  { key: 'agentic_workflow', cluster: 'proces', process: true, jobs: ['test-unit'] },
  { key: 'agent_docs', cluster: 'proces', process: true, jobs: ['test-unit'] },
  { key: 'review', cluster: 'proces', process: true, jobs: [] },
  { key: 'git', cluster: 'proces', process: true, jobs: [] },
  { key: 'coolify', cluster: 'proces', process: true, jobs: [] },
  { key: 'formatting', cluster: 'kod', process: true, jobs: ['lint-python', 'lint-docs', 'test-unit'] },
  { key: 'code_quality', cluster: 'kod', jobs: ['lint-python', 'typecheck', 'deadcode', 'deps'] },
  { key: 'naming', cluster: 'kod', jobs: ['lint-python'] },
  { key: 'documentation', cluster: 'kod', jobs: [] },
  { key: 'tests', cluster: 'kod', jobs: ['test-unit', 'database'] },
  { key: 'security', cluster: 'kod', jobs: ['security', 'audit', 'secrets'] },
  { key: 'architecture', cluster: 'aplikacja', jobs: [] },
  { key: 'config', cluster: 'aplikacja', jobs: ['test-unit'] },
  { key: 'logging', cluster: 'aplikacja', jobs: ['lint-python'] },
  { key: 'errors', cluster: 'aplikacja', jobs: [] },
  { key: 'database', cluster: 'dane', jobs: ['security', 'database'] },
  { key: 'idempotency', cluster: 'dane', jobs: [] },
  { key: 'time', cluster: 'dane', jobs: [] },
  { key: 'worker', cluster: 'dane', jobs: ['test-unit'] },
];

/** Kafelek standardu w układzie klastrów: dwie kolumny w ramce klastra, wiersze co 70 px. */
const CLUSTER_TILE = { w: 250, h: 56 };

/** Pozycje kafelków w układzie klastrów, po kluczu standardu. Węzeł `MVP.md` stoi pośrodku, między ramkami. */
export const CLUSTER_LAYOUT = (() => {
  const layout = {};
  for (const cluster of CLUSTERS) {
    STANDARDS.filter((s) => s.cluster === cluster.key).forEach((s, i) => {
      const x = cluster.x + 35 + (i % 2) * 280;
      const y = cluster.y + 64 + Math.floor(i / 2) * 70;
      layout[s.key] = { x, y, w: CLUSTER_TILE.w, h: CLUSTER_TILE.h, cx: x + CLUSTER_TILE.w / 2, cy: y + CLUSTER_TILE.h / 2 };
    });
  }
  layout.MVP = { x: 640, y: 282, w: 160, h: 56, cx: 720, cy: 310 };
  return layout;
})();

/** Ramki klastrów z podpisem w lewym górnym rogu. */
export function renderClusterFrames() {
  return CLUSTERS.map(
    (c) => `<g class="cl-frame" data-cluster="${c.key}">
      <rect x="${c.x}" y="${c.y}" width="${CLUSTER_FRAME.w}" height="${CLUSTER_FRAME.h}" rx="14" />
      <text class="cl-label" x="${c.x + 24}" y="${c.y + 38}">${c.lines.join(' ')}</text>
    </g>`,
  ).join('');
}

/** Kafelek standardu w układzie klastrów. */
export function renderClusterTile(key, cls = 'is-orange') {
  const p = CLUSTER_LAYOUT[key];
  return svgTile({ ...p, lines: splitKey(key, 18), cls, font: 22, attrs: `data-key="${key}"` });
}

/**
 * Odwołania w treści standardów: kto do kogo odsyła i ile razy (`STANDARDY.md` 5.3), bez odwołań
 * do mapy, które ma każdy plik. `review` odsyła do wszystkich pozostałych 18, więc jego krawędzie
 * dopisuje `GRAPH_EDGES` niżej, zamiast wypisywać je ręcznie.
 */
const REFERENCES = {
  agentic_workflow: { MVP: 9, agent_docs: 7, database: 2, review: 1 },
  agent_docs: { agentic_workflow: 9, formatting: 2, config: 1 },
  git: { coolify: 1 },
  coolify: { git: 4, config: 3, MVP: 2 },
  architecture: { MVP: 6, config: 2, logging: 1, errors: 1, database: 1 },
  config: { MVP: 4, logging: 2, time: 1, security: 1, database: 1, coolify: 1, architecture: 1 },
  logging: { errors: 3, worker: 2, security: 2, architecture: 2, config: 1, code_quality: 1 },
  errors: { idempotency: 2, MVP: 2, logging: 1, architecture: 1 },
  database: { MVP: 12, time: 2, idempotency: 2, architecture: 2, naming: 1, errors: 1 },
  idempotency: { errors: 2, database: 1, MVP: 1 },
  time: { MVP: 13, database: 4, worker: 1, idempotency: 1, errors: 1, architecture: 1 },
  worker: { MVP: 6, errors: 2, time: 1, logging: 1, idempotency: 1, agentic_workflow: 1 },
  formatting: { database: 2, code_quality: 2 },
  code_quality: { formatting: 3, documentation: 3, tests: 2, architecture: 2, security: 1, logging: 1 },
  naming: { MVP: 2, tests: 1, database: 1, architecture: 1, agent_docs: 1 },
  documentation: { formatting: 1 },
  security: { config: 2, logging: 1, database: 1, code_quality: 1 },
  tests: { MVP: 5, review: 1, architecture: 1 },
  review: { agentic_workflow: 6, architecture: 2 },
};

/** Krawędzie grafu bez kierunku: para kluczy i łączna liczba odwołań w obie strony. */
export const GRAPH_EDGES = (() => {
  const weights = new Map();
  const add = (a, b, n) => {
    const id = [a, b].sort().join('|');
    weights.set(id, (weights.get(id) ?? 0) + n);
  };
  for (const [from, targets] of Object.entries(REFERENCES)) {
    for (const [to, n] of Object.entries(targets)) add(from, to, n);
  }
  for (const s of STANDARDS) if (s.key !== 'review' && !REFERENCES.review[s.key]) add('review', s.key, 1);
  return [...weights].map(([id, weight]) => {
    const [a, b] = id.split('|');
    return { a, b, weight };
  });
})();

/** Pary graniczne: wzajemne odesłania typu "to nie tutaj, tylko u mnie" (`STANDARDY.md` 5.3). */
export const BOUNDARY_PAIRS = [
  ['errors', 'idempotency'],
  ['errors', 'logging'],
  ['database', 'time'],
  ['database', 'idempotency'],
  ['architecture', 'logging'],
  ['architecture', 'config'],
  ['config', 'logging'],
  ['config', 'security'],
  ['coolify', 'git'],
  ['time', 'worker'],
  ['code_quality', 'formatting'],
  ['agent_docs', 'agentic_workflow'],
  ['agentic_workflow', 'review'],
];
