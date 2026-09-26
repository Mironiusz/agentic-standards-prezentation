# Tytuł prezentacji: opis

## W skrócie

Do uzupełnienia: o czym jest prezentacja, dla kogo i ile trwa.

## Przebieg

| Blok | Czas | Slajdy | O czym |
| ---- | ---- | ------ | ------ |
|      |      |        |        |

Czas bloku to suma czasów jego slajdów w `src/slides/timing.js`.

## Forma

Wynika z silnika (`docs/decisions.md`, D-001 do D-012):

- Ciemny motyw w duchu 3Blue1Brown, po polsku, format 16:9.
- Wszystkie animacje są własne. Każde kliknięcie pilota to jeden krok, a krok wstecz ustawia stan od razu.
- Mapa etapów w prawym dolnym rogu pokazuje, na którym etapie prezentacji jesteśmy (`src/slides/stages.js`).
- Widok prezentera (klawisz S) z notatkami, w których kliknięcia są oznaczone jako `[klik]`,
  i z tempem względem planu czasu slajd po slajdzie.
- Całość to jeden plik HTML, który działa bez internetu. Z tego samego pliku powstają zapasowe PDF-y:
  strona na każde kliknięcie, slajdy w stanie końcowym i wersja z notatkami.
