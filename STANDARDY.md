# Standardy w pipeline agentowym - analiza do prezentacji

Stan: 2026-10-01. Materiał źródłowy do ustalenia treści prezentacji, nie plan slajdów.

Źródło: repozytorium `C:\Quanta\quantask` - `docs/standards/` (19 standardów, mapa i dwa rejestry), `CLAUDE.md`/`AGENTS.md`,
`.claude/` (skille, subagenci, hooki), `.agents/` i `.codex/`, `agent_docs/`, `plans/` i `plans_finished/`, `.gitlab-ci.yml`,
`makefile`, `tests/architecture/`.

Diagramy (pipeline, macierz standard x faza, graf zależności, pętla zwrotna): [`STANDARDY.html`](STANDARDY.html) - otwórz w przeglądarce, działa offline.

## 1. W jednym akapicie

Pipeline agentowy w quantasku to łańcuch seed -> shape -> PRD -> plan -> implementacja -> review -> pamięć -> archiwum,
prowadzony przez cztery skille i zapisywany w plikach, nie w rozmowie. Standardy nie są dokumentacją obok tego łańcucha,
tylko jego kontraktem. Pełnią pięć ról naraz: opisują sam proces (jak wygląda każdy artefakt i każda bramka), prowadzą
agenta do właściwej wiedzy dopiero wtedy, gdy jest potrzebna, dostarczają tę wiedzę w konkretnych fazach, stanowią bramkę
jakości na końcu (review po wszystkich 19 standardach, z komendami odpalanymi naprawdę) i rosną z tego, co łańcuch
znajduje po drodze. Agent dostaje więc nie więcej promptu, tylko kontrakty: gdzie szukać, czego nie zgadywać, jak zapisać
i kiedy przestać.

## 2. Kto jest kim: warstwy i hierarchia źródeł prawdy

| Warstwa               | Gdzie                                                    | Kto pisze           | Rola                                                                                  |
| --------------------- | -------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------- |
| Specyfikacja produktu | `MVP.md`                                                 | człowiek            | nadrzędne nad wszystkim, przy rozbieżności wygrywa                                    |
| Standardy             | `docs/standards/standard_*.md` (19 plików)               | człowiek            | źródło prawdy dla reguł; przy rozbieżności z rdzeniem wygrywa standard                |
| Mapa standardów       | `docs/standards/README.md`                               | człowiek            | punkt wejścia: status, granice, tabela "co otworzyć przed zadaniem", dziennik długów  |
| Rejestry              | `decision_registry.md`, `naming_registry.md`             | człowiek i agent    | decyzje odroczone (patrzą w przyszłość) i nazwy faktycznie użyte (stan faktyczny)     |
| Rdzeń                 | `CLAUDE.md` = `AGENTS.md`                                | człowiek            | tylko twarde zakazy stosowalne bez kontekstu, hierarchia konfliktów, odsyłacze        |
| Zrzut schematu        | `docs/database/`                                         | maszyna             | stan faktyczny serwera, nie źródło prawdy o schemacie                                 |
| Warstwa agentowa      | `agent_docs/` (workflow i `memory/` per warstwa kodu)    | agent               | trwała pamięć decyzji i wzorców, jedyne miejsce w dokumentacji edytowane przez agenta |
| Artefakty zadania     | `plans/<INICJATYWA>/` i `plans_finished/`                | agent z człowiekiem | stan konkretnego zadania: SEED, SHAPE, PRD, PLAN, REVIEW                              |
| Mechanizm             | `.claude/`, `.agents/`, `.codex/`, `tests/architecture/` | człowiek            | skille, subagenci, hooki, test parytetu i kontrole formatu                            |

Hierarchia rozstrzygania konfliktów reguł z rdzenia, w tej kolejności:

1. Poprawność i integralność danych.
2. Brak zgadywania kontraktu - lepiej zapytać niż dorobić fallback.
3. Zgodność z `docs/standards`.
4. Czytelność.
5. Wydajność.
6. DRY i unikanie zbędnej sprytności.

