# CLAUDE.md

Prezentacja w reveal.js + GSAP o standardach agentowych w quantasku. Treść po polsku. Silnik pochodzi
z wcześniejszej prezentacji (D-013), treść jest w wersji docelowej (D-016).

Przed pracą przeczytaj:

- `docs/overview.md`: krótki opis całej prezentacji
- `SEED.md`: plan treści slajdów (zmiany względem niego są w decyzjach)
- `docs/roadmap.md`: która faza jest następna i co jest otwarte
- `docs/conventions.md`: API modułu slajdu, zasady animacji, znaczenie kolorów
- `docs/decisions.md`: podjęte decyzje; nowe dopisuj na końcu jako kolejne D-NNN

Weryfikacja zmian: `npm run lint`, potem `npm run build && npm run snapshots [-- id-slajdu]` i obejrzyj zrzuty
z `snapshots/`. Zrzut pokazuje stan końcowy kroku, a nie ruch. Stany pośrednie animacji sprawdzaj
osobnym skryptem Playwright, który klika i robi zrzut w trakcie. PDF-y: `npm run pdf` po buildzie.
Na nowym komputerze Playwright potrzebuje przeglądarki: `npx playwright install chromium`.

Po zakończeniu fazy zaktualizuj status w `docs/roadmap.md`.
