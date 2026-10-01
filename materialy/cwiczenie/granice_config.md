# Granice: config

Sąsiedzi: `architecture`, `logging`, `security`, `coolify`. Sekcje "Zakres i granice" bez zmian, z `docs/standards` w quantasku.

Do porównania po ćwiczeniu: `docs/standards/standard_config.md`.

## standard_architecture.md

Stan dokumentu: 2026-08-10

Ten standard odpowiada za styl architektoniczny ponad pojedynczą jednostką kodu: granicę warstw serwisu, jedno miejsce dla reguł uprawnień i widoczności, helpery wspólne, loggery, cache i spójność bibliotek.

Czego tu nie ma:

- wewnętrzna architektura pojedynczej warstwy, czyli podział odpowiedzialności między pliki w jej katalogu - zbiór nie ma dziś takiego dokumentu, powód i warunek powstania są w `docs/standards/README.md`, sekcja granic i długów;
- format, poziomy i treść wpisu logu - to `standard_logging.md`, tutaj tylko to, skąd logger pochodzi;
- co się dzieje po błędzie - to `standard_errors.md`;
- miejsce i format konfiguracji - to `standard_config.md`, tutaj tylko wymóg jednego miejsca prawdy;
- kto konkretnie ma jakie uprawnienia - to przesądza `MVP.md` par. 8.5 i 9.3, tutaj tylko reguła, gdzie ta wiedza mieszka.

## standard_logging.md

Stan dokumentu: 2026-08-13

Ten standard odpowiada za:

- znaczenie każdego poziomu logowania i sytuację, do której jest zarezerwowany,
- format treści wpisu - sposób budowania komunikatu,
- zawartość wpisu - jakie dane wolno, a jakich nigdy nie wolno w nim umieszczać,
- sposób zapisu złapanego wyjątku, zachowujący informację potrzebną do diagnozy,
- obecność identyfikatora łączącego wpisy jednego przebiegu, gdy dotyczą wielu modułów.

Czego tu nie ma:

- Skąd pochodzi logger i jak skonfigurowany jest centralny mechanizm - handlery, rotacja plików, routing wpisów do plików per grupa modułów, wspólna hierarchia nazw loggerów - to jest `standard_architecture.md`, sekcja Loggery. Zdanie rozstrzygające granicę: architektura mówi, skąd logger pochodzi i dokąd trafia zapisany wpis; logowanie mówi, co i jak w tym wpisie zapisać.
- Decyzja, co się dzieje po błędzie - ponowienie, przerwanie runa, degradacja - to jest `standard_errors.md`. Logowanie mówi jak zapisać, obsługa błędów mówi co zrobić.
- Miejsce przechowywania wartości sterujących logowaniem, takich jak poziom skonfigurowany dla środowiska - to jest `standard_config.md`, w warstwie zmiennych środowiskowych. Ten standard mówi, co znaczy dany poziom i kiedy go użyć, nie gdzie leży jego wartość.
- Generowanie i propagacja identyfikatora przebiegu wewnątrz workera jako mechanizm - to należy do `standard_worker.md`. Tutaj tylko wymóg, że taki identyfikator jest częścią zawartości wpisu.
- Wykrywanie sekretu zaszytego wprost w kodzie źródłowym - to jest `standard_security.md`, statyczna analiza bandit. Ten standard pilnuje innego momentu: żeby sekret będący wartością w czasie działania programu, choćby nigdy nie zapisaną w kodzie jako literał, nie trafił do treści wpisu logu.

## standard_security.md

Stan dokumentu: 2026-08-12

Ten standard odpowiada za statyczną analizę bezpieczeństwa kodu produkcyjnego, za skan zależności projektu pod kątem znanych, publicznie opisanych podatności (CVE) oraz za obchodzenie się z realnymi danymi osobowymi pracowników na środowiskach lokalnych.

Czego tu nie ma:

- Higiena zależności - rozjazd między zadeklarowanymi a faktycznie używanymi pakietami, bez związku z bezpieczeństwem - to `standard_code_quality.md`.
- Miejsce i format przechowywania sekretów i konfiguracji modułu - to `standard_config.md`. Tutaj tylko wykrywanie sekretów zaszytych bezpośrednio w kodzie.
- Skan sekretów w historii kontroli wersji - temat rozważony i odrzucony przy doprecyzowaniu tego standardu, dziś nieobjęty żadnym standardem repozytorium.
- Właściwy sposób pisania zapytania SQL, schemat bazy jako źródło prawdy, migracje i zakaz triggerów - to `standard_database.md`. Tutaj tylko automatyczne wykrycie odstępstwa od parametryzacji.

## standard_coolify.md

Stan dokumentu: 2026-08-27

Ten standard odpowiada za uprawnienia agenta wobec instalacji Coolify, podział dostępu na dwa tokeny o różnej sile, granicę między zasobami quantaska a cudzymi, źródło prawdy o konfiguracji środowiska docelowego oraz drogę, którą zmiana trafia na wdrożenie.

Czego tu nie ma:

- Jak podnieść dostęp, jakim wywołaniem co odczytać, czym różnią się endpointy - to `docs/setup/coolify_access.md`. Tutaj są reguły, tam czynności. Podział jest ten sam co między `standard_git.md` a `docs/setup/git_commands.md` i z tego samego powodu: czynność się zmienia częściej niż reguła, a nieaktualna czynność stojąca obok reguły podważa zaufanie do obu.
- Nazwy zmiennych środowiskowych i znaczenie każdej z nich - to `standard_config.md`, sekcja o trzech warstwach konfiguracji. Tutaj jest wyłącznie reguła mówiąca, gdzie mieszkają ich wartości.
- Role gałęzi, kierunki scalania i Merge Request - to `standard_git.md`. Wdrożenie jest tu opisane jako skutek scalenia, nie jako osobna droga wprowadzania zmian.
- Ustawienia samej instalacji: konta, uprawnienia zespołu, konfiguracja serwera, reguły zapory. Mieszkają poza repozytorium, więc żaden dokument w drzewie nie może ich wymusić ani zweryfikować.
- Stan instalacji w danym dniu: ile stoi aplikacji, jak się nazywają, jakie mają ustawienia. Stan odczytuje się z instalacji, a nie z dokumentu, który zestarzeje się przy pierwszej zmianie po tamtej stronie.
