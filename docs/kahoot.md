# Kahoot: bank pytań

Źródło prawdy dla quizu (D-011). Plik `.xlsx` do wgrania powstaje z tego dokumentu:

```bash
npm run kahoot
```

Wynik: `out/kahoot.xlsx`. W Kahoocie: "Create new kahoot", potem "Blank canvas", a w edytorze
"Import" i wgranie tego pliku.

Quiz idzie po slajdzie `kahoot` (blok 5, granice): sala dostaje przypadek i wybiera dokument, w którym
mieszka reguła. Zła odpowiedź to zawsze sąsiad z granicy. Poprawne odpowiedzi sprawdzone 2026-10-01
w `docs/standards` quantaska, a przy każdym pytaniu w komentarzu stoi plik i linia z regułą.

## Format bloku

Parser (`scripts/kahoot-xlsx.mjs`) czyta dokładnie taki układ i przerywa przy każdym odstępstwie.
Blok zaczyna się nagłówkiem `## P` z numerem i kończy na następnym nagłówku `## `, a reszta nagłówka
jest dowolna. Sekcje z innym nagłówkiem, w tym pytania zapasowe na końcu, nie trafiają do quizu:

```
## P<numer>: <slajd>, <hasło>

Pytanie: <treść, maks. 120 znaków>

1. <odpowiedź, maks. 75 znaków>
2. <odpowiedź>
3. <odpowiedź>
4. <odpowiedź>

Poprawna: <numery po przecinku> - Czas: <5|10|20|30|60|90|120|240>

> <komentarz dla prelegenta, nie trafia do Kahoota>
```

Odpowiedzi mogą być od dwóch do czterech. Skrypt po złożeniu pliku wypisuje, ile razy poprawna
odpowiedź stoi na każdym z czterech miejsc, żeby dało się ją rozrzucić równo.

## Pytania

## P1: kahoot, ponowienie po błędzie

Pytanie: Zerwane połączenie z bazą w trakcie zapisu. Który standard mówi, czy ponowić operację?

1. idempotency
2. errors
3. database
4. worker

Poprawna: 2 - Czas: 20

> `standard_errors.md:34`: wolno ponawiać, pod warunkiem że ponowienie jest bezpieczne według idempotency. Sam idempotency (linia 27) mówi "błędy mówią, czy ponowić". Przypadek celowo dotyczy bazy, a nie wywołania systemu zewnętrznego, bo strategię ponawiania takiego wywołania ma `standard_architecture.md`.

## P2: kahoot, zdublowany efekt

Pytanie: Ponawiamy zapis po błędzie. Który standard mówi, czy nie zdublujemy jego efektu?

1. errors
2. database
3. worker
4. idempotency

Poprawna: 4 - Czas: 20

> `standard_idempotency.md:9`: każde powtórzenie ma dać ten sam efekt co pierwsze wykonanie. Wszystkie trzy pułapki odsyłają tu w swoich sekcjach Czego tu nie ma (errors:20, database:21, worker:23).

## P3: kahoot, wyjątek w logu

Pytanie: Złapany wyjątek trafia do logu. Gdzie jest reguła, jak go zapisać?

1. logging
2. errors
3. architecture
4. formatting

Poprawna: 1 - Czas: 20

> `standard_logging.md:65`: wpis w bloku obsługi wyjątku zapisuje pełny traceback. Errors (linia 19) odsyła tu format zapisu błędu w logu.

## P4: kahoot, skąd logger

Pytanie: Nowy moduł potrzebuje loggera. Gdzie jest reguła, skąd go wziąć?

1. logging
2. config
3. architecture
4. code_quality

Poprawna: 3 - Czas: 20

> `standard_architecture.md:65`: logger pochodzi zawsze ze wspólnego mechanizmu, w hierarchii `quantask.*`. Logging (linia 27) odsyła tu wprost. Config kusi, bo `get_logger` fizycznie leży w `config/logging.py`.

## P5: kahoot, komentarze i docstringi

Pytanie: Komentarze linijkowe i docstringi. Który standard je reguluje?

1. formatting
2. code_quality
3. documentation
4. naming

