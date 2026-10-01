/**
 * Plan czasu: sekundy na slajd, po id (D-010). Po próbie z zegarem poprawiamy liczby tylko tutaj.
 * Widok prezentera (S) pokazuje na tej podstawie, czy mówimy za wolno, a notatki podają docelową
 * godzinę końca slajdu. `npm run snapshots` zgłasza slajd bez czasu jako błąd.
 *
 * Założenie z `PLAN_SLAJDY.md`: około 90 minut, z czego ćwiczenie w zespołach zajmuje ponad 40.
 */
export const TIMING = {
  tytul: 20,
  'agent-nie-wie': 100,
  teza: 60,

  lancuch: 120,
  bramki: 100,
  skala: 60,

  'rola-proces': 75,
  'rola-nawigacja': 75,
  'rola-fazy': 90,
  'rola-bramka': 75,
  'rola-petla': 75,
  wszedzie: 30,
  slabosci: 60,

  szkielet: 120,
  tresci: 90,
  klastry: 90,

  'fmt-po-co': 60,
  'fmt-reguly': 120,
  'fmt-pilnuje': 60,
  'git-po-co': 60,
  'git-reguly': 120,
  'git-pilnuje': 60,
  'config-po-co': 60,
  'config-reguly': 120,
  'config-pilnuje': 60,

  duplikat: 45,
  'jeden-adres': 45,
  granica: 45,
  'mapa-hierarchia': 60,
  graf: 75,
  'sypie-sie': 75,
  automaty: 60,
  checklista: 45,
  kahoot: 330,

  'mapa-infra': 180,
  kandydaci: 60,

  wybor: 180,
  szablon: 120,
  zegar: 1500,
  wyniki: 600,
  zamkniecie: 90,
};

/** Zapis "2:15" z liczby sekund. */
export function clock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