Ważny wybór projektowy: rdzeń, który ładuje się do kontekstu zawsze, jest celowo mały. Uzasadnienia, wyjątki i przypadki
graniczne mieszkają w standardach i są ładowane na żądanie. Punkt 2 stoi wyżej niż punkt 3, więc żaden parametr procesu
(na przykład regulator, patrz niżej) nie może zwolnić agenta z pytania o nieznany kontrakt.

## 3. Pipeline agentowy w skrócie

### 3.1. Fazy, artefakty i bramki

| Faza          | Kto prowadzi                                 | Artefakt                                  | Co w nim jest                                                                      | Bramka wyjścia                                                                 |
| ------------- | -------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Start sesji   | hook `SessionStart` + rdzeń                  | kontekst sesji                            | wskazania: `MVP.md`, mapa standardów, rejestr decyzji, `agent_docs/`               | -                                                                              |
| SEED          | `plan-shape`                                 | `<ZADANIE>_SEED.md`                       | dosłowne zgłoszenie z jawnym źródłem, opcjonalnie regulator `C:N`                  | zapisany przed pierwszym pytaniem, potem niemodyfikowalny                      |
| SHAPE         | `plan-shape`                                 | `<ZADANIE>_SHAPE.md` (11 sekcji)          | wywiad: problem, odbiorca, zakres, scenariusze, podważenie założeń, `Block: yes`   | wszystkie sekcje wypełnione, zero otwartych `Block: yes` -> "wywiad zamknięty" |
| PRD (faza A)  | `plan-prd`                                   | `<ZADANIE>_PRD.md` (9 sekcji)             | co i dlaczego, bez żadnej treści technicznej (czarna lista)                        | potwierdzenie użytkownika - jedyna bramka między "co" a "jak"                  |
| PLAN (faza B) | `plan-prd`                                   | `<ZADANIE>_PLAN.md` (9 sekcji)            | Fakty z dowodem, Decyzje, Zakres zmian z konkretnymi nazwami, promień rażenia, DoD | zero TODO, zero otwartych pytań -> marker "plan zamknięty"                     |
| Implementacja | `plan-implement` (kroki 1-6)                 | kod + `<ZADANIE>_REVIEW.md`               | przegląd kompletności planu, implementacja, stop na wszystko nieprzewidziane       | podsumowanie względem planu                                                    |
| Pamięć        | `plan-implement` (krok 7)                    | `agent_docs/memory/<grupa>/<moduł>.md`    | trwały wzorzec albo decyzja, tylko jeśli coś się kwalifikuje                       | świadoma ocena, nie obowiązek                                                  |
| Review DoD    | `implementation-dod-review` / `dod-reviewer` | raport w 5 sekcjach                       | Blockery, Ryzyka, Usprawnienia, Weryfikacja 19 standardów, Werdykt z zakresem      | `ready`, `ready after minor fixes`, `not ready`                                |
| Archiwum      | `plan-implement` (krok 9)                    | `plans_finished/<INICJATYWA>/`            | cały katalog inicjatywy, bez zmian w treści historii                               | końcowe `ready` dla całej inicjatywy albo jawne zamknięcie lub anulowanie      |
| MR i CI       | człowiek + GitLab                            | commit, Merge Request do `dev` lub `main` | potok `verify` i `test`                                                            | zielony potok, merge; wdrożenie przez scalenie do gałęzi wydania               |

Uwaga do kolejności: tekst standardu (rozdz. 3.1 i checklista) mówi "implementacja -> review -> pamięć", ale kroki skilla
`plan-implement` idą odwrotnie: pamięć to krok 7, review krok 8. W diagramie trzymam się kroków skilla, bo tak to
faktycznie działa.

### 3.2. Zasady przepływu

- Przejścia między skillami są ręczne. Skill kończy, mówi co powstało i co można zawołać dalej, ale nie woła tego sam.
  Każda granica faz to punkt kontrolny, w którym człowiek może zawrócić. Jedyny automat: `plan-implement` sam odpala review.
