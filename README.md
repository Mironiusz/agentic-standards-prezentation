# Standardy w pipeline agentowym

Prezentacja o standardach agentowych w quantasku (`docs/standards`): po co agentowi kontrakty, jaką rolę
grają w workflow, jak zbudowany jest standard, gdzie standardy się nakładają i czego jeszcze brakuje.
Kończy się ćwiczeniem w zespołach. Opis i przebieg: [`docs/overview.md`](docs/overview.md), plan treści
slajd po slajdzie: [`SEED.md`](SEED.md).

Działa w przeglądarce, z własnymi animacjami w stylu 3Blue1Brown. Każde kliknięcie pilota to jeden krok
animacji, a build daje jeden plik HTML, który działa offline. Silnik pochodzi z wcześniejszej prezentacji
(D-013 w [`docs/decisions.md`](docs/decisions.md)).

## Uruchomienie

```bash
npm install
npx playwright install chromium   # raz na komputer: przeglądarka do zrzutów i PDF-ów
npm run dev        # praca nad slajdami, podgląd na żywo pod adresem z konsoli
npm run build      # dist/index.html: jeden plik, działa offline, bez serwera
npm run pdf        # po buildzie: zapasowe PDF-y w dist/
npm run kahoot     # quiz do Kahoota: out/kahoot.xlsx z docs/kahoot.md
npm run cwiczenie -- C:/Quanta/quantask   # materiały do ćwiczenia z aktualnych standardów
```

Na prezentację wystarczy otworzyć `dist/index.html` w Chrome lub Firefoksie. Plik ma
wszystko w środku (skrypty, style, fonty) i działa bez internetu, więc można go skopiować
na pendrive'a albo wysłać mailem.

## Prowadzenie prezentacji

| Klawisz                  | Działanie                                                           |
| ------------------------ | ------------------------------------------------------------------- |
| `->`, `Spacja`, `PgDown` | następny krok animacji albo następny slajd (pilot)                  |
| `<-`, `PgUp`             | krok wstecz (stan ustawia się natychmiast)                          |
| `S`                      | widok prezentera: notatki, zegar i tempo, następny krok             |
| `F`                      | pełny ekran                                                         |
| `Esc`                    | przegląd wszystkich slajdów                                         |
| `1`-`4`                  | na slajdzie wyników: plansza obszaru wybranego w głosowaniu (D-015) |

Zapasowe PDF-y robi `npm run pdf`: strona na każde kliknięcie (do prowadzenia prezentacji awaryjnie),
slajdy w stanie końcowym i wersja z notatkami. Nazwy plików biorą się z pola `name` w `package.json`.
Próba z zegarem, test rzutnika i lista na dzień prezentacji: [`docs/pokaz.md`](docs/pokaz.md).

## Ćwiczenie

Materiały dla zespołów leżą w `materialy/cwiczenie/`:

- `standard_twoj_obszar.md`: szablon standardu z gotowymi sekcjami Stan dokumentu i Reguła odstępstwa,
  z numerami kolejności pracy jak na slajdzie z szablonem;
- `granice_<obszar>.md`: dla każdego z czterech kandydatów sekcje "Zakres i granice" jego sąsiadów,
  przepisane ze standardów quantaska. Odświeża je `npm run cwiczenie -- <katalog quantaska>`.

Zespoły dostają szablon i plik granic obszaru wybranego w głosowaniu.

## Zmiany w treści

- Plan treści w [`SEED.md`](SEED.md) i opis w [`docs/overview.md`](docs/overview.md).
- Etapy mapy w rogu w `src/slides/stages.js`.
- Slajdy w `src/slides/NN-blok/`, lista w `src/slides/index.js`, czasy w `src/slides/timing.js`.
- Dane wspólne kilku slajdów w `src/components/` (standardy, pipeline, mapa obszarów, kandydaci).

API modułu slajdu, zasady animacji, znaczenie kolorów i komponenty wspólne: [`docs/conventions.md`](docs/conventions.md).

## Sprawdzanie zmian

```bash
npm run build && npm run snapshots              # zrzut każdego slajdu w każdym kroku
npm run build && npm run snapshots -- tytul     # tylko wybrane slajdy (po id)
npm run lint                                    # prettier --check i kontrola stylu (D-017)
npm run format                                  # formatowanie prettierem
```

Zrzuty trafiają do `snapshots/` (poza gitem). Skrypt kończy się błędem, jeśli strona zgłosi
błąd w konsoli, sięgnie do sieci, liczba `[klik]` w notatkach nie zgadza się z krokami animacji
albo slajd nie ma czasu w `src/slides/timing.js`. Zrzut pokazuje stan po zakończeniu kroku, a płynność
animacji trzeba ocenić w przeglądarce.

## Struktura

```
SEED.md                 plan treści (źródło prawdy o tym, co mówimy)
PLAN.md, PLAN_SLAJDY.md materiał roboczy, z którego powstał plan
STANDARDY.md, .html     materiał źródłowy o standardach quantaska (stan 2026-10-01)
materialy/cwiczenie/    szablon standardu i granice sąsiadów dla zespołów
docs/overview.md        krótki opis całej prezentacji
docs/decisions.md       dziennik decyzji (dlaczego tak, a nie inaczej)
docs/conventions.md     jak dodać slajd, kolory, zasady animacji
docs/roadmap.md         fazy pracy i ich status
docs/pokaz.md           próba z zegarem, test rzutnika, dzień prezentacji
docs/kahoot.md          bank pytań do quizu
src/main.js             składa slajdy i uruchamia reveal.js
src/lib/steps.js        kroki animacji GSAP powiązane z kliknięciami
src/lib/rehearsal.js    pomiar czasu slajdów na próbie (?proba)
src/lib/variants.js     warianty slajdu wybierane cyfrą (D-015)
src/components/         elementy wspólne: dane standardów, pipeline, mapa obszarów, kandydaci, kafelki, ikony
src/styles/             motyw i style wspólne
src/slides/NN-blok/     slajdy danego bloku, jeden plik na slajd, plus CSS bloku
src/slides/index.js     kolejność slajdów
src/slides/stages.js    etapy mapy w rogu slajdu
src/slides/timing.js    plan czasu: sekundy na slajd
scripts/snapshots.mjs   zrzuty ekranu przez Playwright i kontrola notatek
scripts/pdf.mjs         zapasowe PDF-y
scripts/deck.mjs        wspólne dla obu skryptów
scripts/kahoot-xlsx.mjs quiz do Kahoota z docs/kahoot.md
scripts/cwiczenie.mjs   materiały do ćwiczenia ze standardów quantaska
scripts/style-check.mjs znaki zakazane, pogrubienia w prozie, komentarze linijkowe
```
