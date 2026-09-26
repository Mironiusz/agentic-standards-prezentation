/**
 * Punkt wejścia: składa slajdy z `src/slides/index.js` w sekcje reveal.js, podpina osie czasu GSAP
 * pod kroki i uruchamia prezentację.
 *
 * Fonty to pełne pliki Fontsource, bo tylko one mają `unicode-range` przy każdym podzbiorze.
 * Niepotrzebne podzbiory odsiewa build (`vite.config.js`, D-012).
 */

import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes';
import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';

import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';

import './styles/theme.css';
import './styles/components.css';

import { renderStageMap } from './components/stage-map.js';
import { token } from './lib/theme.js';
import { isRehearsal, startRehearsal } from './lib/rehearsal.js';
import { addStepMarkers, bindTimelines, buildTimeline } from './lib/steps.js';
import { slides } from './slides/index.js';
import { STAGES } from './slides/stages.js';
import { clock, TIMING } from './slides/timing.js';

/**
 * Notatki prezentera: na górze czas slajdu i docelowa godzina jego końca (D-010),
 * a znaczniki [klik] pogrubione, żeby było je widać przy szybkim zerknięciu.
 */
function renderNotes(slide, endsAt) {
  const seconds = TIMING[slide.id];
  const timing = seconds ? `<p><small>Czas: ${clock(seconds)} · koniec slajdu: ${clock(endsAt)}</small></p>` : '';
  return timing + (slide.notes ?? '').replaceAll('[klik]', '<strong>[klik]</strong>');
}

/**
 * Buduje `<section>` jednego slajdu.
 *
 * Tło idzie przez reveal.js (`data-background-color`), a nie tylko przez CSS, bo tylko wtedy trafia
 * do widoku druku (PDF). Treść leży w `.slide-frame` o stałym rozmiarze: ramka niesie marginesy
 * i jest punktem odniesienia dla elementów pozycjonowanych absolutnie, bo widok druku zeruje padding
 * i wysokość `<section>`. Slajd z polem `stage` dostaje w rogu mapę etapów. `data-timing` zasila
 * zegar tempa w widoku prezentera.
 */
function renderSection(slide, endsAt) {
  const section = document.createElement('section');
  section.id = slide.id;
  section.dataset.backgroundColor = token('--bg');
  const corner = slide.stage ? `<div class="stage-corner">${renderStageMap(STAGES, slide.stage)}</div>` : '';
  section.innerHTML = `<div class="slide-frame">${slide.html}${corner}</div>`;
  if (TIMING[slide.id]) section.dataset.timing = TIMING[slide.id];
  section.insertAdjacentHTML('beforeend', `<aside class="notes">${renderNotes(slide, endsAt)}</aside>`);
  return section;
}

/**
 * Składa slajdy, uruchamia reveal.js i wystawia `window.__deck` dla skryptów Playwright
 * (`scripts/snapshots.mjs`, `scripts/pdf.mjs`).
 */
async function main() {
  const container = document.querySelector('.reveal .slides');
  const timelines = new Map();
  let elapsed = 0;
  const sections = slides.map((slide) => renderSection(slide, (elapsed += TIMING[slide.id] ?? 0)));

  for (const [i, slide] of slides.entries()) {
    const section = sections[i];
    container.append(section);
    if (slide.animate) {
      const entry = buildTimeline(slide.animate(section));
      addStepMarkers(section, entry.stepCount);
      timelines.set(section, entry);
    }
  }

  const deck = new Reveal(document.querySelector('.reveal'), {
    width: 1600,
    height: 900,
    margin: 0.04,
    center: false,
    hash: true,
    controls: false,
    progress: true,
    slideNumber: 'c/t',
    transition: 'fade',
    transitionSpeed: 'fast',
    backgroundTransition: 'none',
    pdfSeparateFragments: false,
    totalTime: elapsed,
    plugins: [Notes],
  });

  const steps = bindTimelines(deck, timelines);
  await deck.initialize();
  if (isRehearsal() && !deck.isPrintView()) startRehearsal(deck, slides);

  window.__deck = {
    reveal: deck,
    settle: steps.settle,
    slides: slides.map((s, i) => ({
      id: s.id,
      steps: timelines.get(sections[i])?.stepCount ?? 0,
      timing: TIMING[s.id] ?? 0,
      clicks: (s.notes ?? '').split('[klik]').length - 1,
    })),
    totalTime: elapsed,
  };
}

main();
