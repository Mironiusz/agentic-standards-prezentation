# Przygotowanie do pokazu

Lista kontrolna dla prelegenta: próba z zegarem, test na docelowym rzutniku i dzień prezentacji.
Numery slajdów to numery z licznika w prawym górnym rogu (np. "13 / 34").

## Pliki

```bash
npm run build     # dist/index.html: prezentacja, działa offline z dysku
npm run pdf       # po buildzie: trzy zapasowe PDF-y w dist/
```

`NAZWA` to pole `name` z `package.json`.

| Plik                 | Do czego                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `index.html`         | prezentacja (Chrome albo Firefox)                                                               |
| `NAZWA-kroki.pdf`    | zapas do prowadzenia: strona na każde kliknięcie, pilot przewija strony jak kroki, bez animacji |
| `NAZWA-notatki.pdf`  | próba bez komputera: slajd w stanie końcowym, a po nim strona z notatkami i czasem              |
| `NAZWA.pdf`          | do rozesłania po prezentacji: stan końcowy slajdów, klikalne linki                              |

`npm run build` czyści `dist/`, więc PDF-y trzeba wygenerować po każdym buildzie.

## Próba z zegarem

1. Otwórz `dist/index.html?proba`. Adres z `?proba` mierzy czas każdego slajdu.
2. Naciśnij `S`: otworzy się widok prezentera. Na pierwszym slajdzie kliknij zegar "Time", żeby
   wyzerować go na starcie. Kliknięcie na dalszym slajdzie ustawia zegar na planowany początek tego slajdu,
   co przydaje się przy próbie tylko jednego bloku.
3. Mów jak na sali. Widok prezentera pokazuje pod zegarem "Pacing": ile zostało do planowanego końca
   bieżącego slajdu. Kolor: niebieski to zapas, zielony to zgodnie z planem, czerwony to spóźnienie.
   Notatki zaczynają się od linijki "Czas: 2:15 · koniec slajdu: 26:15", czyli planu dla slajdu
   i godziny od startu, o której slajd powinien się skończyć.
4. Po próbie otwórz konsolę przeglądarki (`F12`) w oknie prezentacji i wpisz `__proba()`. Wynik to
   tabela czasów i gotowe wpisy, zaokrąglone do 15 s.
5. Przenieś czasy do `src/slides/timing.js`, jeśli plan rozjechał się z próbą. `npm run snapshots`
   wypisze nową sumę. Potem `npm run build`.
6. Przed kolejną próbą wpisz `__proba.reset()`. Pomiar przetrwa odświeżenie strony, więc bez resetu
   czasy się dodają.

## Test na docelowym rzutniku

Ciemny motyw może być słabo czytelny na słabym rzutniku w jasnej sali (D-004). Sprawdź na miejscu,
w warunkach oświetlenia jak w dniu prezentacji, z ostatniego rzędu:

- przypisy (17 px, najmniejszy tekst) i mały tekst mono, np. podpisy pod pudełkami diagramów;
- slajdy, na których kilka kolorów stoi obok siebie: czy są rozróżnialne;
- przygaszone elementy (po krokach, które coś wyciszają);
- mapa etapów w prawym dolnym rogu i numer slajdu w prawym górnym.

Poza tym:

- Proporcje: slajdy mają 16:9. Na rzutniku 4:3 albo 16:10 pojawią się czarne pasy, ale nic nie
  powinno zostać ucięte. Sprawdź slajdy z rysunkami przy brzegach.
- Pilot: każde kliknięcie to jeden krok. Sprawdź "dalej" i "wstecz" na slajdzie z animacją.
  Krok wstecz ustawia stan od razu, bez animacji, i tak ma być.
- Dwa ekrany: prezentacja na rzutniku w pełnym ekranie (`F`), widok prezentera (`S`) na laptopie.
  Jeśli przeglądarka zablokuje okno prezentera, zezwól na wyskakujące okna dla tego pliku.
- Powiększenie przeglądarki 100% (`Ctrl+0`).

Jeśli czegoś nie widać, zanotuj numer slajdu i element. Poprawka to zmiana tokenów w
`src/styles/theme.css` albo rozmiaru na konkretnym slajdzie.

## Dzień prezentacji

- Na pendrivie: `index.html` i trzy PDF-y, zbudowane z aktualnej wersji.
- Otwórz `index.html` z dysku przy wyłączonym Wi-Fi. Plik nie potrzebuje internetu. Bez sieci
  nie zadziałają tylko linki zewnętrzne na slajdach.
- Otwórz bez `?proba`, chyba że chcesz zmierzyć czas na żywo.
- Awaria przeglądarki: `NAZWA-kroki.pdf` w trybie pełnoekranowym czytnika PDF, pilot przewija strony.