Poprawna: 2 - Czas: 20

> `standard_code_quality.md:22` i `:36`. Formatting (linia 19) odsyła tu wprost. Documentation kusi, bo `CLAUDE.md` quantaska przy komentarzach odsyła do `standard_documentation.md`, ale ten standard nie mówi ani słowa o komentarzach ani docstringach.

## P6: kahoot, kolumna z czasem

Pytanie: Nowa kolumna z czasem w PostgreSQL. Gdzie jest reguła wyboru jej typu?

1. time
2. database
3. naming
4. worker

Poprawna: 1 - Czas: 20

> `standard_time.md:19`: wybór typu kolumny czasu (`timestamptz` kontra `date`). Database (linia 20) odsyła tu wprost. Worker kusi, bo time odsyła do niego harmonogram.

## P7: kahoot, hasło w kodzie

Pytanie: Hasło wpisane wprost w kod. Który standard mówi, co je wyłapie?

1. config
2. code_quality
3. review
4. security

Poprawna: 4 - Czas: 20

> `standard_security.md:32`: bandit wykrywa hardkodowane hasła i klucze. Config (linia 19) odsyła tu wykrywanie sekretów zaszytych w kodzie. Config kusi, bo zakazuje sekretu w repozytorium (linia 117), ale nie mówi, co go wyłapie.

## P8: kahoot, znaczenie zmiennej środowiskowej

Pytanie: Co znaczy dana zmienna środowiskowa? Gdzie to jest opisane?

1. .env.example
2. MVP.md
3. config
4. README.md

Poprawna: 3 - Czas: 20

> `standard_config.md:137`: opis znaczenia zmiennej ma jedno miejsce i jest nim ten standard. Szablon `.env.example` nie może go nieść, bo pliki środowiska nie mają komentarzy (linia 32).

## P9: kahoot, cofanie commita (podchwytliwe)

Pytanie: Jak cofnąć ostatni commit? Gdzie są do tego komendy?

1. git
2. docs/setup/git_commands.md
3. CLAUDE.md
4. review

Poprawna: 2 - Czas: 20

> Czynności to nie reguły. `standard_git.md:19` odsyła komendy do `docs/setup/git_commands.md` (sekcja "Przenoszenie i cofanie zmian"), bo czynność zmienia się częściej niż reguła.

## P10: kahoot, komunikat commita (podchwytliwe)

Pytanie: Konwencja komunikatu commita. Który standard ją ustala?

1. git
2. formatting
3. naming
4. żaden, świadomie

Poprawna: 4 - Czas: 20

> Świadomy brak też jest odpowiedzią. `standard_git.md:21` mówi tylko, że treść komunikatów commita jest świadomie nieobjęta żadną regułą. Git to stwierdza, ale niczego nie ustala.

## Zapasowe

Nie trafiają do quizu. Żeby podmienić pytanie, zmień nagłówek `###` na `## P<numer>`.

### Z1: kahoot, nieużywana zależność

Pytanie: Pakiet w pyproject.toml, którego nikt nie importuje. Który standard to łapie?

1. security
2. code_quality
3. config
4. architecture

Poprawna: 2 - Czas: 20

> `standard_code_quality.md:64`: zależności zadeklarowane odpowiadają importowanym, pilnuje deptry. Security (linia 17) odsyła tu higienę zależności.

### Z2: kahoot, podatna zależność

Pytanie: Znana podatność w zależności. Który standard każe ją wykryć?

1. code_quality
2. config
3. security
4. review

Poprawna: 3 - Czas: 20

> `standard_security.md:36`: zależności skanuje pip-audit pod kątem znanych CVE. Code_quality (linia 19) odsyła tu wprost.

### Z3: kahoot, kształt tabeli

Pytanie: Jakie kolumny ma mieć tabela w stanie docelowym? Gdzie to jest?

1. MVP.md
2. database
3. naming
4. idempotency

Poprawna: 1 - Czas: 20

> `standard_database.md:19`: kształt tabel i kolumn przesądza `MVP.md` par. 6, standard ich nie powtarza. Pełny DDL leży w `docs/project-docs/4_data-model.md`.
