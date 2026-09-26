/**
 * Etapy mapy w prawym dolnym rogu slajdu (`src/components/stage-map.js`), w kolejności rysowania.
 * Slajd pokazuje mapę, gdy ma w module pole `stage` z kluczem z tej listy. Etykieta trafia na mapę
 * małym fontem mono, więc powinna być krótka (najwyżej kilkanaście znaków).
 *
 * Lista startowa pasuje do slajdów przykładowych i jest do podmiany na etapy własnej prezentacji.
 */
export const STAGES = [
  { key: 'wstep', label: 'wstęp' },
  { key: 'przyklad', label: 'przykład' },
  { key: 'podsumowanie', label: 'podsumowanie' },
];
