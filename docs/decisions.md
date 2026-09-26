# Dziennik decyzji

Każdy wpis: co postanowiono, dlaczego i jakie ma to skutki. Nowe decyzje dopisujemy na końcu.
Decyzji nie usuwamy: jeśli zmieniamy zdanie, dodajemy nowy wpis i oznaczamy stary jako zastąpiony.

Wpisy D-001 do D-012 to decyzje o silniku przejęte z prezentacji, z której silnik pochodzi, z nową
numeracją (tabela w D-013). Decyzje o treści tamtej prezentacji zostały usunięte razem z nią.

## D-001: Prezentacja w przeglądarce (reveal.js), nie PowerPoint

2026-09-16 · przyjęta

Narzędzia do generowania `.pptx` praktycznie nie obsługują animacji, a to one są rdzeniem
prezentacji (strzałki przesuwające się w przestrzeni, diagramy budowane krok po kroku). reveal.js
daje nawigację pilotem, widok prezentera z notatkami, przegląd slajdów i eksport do PDF.

## D-002: Animacje jako osie czasu GSAP sterowane krokami reveal.js

2026-09-16 · przyjęta

Każdy animowany slajd ma jedną oś czasu GSAP podzieloną etykietami na kroki. Kroki to niewidoczne
fragmenty reveal.js, więc pilot i klawiatura działają bez żadnej dodatkowej obsługi.
Stan slajdu zawsze wynika z liczby widocznych fragmentów: krok do przodu jest animowany,
a krok wstecz i skoki ustawiają stan natychmiast. Dzięki temu cofanie, powrót z następnego
slajdu i odświeżenie strony zawsze dają poprawny obraz. Implementacja: `src/lib/steps.js`.

Odrzucone: Manim (renderowanie wideo, brak kroków sterowanych kliknięciem, cięższy warsztat).
Można do niego wrócić przy pojedynczej scenie, jeśli GSAP nie wystarczy.

## D-003: Jeden plik offline (Vite + vite-plugin-singlefile)

2026-09-16 · przyjęta

Na sali może nie być internetu. Build daje `dist/index.html` z wbudowanymi skryptami, stylami
i fontami (`@fontsource`, bez Google Fonts). Plik działa otwarty z dysku (`file://`), co sprawdza
`scripts/snapshots.mjs`, bo testuje właśnie ten plik i zgłasza każde zapytanie do sieci.

## D-004: Ciemny motyw w duchu 3Blue1Brown i paleta sprawdzona pod kątem daltonizmu

2026-09-16 · przyjęta

Ciemny motyw. Kolory mają w prezentacji stałe znaczenie, które opisuje tabela w `docs/conventions.md`.
Trzy kolory przeznaczone do stawiania obok siebie sprawdzono walidatorem pod kątem daltonizmu.
Klasyczne dla 3b1b zestawienie czerwony i zielony nie przeszło (ΔE 4,6 przy deuteranopii).
Wybrane: niebieski `#5b8def`, pomarańczowy `#f5a142`, miętowy `#9ae6d0` (najgorsza para ΔE 15,7).
Pozostałe kolory palety (akcent, fioletowy, różowy, łupkowy, alert) nie były sprawdzane razem z tą trójką.

Świadome odstępstwo: kolory są jaśniejsze, niż zaleca walidator dla wykresów na ciemnym tle,
bo rzutnik zjada kontrast. Kolor nigdy nie jest jedynym nośnikiem znaczenia: zawsze towarzyszy
mu podpis.

Ryzyko: ciemne slajdy na słabym rzutniku w jasnej sali mogą być mało czytelne. Warto sprawdzić
na docelowym sprzęcie (`docs/pokaz.md`).

## D-005: Geometria slajdów bez pomiarów DOM

2026-09-16 · przyjęta

reveal.js ukrywa nieaktywne slajdy (`display: none`), więc pomiary rozmiarów przy budowaniu
zwracałyby zera. Współrzędne w SVG są stałe albo liczone z metryki fontu monospace
(IBM Plex Mono: szerokość znaku 0,6 em). Z tego samego powodu ścieżki ruchu liczymy
analitycznie (np. próbkowanie krzywej Béziera), a nie przez `getTotalLength()`.

## D-006: Symbole spoza fontu rysujemy w SVG

2026-09-17 · przyjęta

Podzbiory IBM Plex z `@fontsource` nie zawierają strzałek, znaku "w przybliżeniu", pierwiastka
ani kropek pionowych. Przeglądarka dobrałaby je z fontu systemowego, więc na komputerze na sali
wyglądałyby inaczej niż przy przygotowaniach. Strzałki, "w przybliżeniu", ptaszek i krzyżyk są
w `src/components/icons.js`, a wzory składa KaTeX z własnymi fontami (D-008).