- Stan procesu żyje wyłącznie w plikach. Przerwanie sesji nic nie kosztuje: skill wołany ponownie wczytuje artefakty i rusza
  od pierwszej niewypełnionej rzeczy.
- Jedno pytanie na raz: zamknięte przez `AskUserQuestion`, otwarte zwykłym tekstem. Po każdej odpowiedzi notatka trafia do
  pliku, a pytanie znika z "Otwartych pytań".
- Pętle powrotne:
  1. PLAN obala założenie z PRD -> powrót do fazy A (PRD jest kontraktem, nie wolno go cicho obejść).
  2. Promień rażenia wychodzi poza zakres PRD -> stop i pytanie o podział planu (PRD może być dobre, tylko za wąskie).
  3. `plan-implement` widzi otwarte `Block: yes` w SHAPE -> powrót do `plan-prd`.
  4. Implementacja trafia na coś, czego plan nie przewidział -> stop, pytanie, wpis w `_REVIEW.md` (plan nie rośnie w trakcie).
- Regulator szczegółowości `C:N` (0-100, domyślnie 40, pięć progów): steruje tym, ile decyzji agent podejmuje sam, a o ile
  pyta - w SHAPE o problem i zakres, w PLAN o decyzje techniczne, w implementacji o braki. Ma dno: dziesięć kategorii ryzyka
  blokującego i zakaz zgadywania kontraktu obowiązują przy 0 tak samo jak przy 100. Każda pozycja rozstrzygnięta bez pytania
  niesie w miejscu frazę "Decyzja agenta przy C:N, bez pytania".
- Trafność jako druga oś: zanim agent zapyta, sprawdza repozytorium. Znaleziona odpowiedź trafia do artefaktu ze źródłem.
  Pytanie pada mimo znalezienia przy jednym z czterech sygnałów: dwa źródła się kłócą, temat ma otwarty wpis w rejestrze
  decyzji albo standard o statusie częściowym, odpowiedź stoi tylko w artefakcie zamkniętego zadania, dokument nie był
  aktualizowany po konkretnym zdarzeniu, które mogło go unieważnić.

### 3.3. Mechanizm obok łańcucha

- Dwa narzędzia, jeden proces: Claude Code (`.claude/skills/`) i Codex (`.agents/skills/`) mają siedem par skilli
  identycznych co do reguł. Pilnuje tego `tests/architecture/test_agent_docs_parity.py`: rdzeń, pary skilli, pary ról,
  z dokładnie trzema dozwolonymi różnicami (nazwa pliku rdzenia, fraza "Claude Code ma stosować" kontra "Codex ma stosować",
  ścieżka do skryptów) i jedną osobną dla par ról (nazwa uruchamiacza komend).
- Hooki: `local_docs_context.py` na starcie sesji dopisuje wskazania (nigdy treść) do kontekstu - w Codeksie węższa wersja.
  `block_dangerous_commands.py` przed każdym `Bash`/`PowerShell` blokuje `git reset --hard`, `git clean`, rekursywne kasowanie
  i podobne, fail-closed. Ten drugi jest tylko w Claude Code.
- Subagenci (tylko Claude Code, w Codeksie odpowiadają im role `.codex/agents/*.toml`): `repo-researcher` zwraca wyłącznie
  ustalenia z plikiem i linią albo jawne "nie znaleziono", bez rekomendacji. `dod-reviewer` ocenia, ale nie ma `Edit` ani
  `Write` i działa w `permissionMode: plan` - review nie może poprawić kodu za autora, wymuszone uprawnieniami, nie prośbą.
- Kolizja nazw: skill o tej samej nazwie w `~/.claude/skills/` przykrywa projektowy. Na tym komputerze to się dzieje
  naprawdę - globalne `plan-implement` i `implementation-dod-review` istnieją obok projektowych.

## 4. Rola standardów w pipeline - sedno

Standardy pojawiają się w każdej fazie, ale za każdym razem w innej roli. Wyróżniam pięć ról. Macierz standard x faza jest
w `STANDARDY.html`, sekcja 2.

### 4.1. Rola 1: kontrakt samego procesu

