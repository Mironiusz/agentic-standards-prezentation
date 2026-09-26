# Silnik prezentacji: reveal.js + GSAP

Prezentacja w przeglądarce, z własnymi animacjami w stylu 3Blue1Brown. Każde kliknięcie pilota to
jeden krok animacji, a build daje jeden plik HTML, który działa offline. W repozytorium jest sam
silnik i dwa slajdy startowe do podmiany (D-013 w [`docs/decisions.md`](docs/decisions.md)).

## Uruchomienie

```bash
npm install
npx playwright install chromium   # raz na komputer: przeglądarka do zrzutów i PDF-ów
npm run dev        # praca nad slajdami, podgląd na żywo pod adresem z konsoli
npm run build      # dist/index.html: jeden plik, działa offline, bez serwera
npm run pdf        # po buildzie: zapasowe PDF-y w dist/
npm run kahoot     # quiz do Kahoota: out/kahoot.xlsx z docs/kahoot.md
```

Na prezentację wystarczy otworzyć `dist/index.html` w Chrome lub Firefoksie. Plik ma
wszystko w środku (skrypty, style, fonty) i działa bez internetu, więc można go skopiować
na pendrive'a albo wysłać mailem.

## Prowadzenie prezentacji

| Klawisz                  | Działanie                                               |
| ------------------------ | ------------------------------------------------------- |
| `->`, `Spacja`, `PgDown` | następny krok animacji albo następny slajd (pilot)      |
| `<-`, `PgUp`             | krok wstecz (stan ustawia się natychmiast)              |
| `S`                      | widok prezentera: notatki, zegar i tempo, następny krok |
| `F`                      | pełny ekran                                             |
| `Esc`                    | przegląd wszystkich slajdów                             |

Zapasowe PDF-y robi `npm run pdf`: strona na każde kliknięcie (do prowadzenia prezentacji awaryjnie),
slajdy w stanie końcowym i wersja z notatkami. Nazwy plików biorą się z pola `name` w `package.json`.
Próba z zegarem, test rzutnika i lista na dzień prezentacji: [`docs/pokaz.md`](docs/pokaz.md).

## Nowa prezentacja na tym silniku

1. Nazwa w `package.json` i tytuł w `index.html`.
2. Plan treści w [`SEED.md`](SEED.md) i opis w [`docs/overview.md`](docs/overview.md).
3. Etapy mapy w rogu w `src/slides/stages.js`.
4. Slajdy w `src/slides/NN-blok/`, lista w `src/slides/index.js`, czasy w `src/slides/timing.js`.
   Slajdy startowe z `src/slides/01-start/` można usunąć, gdy pojawią się własne.
5. Znaczenie kolorów w tabeli w [`docs/conventions.md`](docs/conventions.md).

API modułu slajdu, zasady animacji i komponenty wspólne: [`docs/conventions.md`](docs/conventions.md).

## Sprawdzanie zmian

```bash
npm run build && npm run snapshots              # zrzut każdego slajdu w każdym kroku
npm run build && npm run snapshots -- tytul     # tylko wybrane slajdy (po id)
```

Zrzuty trafiają do `snapshots/` (poza gitem). Skrypt kończy się błędem, jeśli strona zgłosi
błąd w konsoli, sięgnie do sieci, liczba `[klik]` w notatkach nie zgadza się z krokami animacji
albo slajd nie ma czasu w `src/slides/timing.js`. Zrzut pokazuje stan po zakończeniu kroku, a płynność
animacji trzeba ocenić w przeglądarce.

## Struktura

```
SEED.md                 plan treści (źródło prawdy o tym, co mówimy)
docs/overview.md        krótki opis całej prezentacji
docs/decisions.md       dziennik decyzji (dlaczego tak, a nie inaczej)
docs/conventions.md     jak dodać slajd, kolory, zasady animacji
docs/roadmap.md         fazy pracy i ich status
docs/pokaz.md           próba z zegarem, test rzutnika, dzień prezentacji
docs/kahoot.md          bank pytań do quizu
src/main.js             składa slajdy i uruchamia reveal.js
src/lib/steps.js        kroki animacji GSAP powiązane z kliknięciami
src/lib/rehearsal.js    pomiar czasu slajdów na próbie (?proba)
src/components/         elementy wspólne (mapa etapów, diagramy przepływu, przestrzeń 3D, ikony)
src/styles/             motyw i style wspólne
src/slides/NN-blok/     slajdy danego bloku, jeden plik na slajd, plus CSS bloku
src/slides/index.js     kolejność slajdów
src/slides/stages.js    etapy mapy w rogu slajdu
src/slides/timing.js    plan czasu: sekundy na slajd
scripts/snapshots.mjs   zrzuty ekranu przez Playwright i kontrola notatek
scripts/pdf.mjs         zapasowe PDF-y
scripts/deck.mjs        wspólne dla obu skryptów
scripts/kahoot-xlsx.mjs quiz do Kahoota z docs/kahoot.md
```
