import { gsap } from 'gsap';

/**
 * Animacje slajdów sterowane krokami reveal.js (D-002).
 *
 * Moduł slajdu zwraca z `animate(section)` listę segmentów `[intro, krok1, krok2, ...]`.
 * Każdy segment dopisuje tweeny na koniec wspólnej osi czasu GSAP i dostaje etykietę
 * `s{i}`. Intro (`s0`) gra samo po wejściu na slajd, a każdy kolejny krok to jeden
 * niewidoczny fragment reveal.js, czyli jedno kliknięcie pilota.
 *
 * Stan slajdu wynika zawsze z liczby widocznych fragmentów: krok do przodu jest
 * animowany, a krok wstecz i każdy skok (powrót z następnego slajdu, odświeżenie
 * strony, wybór z przeglądu) ustawiają stan natychmiast.
 */

const MARKER = 'step-marker';

export function buildTimeline(segments) {
  const tl = gsap.timeline({ paused: true });
  segments.forEach((segment, i) => {
    segment?.(tl);
    tl.addLabel(`s${i}`);
  });
  return { tl, stepCount: segments.length - 1, step: null };
}

export function addStepMarkers(section, count) {
  for (let i = 0; i < count; i++) {
    const marker = document.createElement('span');
    marker.className = `fragment ${MARKER}`;
    marker.setAttribute('aria-hidden', 'true');
    section.append(marker);
  }
}

export function bindTimelines(deck, timelines) {
  let playhead = null;

  const visibleSteps = (section) => section.querySelectorAll(`:scope > .${MARKER}.visible`).length;

  function stop() {
    playhead?.kill();
    playhead = null;
  }

  function jump(entry, step) {
    stop();
    entry.tl.pause().seek(`s${step}`);
    entry.step = step;
  }

  function play(entry, step, { restart = false } = {}) {
    stop();
    if (restart) entry.tl.pause().seek(0);
    playhead = entry.tl.tweenTo(`s${step}`);
    entry.step = step;
  }

  function enter(section) {
    const entry = timelines.get(section);
    if (!entry) return;
    const step = visibleSteps(section);
    if (step === 0) play(entry, 0, { restart: true });
    else jump(entry, step);
  }

  /**
   * Zdarzenia fragmentów przychodzą też przy zmianie slajdu, w nieustalonej kolejności
   * względem `slidechanged`. Porównanie z ostatnio zastosowanym krokiem robi z nich no-op.
   */
  function onFragmentChange() {
    const section = deck.getCurrentSlide();
    const entry = timelines.get(section);
    if (!entry) return;
    const step = visibleSteps(section);
    if (step === entry.step) return;
    if (entry.step !== null && step === entry.step + 1) play(entry, step);
    else jump(entry, step);
  }

  deck.on('ready', (event) => {
    if (deck.isPrintView()) {
      for (const entry of timelines.values()) entry.tl.seek(entry.tl.duration());
      return;
    }
    enter(event.currentSlide);
  });
  deck.on('slidechanged', (event) => enter(event.currentSlide));
  deck.on('fragmentshown', onFragmentChange);
  deck.on('fragmenthidden', onFragmentChange);

  return {
    /** Doprowadza trwającą animację do końca (używane przez skrypt zrzutów ekranu). */
    settle() {
      playhead?.progress(1);
      stop();
    },
  };
}