Sześć standardów opisuje nie kod, tylko pracę agenta:

| Standard                       | Co kontraktuje                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `standard_agentic_workflow.md` | mechanizm łańcucha, bramki, 10 kategorii ryzyka, regulator, archiwizacja, dualizm narzędzi, hooki, subagenci |
| `standard_agent_docs.md`       | format pięciu artefaktów i wpisu memory - jedyne źródło prawdy dla szablonów                                 |
| `standard_review.md`           | proces review, kolejność raportu, mapa standard -> narzędzie, Definition of Done                             |
| `standard_formatting.md`       | proza artefaktów pisanych przez agenta: znaki zakazane, cudzysłowy, zakaz pogrubień inline                   |
| `standard_git.md`              | uprawnienia agenta wobec gita: commit i push tylko człowiek, kryterium "czy dotyka historii"                 |
| `standard_coolify.md`          | uprawnienia agenta wobec środowiska docelowego: dwa tokeny, granica władania, droga wdrożenia przez scalenie |

Konsekwencja: skille są cienkie. `plan-prd` w kroku 5 nie powtarza formatu sekcji Fakty, tylko pisze, że "standard jest jego
jedynym adresem, a kontrola automatyczna czyta go stamtąd". Zmiana reguły to zmiana jednego pliku, a nie siedmiu par skilli.

### 4.2. Rola 2: nawigacja i ładowanie na żądanie

Droga agenta do reguły jest zawsze ta sama:

1. Hook `SessionStart` dopisuje wskazania: `MVP.md`, mapa, rejestr decyzji, `agent_docs/` - bez czytania treści, żeby start
   był tani.
2. Rdzeń (`CLAUDE.md`) daje twarde zakazy i odsyła do mapy.
3. Mapa (`docs/standards/README.md`) mówi, który standard jest gotowy, częściowy albo szkieletem, za co odpowiada i czego w nim
   nie ma, a tabela "Co otworzyć przed zadaniem" przekłada typ zadania na listę dokumentów.
4. Standard w sekcji "Czego tu nie ma" odsyła do sąsiada, zamiast powtarzać jego treść.

Status widać tylko w mapie, a status częściowy sam w sobie jest sygnałem nr 2 - agent ma wtedy pytać, nawet jeśli coś znalazł.
To jest progressive disclosure zrobione dokumentami: w kontekście jest tylko to, czego bieżące zadanie dotyka.

### 4.3. Rola 3: wiedza wstrzykiwana w konkretne fazy

| Faza          | Jak standardy wchodzą do pracy                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEED, SHAPE   | trafność: sprawdź repo przed pytaniem; status częściowy i otwarty DEC wymuszają pytanie; kategorie ryzyka wskazują tematy, które standardy weryfikują (tabela niżej). SHAPE zostaje nietechniczny |
| PRD           | celowo prawie wcale - czarna lista zabrania modeli danych, kolumn, migracji, ścieżek, nazw funkcji, bibliotek, deploymentu i sekretów                                                             |
| PLAN          | najmocniej: mapa typ zadania -> dokument; każde ustalenie w Faktach ma dowód (`kod:`, `cmd:`, `db:`, `dok:` albo jawne `ZAŁOŻENIE:`); promień rażenia obejmuje też kontrole automatyczne          |
| Implementacja | konwencje repo z rdzenia i standardów; hook blokuje groźne komendy; `standard_git` i `standard_coolify` wyznaczają, czego agent nie robi sam                                                      |
| Review        | wszystkie 19 standardów, każdy w jednym z trzech stanów; rejestr decyzji jako filtr szumu                                                                                                         |
| Pamięć        | ścieżka wpisu wynika ze ścieżki kodu, a jednostką jest warstwa (DEC-3); format z `standard_agent_docs.md`                                                                                         |

PRD jako jedyna faza "bez standardów" to ciekawy punkt do prezentacji: oddzielenie "co" od "jak" jest wymuszone właśnie tym,
że wiedza techniczna ze standardów ma zakaz wejścia przed bramką potwierdzenia.