## D-007: Wspólna przestrzeń 3D z własnym rzutowaniem zamiast biblioteki

2026-09-17 · przyjęta

Strzałki i punkty w przestrzeni potrzebują lekkiego kołysania kamery i pełnej kontroli nad stylem.
Three.js to ciężka zależność, rysuje w canvas (gorzej z ostrością tekstu i PDF) i nie pasuje do stylu
SVG reszty slajdów. `src/components/space3d.js` to rzut perspektywiczny w ok. 170 liniach SVG.

## D-008: KaTeX do wzorów

2026-09-17 · przyjęta

Wzory składa KaTeX w czasie budowania modułu (`src/lib/math.js`). Ma własne fonty,
więc pierwiastki, indeksy i strzałki wektorów wyglądają wszędzie tak samo (D-006). Fragment wzoru można
pokolorować przez `\htmlClass{klasa}{...}`. Wzór to HTML, więc na slajdach z SVG leży w warstwie
nad rysunkiem, w tych samych współrzędnych.

Koszt: fonty KaTeX są w trzech formatach (woff2, woff, ttf) i powiększały plik o ponad megabajt.
Od D-012 build zostawia z nich sam woff2. KaTeX trafia do builda tylko wtedy, gdy jakiś slajd
importuje `src/lib/math.js`.

## D-009: Wspólne komponenty diagramów

2026-09-17 · przyjęta

Zamiast rysować diagramy przepływu za każdym razem od nowa, są dwa moduły wspólne:

- `src/components/flow.js`: kolumna i rząd pudełek ze strzałkami (`flowColumn`, `flowRow`, `vArrow`,
  `vArrowUp`, `hArrow`). Zwraca gotową geometrię pudełek, więc slajd może podpiąć animację i dorysować
  własne połączenia. Style `.fl-*` są w `src/styles/components.css`.
- `src/lib/svg-text.js`: `svgLines` i `wrapText`, bo SVG nie zawija tekstu sam, a pomiary DOM są wykluczone
  (D-005). Łamanie liczymy w znakach, nie w pikselach.

## D-010: Plan czasu, próba i zapasowe PDF-y

2026-09-17 · przyjęta

- Plan czasu leży w jednym pliku `src/slides/timing.js` (sekundy na slajd, po id), a nie w modułach
  slajdów. Po próbie poprawia się go w jednym miejscu. `main.js` przekazuje czasy do reveal.js
  (`data-timing`, `totalTime`), więc widok prezentera pokazuje tempo. Notatki zaczynają się od linijki
  z czasem slajdu i planowaną godziną jego końca, a `[klik]` jest pogrubiony.
- Próbę mierzy sama prezentacja otwarta z `?proba` (`src/lib/rehearsal.js`): czas na slajd trafia do
  localStorage, a `__proba()` w konsoli zwraca gotowe wpisy do `timing.js`. Bez parametru kod nic nie robi.
- Zapasowe PDF-y robi `npm run pdf` przez Playwright, w trzech wersjach. Widok druku reveal.js pokazuje
  animowane slajdy tylko w stanie końcowym, a ten bywa inny niż stany pośrednie (np. przygaszona wcześniejsza
  treść). Do prowadzenia prezentacji awaryjnie służy więc PDF ze zrzutów, strona na każde kliknięcie
  (bez linków). Widok druku zostaje dla wersji do rozesłania (tekst wektorowy, linki) i dla wersji
  z notatkami na osobnych stronach, na próbę z kartki.
- `npm run snapshots` pilnuje spójności: liczba `[klik]` równa liczbie kroków, każdy slajd ma czas,
  a strona nie wysyła żadnego zapytania do sieci (D-003).
- Próby i testu na rzutniku nie da się zautomatyzować. Robi je prelegent według `docs/pokaz.md`.

## D-011: Quiz Kahoot powstaje z pliku w repozytorium

2026-09-17 · przyjęta

- Bank pytań jest w `docs/kahoot.md` i to on jest źródłem prawdy: treść pytań, odpowiedzi, poprawne
  numery, czas i komentarz dla prelegenta. Poprawki robi się tam, a nie w edytorze Kahoota, bo edytor
  niczego nie wersjonuje.
- `npm run kahoot` (`scripts/kahoot-xlsx.mjs`) składa z tego pliku `out/kahoot.xlsx`: bierze szablon
  `KahootQuizTemplate.xlsx` (oficjalny szablon Kahoota), zostawia nagłówek i formatowanie, a podmienia
  wiersze z pytaniami. Skrypt nie ma zależności: xlsx to zip z XML-ami, a `node:zlib` wystarczy do jego
  przepisania. Import w Kahoocie jest w edytorze (Blank canvas, potem Import).
