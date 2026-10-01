# Granice: potok CI

Sąsiedzi: `git`, `review`, `code_quality`, `security`, `tests`. Sekcje "Zakres i granice" bez zmian, z `docs/standards` w quantasku.

## standard_git.md

Stan dokumentu: 2026-09-29

Ten standard odpowiada za uprawnienia agenta wobec gita, role czterech gałęzi tego repozytorium oraz kierunki, w których zmiana między nimi przechodzi.

Czego tu nie ma:

- Komendy do konkretnych sytuacji wraz z przykładami - cofanie zmian, przenoszenie commitów między gałęziami, odzyskiwanie zgubionej pracy - to `docs/setup/git_commands.md`. Tutaj są reguły, tam czynności.
- Konfiguracja tożsamości autora commitów, kluczy i klienta SSH na Windows - to `docs/setup/git_ssh_windows.md`. Tamten dokument opisuje czynność jednorazową przy zakładaniu środowiska.
- Treść komunikatów commita, w tym konwencja prefiksów. Świadomie nieobjęta żadną regułą tego repozytorium - konsekwencją jest historia niejednorodna i nic jej nie ujednolica.
- Ustawienia ochrony gałęzi po stronie GitLaba. Mieszkają poza repozytorium, więc żaden dokument w drzewie nie może ich wymusić ani zweryfikować.

## standard_review.md

Stan dokumentu: 2026-09-29

Ten standard odpowiada za proces review zmiany i za Definition of Done repozytorium: mechanizm, którym review się wykonuje, kolejność raportu, kryteria tego, co zgłaszać i czego nie, oraz checklistę końcową.

Czego tu nie ma:

- Sam mechanizm łańcucha agentowego prowadzącego do review (seed -> shape -> PRD -> plan -> implementacja -> review) - to jest `standard_agentic_workflow.md`.
- Artefakt `<ZADANIE>_REVIEW.md` - log przebiegu konkretnego zadania (co pominięto, na co agent trafił, jakie decyzje padły przy kodzie). To dokument opisujący historię jednego zadania i traci znaczenie po jego zamknięciu; ten standard opisuje powtarzalny proces oceny, ważny dla każdej zmiany. Zdanie rozstrzygające: `_REVIEW.md` jest dziennikiem zdarzeń, ten standard jest kryterium oceny.
- Definition of Done dla wewnętrznej architektury jednej warstwy nie istnieje jako osobna checklista, bo zbiór nie ma dziś standardu opisującego tę architekturę - patrz `docs/standards/README.md`, sekcja granic i długów. Checklista tego standardu stosuje się zawsze, do każdej zmiany.
- Same reguły, które review sprawdza (jakość kodu, architektura, dokumentacja, formatowanie, bezpieczeństwo i tak dalej) - każda mieszka we właściwym standardzie. Ten dokument mówi, jak i w jakiej kolejności je sprawdzić, nie co dokładnie każda z nich nakazuje.

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

## standard_security.md

Stan dokumentu: 2026-08-12

Ten standard odpowiada za statyczną analizę bezpieczeństwa kodu produkcyjnego, za skan zależności projektu pod kątem znanych, publicznie opisanych podatności (CVE) oraz za obchodzenie się z realnymi danymi osobowymi pracowników na środowiskach lokalnych.

Czego tu nie ma:

- Higiena zależności - rozjazd między zadeklarowanymi a faktycznie używanymi pakietami, bez związku z bezpieczeństwem - to `standard_code_quality.md`.
- Miejsce i format przechowywania sekretów i konfiguracji modułu - to `standard_config.md`. Tutaj tylko wykrywanie sekretów zaszytych bezpośrednio w kodzie.
- Skan sekretów w historii kontroli wersji - temat rozważony i odrzucony przy doprecyzowaniu tego standardu, dziś nieobjęty żadnym standardem repozytorium.
- Właściwy sposób pisania zapytania SQL, schemat bazy jako źródło prawdy, migracje i zakaz triggerów - to `standard_database.md`. Tutaj tylko automatyczne wykrycie odstępstwa od parametryzacji.

## standard_tests.md

Stan dokumentu: 2026-09-29

Ten standard odpowiada za: warstwy testów i ich nazewnictwo, lokalność konfiguracji testów, zakres pokrycia, znaczniki, oraz obowiązkowe testy wynikające z ryzyk specyfikacji.

Czego tu nie ma:

- architektura kodu produkcyjnego, którego te testy dotyczą, w tym granica warstw i kierunek zależności - to `standard_architecture.md`;
- co dokładnie ma robić testowana logika - to `MVP.md`.