Dziesięć kategorii ryzyka blokującego i miejsca ich weryfikacji (z rozdz. 3.3 workflow i tabeli mapowania):

| Nr  | Kategoria                                 | Weryfikacja                                                                     |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | kontrakt tokenu dostępowego i zakresów    | `MVP.md` R6, par. 9.2 - ustalany z zespołem Panelu, nie odgadywany z kodu       |
| 2   | stabilność kontraktu API                  | `MVP.md` R1 - konsument poza repozytorium                                       |
| 3   | schemat bazy                              | `docs/database` (stan faktyczny) kontra `MVP.md` par. 6 (stan docelowy)         |
| 4   | forma zmiany schematu                     | `standard_database.md`: Alembic, surowy SQL, łańcuch liniowy                    |
| 5   | źródło prawdy dla danych                  | zawsze pytanie do użytkownika - nie da się tego wyczytać z kodu                 |
| 6   | semantyka czasu i przesunięcia strefowego | `standard_time.md` oraz `MVP.md` D14, R8                                        |
| 7   | idempotencja i deduplikacja               | `standard_idempotency.md` oraz `MVP.md` par. 6.6, D21                           |
| 8   | widoczność odczytu i uprawnienia          | `standard_architecture.md` (jedno miejsce) oraz `MVP.md` D19, R9, par. 8.5, 9.3 |
| 9   | dane osobowe pracowników                  | `MVP.md`; dotyczy też logów i raportów                                          |
| 10  | wolumen i koszt zapytania                 | `MVP.md` R4, R9                                                                 |

### 4.4. Rola 4: bramka jakości

Reguła odstępstwa jest zaostrzona: quantask nie ma kodu zastanego, więc każda niezgodność ze standardem blokuje review,
niezależnie od autora i daty. Review raportuje zawsze w kolejności Blockery, Ryzyka, Usprawnienia, Weryfikacja, Werdykt,
a Weryfikacja przechodzi po wszystkich 19 standardach - bo pominięcie standardu wygląda w raporcie identycznie jak jego
świadome wykluczenie, a jawna lista z trzema stanami da się sprawdzić z zewnątrz.

Mapa standard -> narzędzie (z `standard_review.md`) i jej odbicie w potoku GitLaba:

| Standard                       | Komenda w review                                                                              | Job w CI (MR do `dev`/`main`)                  |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `standard_code_quality.md`     | `ruff check`, `mypy`, `vulture`, `deptry`                                                     | `lint-python`, `typecheck`, `deadcode`, `deps` |
| `standard_formatting.md`       | `ruff format --check`, `prettier --check`, `test_prose_style.py`                              | `lint-python`, `lint-docs`, `test-unit`        |
| `standard_logging.md`          | `ruff check` (reguła G)                                                                       | `lint-python`                                  |
| `standard_naming.md`           | `ruff check` (reguła N)                                                                       | `lint-python`                                  |
| `standard_security.md`         | `bandit`, `pip-audit`                                                                         | `security`, `audit`, `secrets` (gitleaks)      |
| `standard_database.md`         | `bandit` (B608)                                                                               | `security`, `database` (migracje + krytyczne)  |
| `standard_config.md`           | `test_env_contract.py`                                                                        | `test-unit`                                    |
| `standard_tests.md`            | `pytest`                                                                                      | `test-unit`, `database`                        |
| `standard_worker.md`           | `test_worker_jobs_consistency.py`                                                             | `test-unit`                                    |
| `standard_agentic_workflow.md` | `test_agent_docs_parity.py`                                                                   | `test-unit`                                    |
| `standard_agent_docs.md`       | `test_plan_document_contract.py`                                                              | `test-unit`                                    |
| pozostałe 8                    | przegląd ręczny: architecture, errors, idempotency, time, documentation, review, git, coolify | -                                              |

