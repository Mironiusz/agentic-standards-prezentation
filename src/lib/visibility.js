/** Czy slajd jest na ekranie: bieżący w prezentacji albo dowolny w widoku druku (PDF). */
export function isSlideVisible(section) {
  return section.classList.contains('present') || document.documentElement.classList.contains('reveal-print');
}
