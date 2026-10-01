import { AREAS, areaKey } from './infra-map.js';

/**
 * Kandydaci do ćwiczenia w kolejności głosowania (`PLAN_SLAJDY.md` 7.1). Są wspólni dla mapy z kandydatami
 * (6.2), kart do głosowania (7.1) i planszy wyników (7.4), więc numer kandydata znaczy wszędzie to samo,
 * także jako klawisz wyboru planszy wyników.
 *
 * `area` to klucz obszaru z `infra-map.js`, z którego bierze się nazwa kandydata. `neighbours` to standardy,
 * z którymi zespoły rysują granice, a `extra` to jedna informacja na kartę do głosowania.
 */
const PICKS = [
  { area: 'config', neighbours: ['architecture', 'logging', 'security', 'coolify'], extra: 'gotowy standard do porównania' },
  { area: 'ci', neighbours: ['git', 'review', 'code_quality', 'security', 'tests'], extra: 'reguły dziś w PRD zamkniętego zadania' },
  { area: 'kontenery', neighbours: ['config', 'coolify', 'database'], extra: 'compose.*, docker/, makefile' },
  { area: 'wydajnosc', neighbours: ['code_quality', 'database', 'architecture'], extra: 'dziś sekcja w code_quality' },
];

/**
 * Kandydaci z nazwą w liniach, tak jak podpisuje ich kafelek na mapie, i w jednym wierszu. `standard` to nazwa
 * istniejącego standardu obszaru (do porównania po ćwiczeniu) albo `null`, gdy obszar własnego standardu nie ma.
 */
export const CANDIDATES = PICKS.map((pick) => {
  const area = AREAS.find((a) => areaKey(a) === pick.area);
  const lines = area.std ? [area.std] : area.lines;
  return { ...pick, lines, name: lines.join(' '), standard: area.std ?? null };
});