Do tego potok ma `freshness` (gałąź musi mieć scalony aktualny `dev`), a `tests/architecture/` niesie 19 testów, które są
standardem zapisanym jako kod (kierunek importów między warstwami, izolacja uprawnień, jedna głowa Alembica, zakaz markerów
konfliktu i inne). Granica, którą standard nazywa wprost: kontrola sprawdza formę dowodu, nigdy jego prawdziwość. Zmyślone
ustalenie w poprawnym formacie przejdzie - format tylko podnosi koszt zmyślenia i czyni je wykrywalnym przy czytaniu.

### 4.5. Rola 5: pętla zwrotna - standardy rosną z pracy

```text
_REVIEW.md (jedno zadanie)
  -> znalezisko przekracza zadanie?
       -> patrzy w przeszłość: README, sekcja "Granice nierozstrzygnięte i długi" (z warunkiem powrotu)
       -> patrzy w przyszłość: decision_registry.md (na co wpływa, warianty, co blokuje, po czym poznamy)
            -> decyzja zapada -> ląduje w standardzie, MVP.md albo kodzie -> wpis przechodzi do rozstrzygniętych
  -> trwały wzorzec dla modułu? -> agent_docs/memory/<grupa>/<moduł>.md (append-only)
```

Przykład z życia: DEC-3 (jednostką kodu jest warstwa) rozstrzygnięta 2026-08-13 rozlała się na cztery standardy naraz:
nazewnictwo warstw w `standard_naming`, podział testów w `standard_tests`, jednostkę dokumentacji w `standard_documentation`
i ścieżki memory w `standard_agent_docs`. Sam `standard_agentic_workflow.md` powstał łańcuchem, który opisuje
(inicjatywa `moving_infra`) - to jest dogfooding mechanizmu.

Skala na 2026-10-01: 14 inicjatyw w toku, 166 w archiwum, 211 seedów, 55 plików pamięci z 369 wpisami,
w rejestrze decyzji 5 otwartych i 41 rozstrzygniętych.

### 4.6. Jaki problem LLM-a rozwiązuje który mechanizm

| Słabość agenta                          | Mechanizm w quantasku                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| zgaduje kontrakt i dorabia fallback     | punkt 2 hierarchii, `Block: yes`, trafność i cztery sygnały, dowód `ZAŁOŻENIE:` nazwany wprost |
| gubi kontekst między sesjami            | stan w plikach `plans/`, wznawianie od pierwszej niewypełnionej rzeczy, `agent_docs/memory`    |
| tonie w zbyt dużym kontekście           | mały rdzeń, hook bez treści, mapa i tabela "co otworzyć", sekcje "czego tu nie ma"             |
| podejmuje decyzje po cichu              | ręczne bramki, fraza "Decyzja agenta przy C:N, bez pytania" w miejscu decyzji                  |
| miesza "co" z "jak"                     | czarna lista PRD i bramka potwierdzenia przed planem                                           |
| ocenia na oko                           | komendy z mapy odpalane naprawdę, wszystkie 19 standardów w trzech stanach                     |
| poprawia własną pracę zamiast ją ocenić | `dod-reviewer` bez `Edit`/`Write`, w trybie plan                                               |
| kopie reguł rozjeżdżają się             | jeden adres reguły, odsyłacze zamiast powtórzeń, test parytetu dla par Claude/Codex            |
| robi coś nieodwracalnego                | commit i push tylko człowiek, hook blokujący groźne komendy, dwa tokeny Coolify                |

## 5. Zależności między standardami

### 5.1. Anatomia standardu

Prawie każdy standard ma ten sam szkielet i każda jego część ma konkretną funkcję dla agenta:

| Sekcja                 | Po co agentowi                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| Stan dokumentu (data)  | punkt odniesienia dla sygnału nr 4 i dla daty, od której obowiązuje kontrola formatu                    |
| Po co ten dokument     | jaki problem reguły rozwiązują - pozwala zastosować regułę do przypadku, którego tekst nie przewidział  |
| Zakres i granice       | "w środku" i "czego tu nie ma" z adresem sąsiada - routing zamiast duplikacji                           |
| Reguła odstępstwa      | czy niezgodny kod blokuje review; tu zaostrzona, plus zawężenie jednostki (moduł, zadanie, plik skilla) |
| Reguły z uzasadnieniem | każda reguła mówi, co się psuje, gdy się jej nie przestrzega                                            |
| Checklista             | materiał do review, sprawdzalny punkt po punkcie                                                        |

