# Konwencje

## Moduł slajdu

Jeden plik na slajd w `src/slides/NN-blok/sNN-nazwa.js`, dopisany do listy w `src/slides/index.js`,
z czasem w sekundach w `src/slides/timing.js` (D-010). Style bloku leżą obok, w `src/slides/NN-blok/blok.css`,
importowane z modułu slajdu. Wzór: `src/slides/01-start/s02-przyklad.js`.

| Pole               | Wymagane | Znaczenie                                                                           |
| ------------------ | -------- | ----------------------------------------------------------------------------------- |
| `id`               | tak      | unikalne, trafia do URL, do nazw zrzutów i jako klucz do `timing.js`                |
| `html`             | tak      | treść slajdu, bez znacznika `<section>`                                             |
| `notes`            | nie      | notatki prezentera (klawisz S), kliknięcia oznaczone `[klik]`                        |
| `stage`            | nie      | klucz etapu z `src/slides/stages.js`: mapa etapów w prawym dolnym rogu              |
| `animate(section)` | nie      | zwraca listę segmentów `[intro, krok1, krok2, ...]`, każdy to `(tl) => { tl.to(...) }` |

```js
export default {
  id: 'przyklad',
  stage: 'przyklad',
  html: `<h2 class="slide-title">Tytuł slajdu</h2>`,
  notes: `<p>Wstęp.</p><p>[klik] Co się pojawia po kliknięciu.</p>`,
  animate(section) {
    return [intro, krok1];
  },
};
```

Notatki, czas i znaczniki `[klik]` sprawdza `npm run snapshots`.

Mapa etapów pokazuje, na którym etapie prezentacji jesteśmy. Listę etapów (`{ key, label }`) ustala
prezentacja w `src/slides/stages.js`. Slajd bez `stage` nie pokazuje mapy. Etap spoza listy to błąd
na starcie strony, który `npm run snapshots` zgłosi.

## Animacje

- Pierwszy segment to intro, które gra samo po wejściu na slajd. Każdy kolejny to jedno kliknięcie.
  Pusty intro: `null`.
- W notatkach zaznaczamy kliknięcia jako `[klik]`, żeby prelegent wiedział, co się wydarzy.
  Liczba `[klik]` musi być równa liczbie kroków.
- Stan początkowy elementu, który zmienia się w późniejszym kroku, ustawiamy przez `gsap.set()`
  **poza** osią czasu, a w osi używamy `to()`. Cofnięcie do zera przywraca wtedy stan z `set()`.
- `from()` jest dozwolone dla prostego wejścia elementu, ale nigdy dwa razy na tej samej
  właściwości tego samego elementu. Drugie `from()` zapamięta 0 jako wartość końcową
  i element już się nie pojawi. Jeśli element wchodzi w późniejszym kroku, a wcześniej był
  widoczny: `fromTo(..., { immediateRender: false })`.
- GSAP nie interpoluje `var(--...)`. Kolory do animacji bierzemy z `token('--nazwa')` (`src/lib/theme.js`).
- Pierwszy tween segmentu nie może mieć pozycji względnej (`'<'`, `'<0.3'`). Liczyłaby się
  od początku ostatniego tweena **poprzedniego** kroku i animacja wjechałaby w cudzy krok.
- Bez pomiarów DOM (D-005): geometria ze stałych albo z metryki fontu mono.
- Ruch, który ma być widoczny, rysujemy nad węzłami, a nie pod nimi.
- W `html` slajdu nie używamy znacznika `<section>`: reveal.js traktuje zagnieżdżoną sekcję jako slajd pionowy.
- Stany pośrednie sprawdzamy osobnym skryptem Playwright (klik, odczekanie, zrzut), bo
  `npm run snapshots` pokazuje tylko stan końcowy kroku.

## Komponenty wspólne

