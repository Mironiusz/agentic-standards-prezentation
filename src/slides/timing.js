/**
 * Plan czasu: sekundy na slajd, po id (D-010). Po próbie z zegarem poprawiamy liczby tylko tutaj.
 * Widok prezentera (S) pokazuje na tej podstawie, czy mówimy za wolno, a notatki podają docelową
 * godzinę końca slajdu. `npm run snapshots` zgłasza slajd bez czasu jako błąd.
 */
export const TIMING = {
  tytul: 30,
  przyklad: 60,
};

/** Zapis "2:15" z liczby sekund. */
export function clock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