Wyjątek: `standard_documentation.md` ma układ numerowany i zamiast checklisty sekcję "Definition of Done dla dokumentacji
modułu".

### 5.2. Klastry

| Klaster                | Standardy                                                        | Kręgosłup                                                     |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| Proces agentowy        | agentic_workflow, agent_docs, review, git, coolify               | workflow <-> agent_docs (mechanizm kontra format)             |
| Forma kodu             | formatting, code_quality, naming, documentation, tests, security | formatting <-> code_quality (znaki i linie kontra komentarze) |
| Architektura i runtime | architecture, config, logging, errors                            | architecture jako źródło loggera, granic i helperów           |
| Dane i domena          | database, idempotency, time, worker                              | database -> time i idempotency, wszystkie mocno na `MVP.md`   |

Huby: `MVP.md` (cytowany przez 11 z 19 standardów i oba rejestry, najmocniej przez rejestr decyzji, `standard_time` i `standard_database`),
mapa (odsyła do każdego standardu i każdy standard odsyła do niej po regułę odstępstwa) oraz `standard_review.md`
(jedyny standard odsyłający do wszystkich pozostałych 18).

### 5.3. Kto do kogo odsyła

Liczba w nawiasie to liczba odwołań w treści pliku. Pominięte: odwołania do mapy, które ma każdy standard.

| Standard         | Odsyła do                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| agentic_workflow | rdzeń (17), MVP (9), agent_docs (7), database (2), review (1), decision_registry (1)                 |
| agent_docs       | agentic_workflow (9), formatting (2), config (1)                                                     |
| review           | agentic_workflow (6), architecture (2), każdy z pozostałych 16 (1)                                   |
| git              | coolify (1)                                                                                          |
| coolify          | git (4), config (3), MVP (2), decision_registry (1)                                                  |
| architecture     | MVP (6), config (2), logging (1), errors (1), database (1)                                           |
| config           | decision_registry (6), MVP (4), logging (2), time, security, database, coolify, architecture (po 1)  |
| logging          | errors (3), worker (2), security (2), architecture (2), config (1), code_quality (1)                 |
| errors           | idempotency (2), MVP (2), logging (1), architecture (1)                                              |
| database         | MVP (12), time (2), idempotency (2), architecture (2), naming (1), errors (1), decision_registry (1) |
| idempotency      | errors (2), database (1), MVP (1)                                                                    |
| time             | MVP (13), database (4), worker, idempotency, errors, architecture, rdzeń (po 1)                      |
| worker           | MVP (6), errors (2), time, logging, idempotency, agentic_workflow (po 1)                             |
| formatting       | rdzeń (4), database (2), code_quality (2)                                                            |
| code_quality     | formatting (3), documentation (3), tests (2), architecture (2), security (1), logging (1)            |
| naming           | naming_registry (2), MVP (2), tests, database, architecture, agent_docs, decision_registry (po 1)    |
| documentation    | formatting (1)                                                                                       |
| security         | config (2), logging (1), database (1), code_quality (1)                                              |
| tests            | MVP (5), review (1), architecture (1)                                                                |

Pary graniczne, czyli wzajemne odesłania typu "to nie tutaj, tylko u mnie", między innymi: errors <-> idempotency (czy ponowić kontra czy
ponowienie zdubluje efekt), errors <-> logging, database <-> time, database <-> idempotency, architecture <-> logging,
architecture <-> config, config <-> logging, config <-> security, coolify <-> git, time <-> worker, formatting <-> code_quality,
agentic_workflow <-> agent_docs, review <-> agentic_workflow. Zasada stojąca za grafem: każda reguła ma jeden adres. Dla
agenta to ważniejsze niż dla człowieka, bo przy dwóch kopiach reguły nie ma jak ustalić, która jest aktualna.

## 6. Co zauważyłem po drodze