- Skrypt przerywa pracę, gdy pytanie przekracza 120 znaków, odpowiedź 75 znaków, czas jest spoza
  listy Kahoota albo numer poprawnej odpowiedzi wskazuje na nieistniejącą odpowiedź. Te same limity
  szablon zaznacza na czerwono, ale import po cichu przycina tekst, więc sprawdzamy je sami.
- `out/` jest poza gitem, jak `dist/` i `snapshots/`: plik xlsx odtwarza się jedną komendą.

## D-012: Lżejszy plik do wysłania i mapa w rogu bez przycięcia

2026-09-18 · przyjęta

- Mapa etapów w rogu miała skrajne prostokąty dokładnie na krawędziach `viewBox`, a ich obrys ma 1,5 px,
  więc połowa obrysu wypadała poza rysunek i była ucinana. Mapa ma 2 px marginesu w `viewBox`
  (stała `EDGE`). Rysunek się nie przesuwa, bo mapa jest kotwiczona do prawej krawędzi slajdu.
- Build osadzał każdy font trzy razy (woff2, woff, ttf), a Fontsource dokładał podzbiory cyrylicy,
  greki i wietnamskiego. Wtyczka `trimFonts` w `vite.config.js` usuwa reguły `@font-face` tych podzbiorów
  i zostawia w `src` tylko woff2. W prezentacji, z której pochodzi silnik, plik zszedł z 3,3 MB do 1,5 MB.
- Podzbiory odsiewamy z pełnych plików Fontsource (`400.css`), a nie przez import `latin-400.css`:
  pliki per podzbiór nie mają `unicode-range`, więc przy kilku importach naraz ostatni z nich
  nadpisuje pozostałe i połowa znaków traci font.
- Skutek uboczny: greckie litery nie mają już fontu IBM Plex. Wzory z greką składa KaTeX (D-008).
- woff2 rozumie każda przeglądarka od 2017 roku, a wymaganie z D-003 to plik otwierany z dysku
  w Chrome albo Firefoksie, bez internetu.

## D-013: Silnik wydzielony z prezentacji "Wnętrze transformera"

2026-09-26 · przyjęta

Repozytorium zawierało prezentację "Wnętrze transformera" (slajdy o transformerze i o RAG). Zostaje
z niego sam silnik, na którym powstanie nowa prezentacja.

- Usunięte: wszystkie slajdy z CSS bloków, moduły z przykładami tamtej prezentacji (zdania, liczby,
  przykład firmowy), notatki prelegenta, bank pytań do Kahoota, plan treści i decyzje o treści.
  Zależność `js-tiktoken` służyła tylko do sprawdzania slajdu o tokenizacji, więc też wypadła.
- Dwie mapy w rogu (podróż przez transformer i system RAG) miały prawie ten sam kod. Zastępuje je jeden
  komponent `src/components/stage-map.js`, a listę etapów trzyma prezentacja w `src/slides/stages.js`.
  Slajd wybiera etap polem `stage`. Nieznany klucz to błąd, a nie mapa bez podświetlenia. Grupowanie
  etapów w blok z dopiskiem "xN" (warstwy transformera) wypadło razem z treścią.
- Tokeny kolorów nazywają barwę, a nie znaczenie z tamtej prezentacji (`--accent`, `--c-blue`,
  `--c-orange`, `--c-mint`, `--c-violet`, `--c-pink`, `--c-slate`, `--c-alert`). Wartości się nie zmieniły.
  Klasy kolorów komponentów idą za paletą: `s3-*` w przestrzeni 3D i `is-*` w diagramach przepływu.
- Nazwy PDF-ów biorą się z pola `name` w `package.json`, a nie ze stałej w skrypcie.
- Dwa slajdy startowe (`src/slides/01-start/`) pokazują API modułu i pozwalają od razu sprawdzić,
  że build, kroki, notatki i zrzuty działają. Są do podmiany.
- Komentarze linijkowe w kodzie zamienione na docstringi, zgodnie ze standardem pracy w repozytorium.

Numeracja decyzji silnika w tamtej prezentacji i tutaj (do czytania starej historii gita):

| Tam   | Tutaj |
| ----- | ----- |
| D-001 | D-001 |
| D-002 | D-002 |
| D-003 | D-003 |
| D-004 | D-004 |
| D-010 | D-005 |
| D-014 | D-006 |
| D-015 | D-007 |
| D-018 | D-008 |
| D-030 | D-009 |
| D-034 | D-010 |
| D-035 | D-011 |
| D-036 | D-012 |