| Moduł                           | Do czego                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/components/stage-map.js`   | mapa etapów w prawym dolnym rogu (`stage` w module slajdu, lista w `src/slides/stages.js`)             |
| `src/components/flow.js`        | diagramy przepływu: `flowColumn`, `flowRow`, `vArrow`, `vArrowUp`, `hArrow`; zwraca geometrię pudełek |
| `src/components/space3d.js`     | przestrzeń wektorów: strzałki, punkty, siatka, lekkie kołysanie kamery                                |
| `src/components/token-chips.js` | rząd tokenów jak w Tiktokenizerze, z numerami                                                         |
| `src/components/icons.js`       | symbole spoza fontu: `ARROW`, `APPROX`, `CHECK`, `CROSS` w HTML; `svgArrow()`, `svgCheck()`... w SVG  |
| `src/lib/math.js`               | `tex(źródło, { display })`: wzór KaTeX jako HTML (D-008); `decimal(v)`: liczba z przecinkiem          |
| `src/lib/svg-text.js`           | `svgLines(lines, ...)` i `wrapText(tekst, znaki)`: SVG nie zawija tekstu sam                          |
| `src/lib/visibility.js`         | `isSlideVisible(section)`: czy slajd jest na ekranie albo w widoku druku                              |
| `src/lib/theme.js`              | `token('--nazwa')`: wartość tokenu koloru do animacji GSAP                                            |

`space3d`: geometrię (`item.t`, `item.x`...) animuje oś czasu, a rysuje pętla `requestAnimationFrame`
uruchamiana przez `space.start(() => isSlideVisible(section))`. Strzałka, która ma "wyrosnąć",
dostaje `t = 0` przed zbudowaniem osi czasu. Podpis przy środku strzałki: `labelAt: 'mid'`.
Przesunięcie strzałki: tween `x`, `y`, `z` jej obiektu.

Wzory: `tex()` zwraca HTML, więc na slajdzie z SVG wzór leży w absolutnie pozycjonowanym `<div>`
nad rysunkiem, w tych samych współrzędnych. Kolor fragmentu wzoru: `\htmlClass{klasa}{...}` plus CSS.

Dane wspólne dla kilku slajdów (przykład, liczby, zdania) trzymamy w jednym module w `src/components/`
i liczymy w kodzie, zamiast przepisywać je do każdego slajdu.

## Kolory

Tylko tokeny z `src/styles/theme.css`, nigdy surowe wartości hex w slajdach. Nazwy tokenów mówią
o barwie. Znaczenie ustala prezentacja: jeden kolor ma jedno znaczenie w całej prezentacji
i zawsze stoi przy nim podpis (D-004). Kolumnę "Znaczenie" uzupełniamy, gdy zapadnie decyzja.

| Token                                  | Barwa      | Klasa w `space3d` | Klasa w `flow` | Znaczenie      |
| -------------------------------------- | ---------- | ----------------- | -------------- | -------------- |
| `--accent`                             | żółty      | `s3-accent`       | `is-accent`    | do ustalenia   |
| `--c-blue`                             | niebieski  | `s3-blue`         | `is-blue`      | do ustalenia   |
| `--c-orange`                           | pomarańcz  | `s3-orange`       | `is-orange`    | do ustalenia   |
| `--c-mint`                             | miętowy    | `s3-mint`         | `is-mint`      | do ustalenia   |
| `--c-violet`                           | fioletowy  | `s3-violet`       | `is-violet`    | do ustalenia   |
| `--c-pink`                             | różowy     | `s3-pink`         | `is-pink`      | do ustalenia   |
| `--c-slate`                            | łupkowy    | -                 | -              | do ustalenia   |
| `--c-alert`                            | czerwony   | -                 | `is-alert`     | to, co idzie źle |
| `--text`, `--text-dim`, `--text-muted` | tekst      | `s3-neutral`, `s3-muted` | `is-dim` | główny, drugorzędny, przypisy |

Niebieski, pomarańczowy i miętowy są sprawdzone razem pod kątem daltonizmu, więc to one mają stać
obok siebie, gdy trzeba rozróżnić kilka rzeczy naraz (D-004). Pozostałe pary nie były sprawdzane.
Akcent (`--accent`) to domyślnie to, na co w tej chwili patrzymy: pasek postępu i aktywny etap mapy.

## Typografia i układ

- Slajd ma 1600 x 900 px. `main.js` opakowuje `html` modułu w `.slide-frame` o stałym rozmiarze
  z marginesami (80 px po bokach, `--pad-x`). Elementy `position: absolute` liczą się względem
  tej ramki. Nie ustawiamy paddingu na `<section>`, bo widok druku reveal.js go zeruje.
- IBM Plex Sans dla tekstu, IBM Plex Mono dla tokenów, liczb i kodu.
- Dołączone podzbiory fontów (latin, latin-ext) mają polskie znaki, cudzysłowy, półpauzy, wielokropek,
  znak mnożenia i minus, ale **nie mają** strzałek, symboli matematycznych ani greki (D-012).
  Te rysujemy w SVG (`icons.js`) albo zostawiamy KaTeX-owi. Inaczej przeglądarka weźmie font systemowy (D-006).
- Minimalny rozmiar tekstu na slajdzie to 17 px (przypisy). Treść, którą sala ma przeczytać: od 24 px.
- Prawy dolny róg należy do mapy etapów, a prawy górny do numeru slajdu.
- Klasy wspólne: `.slide-title`, `.kicker`, `.footnote`, `.accent`, `.mono`, `.code-card`
  (`src/styles/components.css`).

## Treść

- Po polsku. Nazwy techniczne bez tłumaczenia tam, gdzie tak mówi branża.
- Liczby po polsku przez `decimal()`: przecinek i prawdziwy minus.
- Zasady treści konkretnej prezentacji dopisujemy tutaj albo jako decyzje w `docs/decisions.md`.