Rzeczy w quantasku, nie w tym repozytorium. Nic tam nie zmieniałem.

1. `.claude/agents/dod-reviewer.md` i `.codex/agents/dod-reviewer.toml` mówią w linii 15 o "wszystkich dziewiętnastu
   standardach", a w liście raportu o "wszystkich osiemnastu". Test parytetu jest zielony, bo obie kopie mają ten sam błąd -
   parytet sprawdza identyczność, nie prawdziwość. Świetny przykład na slajd o granicach automatów.
2. Mapa twierdzi, że "poszczególne dokumenty nie noszą oznaczenia, czy są gotowe" i status widać wyłącznie w mapie. Tymczasem
   prawie każdy standard ma linię `Status:`, a w przypadku `standard_time.md` statusy się kłócą: mapa mówi "częściowy",
   plik mówi "gotowy - pełna treść". To nie jest kosmetyka, bo status częściowy uruchamia sygnał nr 2.
3. `standard_review.md` mapuje `standard_architecture.md` na "brak narzędzia - przegląd ręczny", a
   `tests/architecture/test_layer_boundaries.py` pilnuje kierunku importów między warstwami właśnie z tego standardu.
   Mapa zaniża automatyzację (test i tak się odpala w `pytest`, więc ryzyko jest małe).
4. `standard_agentic_workflow.md` rozdz. 6.3 opisuje hook startowy jako wskazujący mapę i dwie pozycje z `agent_docs/`,
   a kod wskazuje dodatkowo `MVP.md` i `decision_registry.md`. Dokument mówi mniej niż kod.
5. Kolejność pamięć/review: standard (rozdz. 3.1, checklista) mówi review przed pamięcią, skill robi pamięć przed review.
6. Kolizja skilli personal/project z rozdz. 6.5 jest aktywna na tym komputerze (`~/.claude/skills/plan-implement`,
   `~/.claude/skills/implementation-dod-review`).

Sprawdziłem i to nie jest błąd: dwa wpisy `DEC-29` w rejestrze decyzji są znanym, zaakceptowanym dubletem (mapa, sekcja
granic i długów, decyzja z 2026-09-29).

## 7. Propozycja osi prezentacji (do decyzji)

Teza: agent nie potrzebuje dłuższego promptu, tylko kontraktów. Standardy są tym kontraktem: mówią, gdzie szukać, czego nie
zgadywać, jak zapisać i kiedy przestać.

| Blok | O czym                                                                                                     | Materiał z tego pliku |
| ---- | ---------------------------------------------------------------------------------------------------------- | --------------------- |
| 1    | Pipeline w pięć minut: fazy, artefakty, stan w plikach, ręczne bramki, regulator                           | 3.1, 3.2              |
| 2    | Co robi model, gdy nie wie: zgaduje kontrakt, dorabia fallback, decyduje po cichu                          | 4.6                   |
| 3    | Anatomia standardu: po co, czego tu nie ma, reguła odstępstwa, uzasadnienie, checklista                    | 5.1                   |
| 4    | Pięć ról standardów w pipeline - rdzeń prezentacji, animacja na jednym diagramie pipeline'u                | 4.1-4.5               |
| 5    | Sieć zależności: jeden adres reguły, mapa jako punkt wejścia, graf                                         | 5.2, 5.3              |
| 6    | Egzekwowanie i jego granice: 11 z 19 ma narzędzie, CI, parytet; forma to nie prawda; przykład 18 kontra 19 | 4.4, 6                |
| 7    | Pętla: standardy rosną z review, rejestry, liczby                                                          | 4.5                   |
| 8    | Jak zacząć u siebie: rdzeń, mapa, trzy pierwsze standardy, review                                          | -                     |

Otwarte sprawy do ustalenia przed `SEED.md`: kto siedzi na sali i co już wie o agentach, ile mamy czasu, jak głęboko wchodzimy
w specyfikę quantaska (nazwy plików, liczby) kontra wersję ogólną, czy pokazujemy prawdziwe artefakty z `plans_finished/` i czy
blok 8 w ogóle jest potrzebny.
