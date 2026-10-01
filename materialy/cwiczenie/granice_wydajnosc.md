# Granice: wydajność

Sąsiedzi: `code_quality`, `database`, `architecture`. Sekcje "Zakres i granice" bez zmian, z `docs/standards` w quantasku.

## standard_code_quality.md

Stan dokumentu: 2026-08-12

Ten standard odpowiada za jakość kodu produkcyjnego niezwiązaną z jego architekturą: styl komentowania i kontrolę treści generowanej przez czata, automatyczne sprawdzanie stylu i formatowania oraz jego zakres, złożoność funkcji, typowanie statyczne, wykrywanie martwego kodu, spójność deklarowanych i faktycznie używanych zależności oraz wymagania wydajnościowe.

Czego tu nie ma:

- Testy - to `standard_tests.md`. Ten dokument nie reguluje niczego, co dotyczy plików w `tests/`.
- Formatowanie kodu jako samodzielny temat: długość linii, znaki zakazane, cudzysłowy, styl zapisu parametrów - to `standard_formatting.md`.
- Statyczna analiza bezpieczeństwa kodu i skan podatności zależności - to `standard_security.md`.
- Architektura ponad pojedynczą jednostką kodu - to `standard_architecture.md`. Wewnętrzna architektura samej warstwy nie ma dziś standardu; powód i warunek powstania są w `docs/standards/README.md`, sekcja granic i długów.
- Dokumentacja modułu - to `standard_documentation.md`.
- Docstringi jako element jakości kodu należą do tego standardu. Struktura osobnego dokumentu opisującego jednostkę kodu - to `standard_documentation.md`.

## standard_database.md

Stan dokumentu: 2026-08-12

Ten standard odpowiada za: rozdział źródła prawdy o schemacie od zrzutu stanu faktycznego, formę zmian schematu, prywatność bazy, zakaz logiki w bazie, dostęp do danych i pisanie zapytań.

Czego tu nie ma:

- kształt konkretnych tabel, kolumn, indeksów i ograniczeń - przesądza `MVP.md` par. 6 i 10; ten standard nie powtarza ich, żeby nie powstało drugie źródło prawdy;
- wybór typu kolumny czasu i semantyka przesunięcia strefowego - to `standard_time.md`;
- czy powtórzony zapis zdubluje dane - to `standard_idempotency.md`;
- limity czasu zapytań - to `standard_errors.md`.

## standard_architecture.md

Stan dokumentu: 2026-08-10

Ten standard odpowiada za styl architektoniczny ponad pojedynczą jednostką kodu: granicę warstw serwisu, jedno miejsce dla reguł uprawnień i widoczności, helpery wspólne, loggery, cache i spójność bibliotek.

Czego tu nie ma:

- wewnętrzna architektura pojedynczej warstwy, czyli podział odpowiedzialności między pliki w jej katalogu - zbiór nie ma dziś takiego dokumentu, powód i warunek powstania są w `docs/standards/README.md`, sekcja granic i długów;
- format, poziomy i treść wpisu logu - to `standard_logging.md`, tutaj tylko to, skąd logger pochodzi;
- co się dzieje po błędzie - to `standard_errors.md`;
- miejsce i format konfiguracji - to `standard_config.md`, tutaj tylko wymóg jednego miejsca prawdy;
- kto konkretnie ma jakie uprawnienia - to przesądza `MVP.md` par. 8.5 i 9.3, tutaj tylko reguła, gdzie ta wiedza mieszka.
