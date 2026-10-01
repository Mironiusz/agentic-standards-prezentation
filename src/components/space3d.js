/**
 * Przestrzeń wektorów rysowana w SVG (D-007): osie, siatka podłogi, strzałki od początku układu,
 * strzałki między punktami i punkty z podpisami. Kolor elementu wybiera `cls`: `s3-accent`, `s3-blue`,
 * `s3-orange`, `s3-mint`, `s3-violet`, `s3-pink`, `s3-neutral`, `s3-muted`.
 *
 * Geometria żyje w zwykłych obiektach (`item.x`, `item.t`...), które animuje oś czasu GSAP.
 * Rysowanie idzie w osobnej pętli `requestAnimationFrame`, tylko gdy slajd jest widoczny.
 * Dzięki temu przewijanie osi czasu (skoki wstecz) nie zależy od callbacków `onUpdate`,
 * a przestrzeń może się przy tym lekko kołysać jak kamera u 3Blue1Brown.
 */

const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent?.append(el);
  return el;
}

export function createSpace(group, { cx, cy, scale = 110, yaw = -0.55, pitch = 0.32, wobble = 0.22, extent = 2, grid = true } = {}) {
  const view = { yaw, pitch, wobble, time: 0 };
  const layers = {
    grid: svgEl('g', { class: 's3-grid' }, group),
    axes: svgEl('g', { class: 's3-axes' }, group),
    items: svgEl('g', { class: 's3-items' }, group),
  };
  const items = new Map();

  function project([x, y, z]) {
    const a = view.yaw + Math.sin(view.time * 0.35) * view.wobble;
    const p = view.pitch;
    const xr = x * Math.cos(a) - z * Math.sin(a);
    const zr = x * Math.sin(a) + z * Math.cos(a);
    const yr = y * Math.cos(p) - zr * Math.sin(p);
    const depth = y * Math.sin(p) + zr * Math.cos(p);
    const k = 1 / (1 + depth * 0.06);
    return [cx + xr * scale * k, cy - yr * scale * k];
  }

  const gridLines = [];
  if (grid) {
    for (let i = -extent; i <= extent; i++) {
      gridLines.push([svgEl('line', {}, layers.grid), [i, 0, -extent], [i, 0, extent]]);
      gridLines.push([svgEl('line', {}, layers.grid), [-extent, 0, i], [extent, 0, i]]);
    }
  }
  const axisLines = [
    [-extent, 0, 0, extent, 0, 0],
    [0, -extent * 0.6, 0, 0, extent, 0],
    [0, 0, -extent, 0, 0, extent],
  ].map((c) => [svgEl('line', { class: 's3-axis' }, layers.axes), c.slice(0, 3), c.slice(3)]);

  function setLine(el, a, b) {
    const [x1, y1] = project(a);
    const [x2, y2] = project(b);
    el.setAttribute('x1', x1);
    el.setAttribute('y1', y1);
    el.setAttribute('x2', x2);
    el.setAttribute('y2', y2);
  }

  function makeGroup(id, kind, cls) {
    return svgEl('g', { class: `s3-item s3-${kind} ${cls ?? ''}`, 'data-id': id }, layers.items);
  }

  /**
   * Strzałka od `from` (domyślnie początek układu) wzdłuż `vec`; `t` od 0 do 1 to jej wzrost.
   * `labelAt: 'mid'` stawia podpis z boku, w połowie długości, zamiast za grotem.
   */
  function arrow(id, { vec, from = [0, 0, 0], cls, label, labelOffset = [0, 0], labelAt = 'tip', dashed = false }) {
    const g = makeGroup(id, 'arrow', cls);
    const item = {
      kind: 'arrow',
      g,
      x: vec[0],
      y: vec[1],
      z: vec[2],
      fx: from[0],
      fy: from[1],
      fz: from[2],
      t: 1,
      labelOffset,
      labelAt,
      line: svgEl('line', { class: dashed ? 's3-dashed' : '' }, g),
      head: svgEl('path', {}, g),
      text: label ? svgEl('text', { 'text-anchor': 'middle' }, g) : null,
    };
    if (item.text) item.text.textContent = label;
    items.set(id, item);
    return item;
  }

  function point(id, { pos, cls, label, labelOffset = [0, -18], r = 7 }) {
    const g = makeGroup(id, 'point', cls);
    const item = {
      kind: 'point',
      g,
      x: pos[0],
      y: pos[1],
      z: pos[2],
      labelOffset,
      dot: svgEl('circle', { r }, g),
      text: label ? svgEl('text', { 'text-anchor': 'middle' }, g) : null,
    };
    if (item.text) item.text.textContent = label;
    items.set(id, item);
    return item;
  }

  /**
   * Rysuje strzałkę w bieżącym rzucie. Strzałka krótsza niż 4 px jest ukryta, żeby zaokrąglony koniec linii
   * nie zostawiał kropki, a linia kończy się u podstawy grota, żeby nie wystawała spod niego.
   */
  function drawArrow(item) {
    const from = [item.fx, item.fy, item.fz];
    const to = [item.fx + item.x * item.t, item.fy + item.y * item.t, item.fz + item.z * item.t];
    const [x1, y1] = project(from);
    const [x2, y2] = project(to);
    const len = Math.hypot(x2 - x1, y2 - y1);
    item.line.setAttribute('x1', x1);
    item.line.setAttribute('y1', y1);
    item.line.setAttribute('x2', x2);
    item.line.setAttribute('y2', y2);
    item.line.setAttribute('visibility', len < 4 ? 'hidden' : 'visible');
    if (len < 4) {
      item.head.setAttribute('d', '');
      if (item.text) item.text.setAttribute('opacity', 0);
      return;
    }
    const dx = (x2 - x1) / len;
    const dy = (y2 - y1) / len;
    const hx = x2 - dx * 16;
    const hy = y2 - dy * 16;
    item.head.setAttribute('d', `M${x2} ${y2} L${hx - dy * 7} ${hy + dx * 7} L${hx + dy * 7} ${hy - dx * 7} Z`);
    item.line.setAttribute('x2', x2 - dx * 12);
    item.line.setAttribute('y2', y2 - dy * 12);
    if (item.text) {
      const [lx, ly] = item.labelAt === 'mid' ? [(x1 + x2) / 2 - dy * 30, (y1 + y2) / 2 + dx * 30] : [x2 + dx * 26, y2 + dy * 26];
      item.text.setAttribute('opacity', 1);
      item.text.setAttribute('x', lx + item.labelOffset[0]);
      item.text.setAttribute('y', ly + 8 + item.labelOffset[1]);
    }
  }

  function drawPoint(item) {
    const [x, y] = project([item.x, item.y, item.z]);
    item.dot.setAttribute('cx', x);
    item.dot.setAttribute('cy', y);
    if (item.text) {
      item.text.setAttribute('x', x + item.labelOffset[0]);
      item.text.setAttribute('y', y + item.labelOffset[1]);
    }
  }

  function render(time = view.time) {
    view.time = time;
    for (const [el, a, b] of gridLines) setLine(el, a, b);
    for (const [el, a, b] of axisLines) setLine(el, a, b);
    for (const item of items.values()) {
      if (item.kind === 'arrow') drawArrow(item);
      else drawPoint(item);
    }
  }

  /** Kołysanie kamery i odświeżanie geometrii, dopóki `isActive()` zwraca prawdę. */
  function start(isActive) {
    const t0 = performance.now();
    render(0);
    const frame = (now) => {
      if (isActive()) render((now - t0) / 1000);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  return { arrow, point, render, start, item: (id) => items.get(id), node: (id) => items.get(id).g, project };
}
