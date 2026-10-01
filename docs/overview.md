# Standardy w pipeline agentowym: opis

## W skrócie

Prezentacja o standardach, według których pracuje agent w quantasku (`docs/standards`). Teza: kiedy agent
czegoś nie wie, zgaduje kontrakt i dorabia fallbacki, więc potrzebuje kontraktów, a nie dłuższego promptu.
Pokazujemy, gdzie standardy pracują w workflow, jak są zbudowane, gdzie się nakładają i jakich obszarów
jeszcze brakuje. Kończymy ćwiczeniem: zespoły po 3-4 osoby piszą standard dla jednego obszaru.

Czas: około 91 minut, z czego ćwiczenie zajmuje ponad 40. Plan treści slajd po slajdzie: `SEED.md`.

## Przebieg

| Blok                                 | Czas  | Slajdy | O czym                                                                                      |
| ------------------------------------ | ----- | ------ | ------------------------------------------------------------------------------------------- |
| 0. Wstęp                             | 3:00  | 3      | co robi agent, kiedy nie wie, i teza o kontraktach                                          |
| 1. Workflow w quantasku              | 4:40  | 3      | łańcuch od SEED do archiwum, bramki i skala pracy z agentem                                 |
| 2. Rola standardów w pipeline        | 8:00  | 7      | pięć ról standardów nałożonych na pipeline i słabości każdej z nich                         |
| 3. Anatomia standardu                | 5:00  | 3      | szkielet z sześciu sekcji, przykłady pytań, na które odpowiada standard, i grupy standardów |
| 4. Trzy standardy z bliska           | 12:00 | 9      | formatting z code_quality, git i config: po co, reguły i kto ich pilnuje                    |
| 5. Odpowiedzialność i nakładanie się | 13:00 | 9      | granice między standardami, graf odwołań, granice automatów i Kahoot                        |
| 6. Mapa infra                        | 4:00  | 2      | które obszary projektu mają standard, a których brakuje, i kandydaci do ćwiczenia           |
| 7. Ćwiczenie                         | 41:30 | 5      | głosowanie, szablon, 25 minut pracy w zespołach, porównanie granic i zamknięcie pętli       |

Czas bloku to suma czasów jego slajdów w `src/slides/timing.js`.

## Forma

Wynika z silnika (`docs/decisions.md`, D-001 do D-012) i z decyzji o tej prezentacji (D-014 do D-016):

- Ciemny motyw w duchu 3Blue1Brown, po polsku, format 16:9. Kolory mają stałe znaczenia (`docs/conventions.md`).
- Wszystkie animacje są własne. Każde kliknięcie pilota to jeden krok, a krok wstecz ustawia stan od razu.
- Mapa etapów w prawym dolnym rogu pokazuje, na którym etapie prezentacji jesteśmy (`src/slides/stages.js`).
- Widok prezentera (klawisz S) z notatkami, w których kliknięcia są oznaczone jako `[klik]`,
  z tempem względem planu czasu slajd po slajdzie i z zapowiedzią następnego slajdu.
- Plansza wyników ćwiczenia przełącza się klawiszem 1-4 na obszar wybrany w głosowaniu.
- Całość to jeden plik HTML, który działa bez internetu. Z tego samego pliku powstają zapasowe PDF-y:
  strona na każde kliknięcie, slajdy w stanie końcowym i wersja z notatkami.
- Poza slajdami: quiz Kahoot z `docs/kahoot.md` i materiały dla zespołów w `materialy/cwiczenie/`.
