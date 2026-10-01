/**
 * Etapy mapy w prawym dolnym rogu slajdu (`src/components/stage-map.js`), w kolejności rysowania.
 * Slajd pokazuje mapę, gdy ma w module pole `stage` z kluczem z tej listy. Etykieta trafia na mapę
 * małym fontem mono, więc powinna być krótka (najwyżej kilkanaście znaków). Blok 0 (wstęp) nie ma etapu.
 */
export const STAGES = [
  { key: 'workflow', label: 'workflow' },
  { key: 'role', label: 'role' },
  { key: 'anatomia', label: 'anatomia' },
  { key: 'standardy', label: 'standardy' },
  { key: 'granice', label: 'granice' },
  { key: 'mapa', label: 'mapa' },
  { key: 'cwiczenie', label: 'ćwiczenie' },
];
