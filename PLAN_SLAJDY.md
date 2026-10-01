# Plan slajdów - uzupełnienie do PLAN.md

Stan: 2026-10-01. Materiał roboczy: z niego powstał plan treści w `SEED.md`, który jest źródłem prawdy (D-016). Układ bloków jest z `PLAN.md`, tu jest rozpisanie na slajdy.

## Jak czytać

- Wszystko poniżej to materiał: fakty, źródła, pomysły na wizual i kliki. Żadne sformułowanie nie jest gotowym tekstem na slajd ani do notatek.
- Na slajdzie mają stać tylko etykiety: nazwy faz, nazwy plików, liczby, pojedyncze hasła. Wszystko, co jest zdaniem, trafia do notatek prezentera i piszesz to sam.
- Klik to jeden krok animacji, czyli jedno kliknięcie pilota.
- Notatki prezentera (klawisz S) są pełniejsze niż hasła z tego planu i kończą się zapowiedzią następnego slajdu (D-014).
- Źródła to pliki i sekcje w `C:\Quanta\quantask` albo sekcje `STANDARDY.md`, stan na 2026-10-01. Liczby i znaleziska trzeba odświeżyć tuż przed prezentacją.

## Zasady całości

### Trzy rysunki, które wracają

Zamiast nowego rysunku na każdym slajdzie trzy główne wizuale przechodzą przez kilka bloków. Sala uczy się ich raz, a potem tylko patrzy, co się zmienia.

- Diagram pipeline'u: blok 1 (budowa), blok 2 (nakładka standardów), blok 7 (zamknięcie pętli).
- Szkielet standardu: blok 3 (anatomia), blok 7 (szablon ćwiczenia).
- Kafelki standardów: blok 3 (klastry), blok 5 (graf), blok 6 (mapa). Te same pozycje, więc węzły grafu przechodzą płynnie w kafelki mapy.

### Kolory

Propozycja do tabeli w `docs/conventions.md` (D-004: jeden kolor ma jedno znaczenie w całej prezentacji).

| Token        | Znaczenie                                  |
| ------------ | ------------------------------------------ |
| `--c-blue`   | faza pipeline'u i jej artefakt             |
| `--c-orange` | standard                                   |
| `--c-mint`   | automat: narzędzie, test, job w CI, hook   |
| `--c-violet` | człowiek: bramka, decyzja, przegląd ręczny |
| `--c-alert`  | to, co się psuje                           |
| `--c-slate`  | obszar bez standardu                       |
| `--accent`   | to, na co teraz patrzymy (bez zmian)       |

Ryzyko: fioletowy nie był sprawdzany pod kątem daltonizmu razem z trójką niebieski, pomarańczowy, miętowy. Tam, gdzie stoją obok siebie, podpis jest obowiązkowy.

### Mapa etapów i czas

Etapy w `src/slides/stages.js`: workflow, role, anatomia, standardy, granice, mapa, ćwiczenie. Blok 0 bez mapy.

Czas zakłada 90 minut, do potwierdzenia.

| Blok                | Slajdy | Czas   |
| ------------------- | ------ | ------ |
| 0. Wstęp            | 3      | 3 min  |
| 1. Workflow         | 3      | 5 min  |
| 2. Rola standardów  | 6 + 1  | 8 min  |
| 3. Anatomia         | 3      | 5 min  |
| 4. Trzy standardy   | 9      | 12 min |
| 5. Granice + Kahoot | 9      | 12 min |
| 6. Mapa infra       | 2      | 5 min  |
| 7. Ćwiczenie        | 5      | 40 min |

Przy 60 minutach tnę z ćwiczenia (praca zespołów 15 min, prezentacje po 1 min) i z bloku 4 (dwa slajdy na standard zamiast trzech).

## Blok 0 - wstęp

### 0.1 Tytuł

- Wizual: tytuł i podtytuł, nic więcej.

### 0.2 Co robi agent, kiedy nie wie

- Wizual: odtworzenie prawdziwej rozmowy z Claude. Dymki pojawiają się po kolei jak w czacie, a miejsce, w którym agent zgadł kontrakt albo dorobił fallback, dostaje czerwone podświetlenie.
- Kliki: test agenta, podświetlenie zgadniętego pola, wykrycie miesiąc później, skutki.
- Przykład: script-manager, API Fleethanda. 2026-08-04 agent pisze testy kontroli tabletu z atrapą, w której stoi pole `fhTabImei`; 2026-09-02 sam ustala, że `GET /api/vehicle` tego pola nie zwraca.
- Uwaga: tekst agenta jest tu eksponatem, więc zdanie napisane przez AI na tym jednym slajdzie jest celowe.

### 0.3 Teza

- Wizual: trzy czerwone etykiety słabości (zgaduje kontrakt, dorabia fallback, zmyśla). Klik: przekreślony dłuższy prompt. Klik: pomarańczowe słowo kontrakt.
- Te trzy etykiety wracają na slajdzie 2.7.
- Źródło: `STANDARDY.md` 4.6.

## Blok 1 - workflow w quantasku

### 1.1 Łańcuch

- Wizual: rząd faz (`flowRow` z `src/components/flow.js`): SEED, SHAPE, PRD, PLAN, implementacja, review, archiwum. Pod każdą fazą plik artefaktu czcionką mono, np. `_SEED.md`. Nad grupami faz skill, który je prowadzi.
- Kliki: `plan-shape` (SEED, SHAPE), `plan-prd` (PRD, PLAN), `plan-implement` (implementacja, pamięć, review, archiwum).
- Do notatek: przejścia są ręczne, a jedyny automat to `plan-implement` wołający review. Stan żyje w plikach, więc przerwanie sesji nic nie kosztuje.
- Źródło: `STANDARDY.md` 3.1, 3.2.

### 1.2 Bramki i pętle

- Wizual: ten sam diagram. Na granicach faz pojawiają się fioletowe romby bramek: wywiad zamknięty, potwierdzenie PRD, plan zamknięty, werdykt review.
- Klik: pętle powrotne jako łuki wstecz (PLAN do PRD, implementacja do `plan-prd`).
- Na slajdzie: same nazwy markerów z artefaktów.
- Źródło: `STANDARDY.md` 3.1 (kolumna Bramka wyjścia) i 3.2 (pętle).

### 1.3 Skala

- Wizual: liczniki, które odliczają w górę: 166 inicjatyw w archiwum, 14 w toku, 211 seedów, 369 wpisów pamięci, 1395 odpowiedzi na pytania agenta (pytania zamknięte z transkryptów Claude Code od 2026-08-10, bez pytań otwartych).
- Regulator `C:N` najwyżej jako jedno zdanie w notatkach, bez slajdu.
- Źródło: `STANDARDY.md` 4.5 (skala).

## Blok 2 - rola standardów w pipeline

Diagram z bloku 1 przygaszony, pomarańczowe standardy nakładają się na niego rola po roli. Technicznie to jeden slajd z klikami albo kilka slajdów z tym samym tłem, a wizualnie wychodzi to samo.

### 2.1 Rola 1: kontrakt pracy agenta

- Wizual: pod całym łańcuchem pojawia się pomarańczowy pas z sześcioma plikami: `agentic_workflow`, `agent_docs`, `review`, `formatting`, `git`, `coolify`.
- Do notatek: skille są cienkie, bo reguła ma adres w standardzie. Przykład: `plan-prd` w kroku 5 odsyła do standardu zamiast powtarzać format sekcji Fakty.
- Źródło: `STANDARDY.md` 4.1.

### 2.2 Rola 2: gdzie szukać zasad

- Wizual: pionowa ścieżka przy starcie sesji: hook `SessionStart`, potem `CLAUDE.md`, mapa `README.md` i jeden-dwa standardy. Reszta standardów zostaje szara, bo nie wchodzi do kontekstu.
- Hasło: progressive disclosure.
- Źródło: `STANDARDY.md` 4.2.

### 2.3 Rola 3: wiedza na właściwym etapie

- Wizual: tabela z wierszem na fazę (fazy jak w macierzy, pamięć i archiwum razem). Kolumny z nagłówkami: faza, pasek z jednym segmentem na standard i liczbą, dwa hasła o tym, jak standardy wchodzą do pracy. Obrys segmentu to proces, wypełnienie to wiedza o kodzie i danych albo kontrola. Najwięcej standardów (19) pracuje przy kodzie i w review. W wierszu PRD zamiast haseł czarna lista: model danych, kolumny, migracje, ścieżki, nazwy funkcji, biblioteki, deployment, sekrety.
- Kliki: wszystkie fazy poza PRD, potem PRD z czarną listą.
- Do notatek: wiedza techniczna ma zakaz wejścia przed bramką potwierdzenia PRD, ale sam ten zakaz też stoi w standardzie. Tak się godzi z Twoją puentą, że standard jest wszędzie.
- Źródło: `STANDARDY.md` 4.3, macierz w `STANDARDY.html` sekcja 02.

### 2.4 Rola 4: sprawdzenie przed oddaniem

- Wizual: faza review rozkłada się na 19 kafelków. 11 zapala się na miętowo (mają komendę), 8 na fioletowo (przegląd ręczny).
- Klik: od miętowych kafelków nitki do jobów CI: `lint-python`, `typecheck`, `deadcode`, `deps`, `security`, `audit`, `secrets`, `test-unit`, `database`.
- Na slajdzie: 19, 11, 8 i nazwy jobów.
- Źródło: `STANDARDY.md` 4.4.

### 2.5 Rola 5: standardy powstają w praktyce

- Wizual: łuk od review z powrotem do standardów przez dwa pudełka: `decision_registry.md` i sekcję długów w mapie. Drugi łuk prowadzi do `agent_docs/memory`.
- Klik: przykład DEC-3, czyli cztery kafelki zapalają się naraz: `naming`, `tests`, `documentation`, `agent_docs`.
- Źródło: `STANDARDY.md` 4.5.

### 2.6 Puenta: wszędzie jest standard

- Wizual: przygaszony pipeline, a pod nim pięć pasków ról, każdy nad fazami, w których rola działa. Kontrakt pracy agenta leży pod całym łańcuchem, wiedza omija PRD. Nazwy ról jak w tytułach slajdów 2.1-2.5.
- Kliki: paski ról, potem pomarańczowy obrys każdej fazy, także PRD.

### 2.7 Słabość i mechanizm (opcjonalny)

- Wizual: trzy czerwone etykiety z 0.3 wracają, a do każdej dojeżdża to, co ją łata:
  - zgaduje kontrakt: nawigacja, `Block: yes`, cztery sygnały trafności;
  - dorabia fallback: punkt 2 hierarchii rdzenia, który stoi wyżej niż zgodność ze standardem;
  - zmyśla: dowód przy każdym fakcie w PLAN (`kod:`, `cmd:`, `db:`, `dok:`, `ZAŁOŻENIE:`).
- Źródło: `STANDARDY.md` 4.6, 2.

## Blok 3 - anatomia standardu

### 3.1 Szkielet

- Wizual: makieta dokumentu z sześcioma pasami. Każdy klik zapala jeden pas i dorzuca obok jedno hasło, po co to agentowi.

| Sekcja                 | Po co agentowi (materiał)                       |
| ---------------------- | ----------------------------------------------- |
| Stan dokumentu         | data, czyli czy jeszcze aktualne                |
| Po co ten dokument     | przypadki, których tekst reguły nie przewidział |
| Zakres i granice       | czego tu nie ma i adres sąsiada                 |
| Reguła odstępstwa      | czy niezgodność blokuje review                  |
| Reguły z uzasadnieniem | co się psuje bez reguły                         |
| Checklista             | materiał do review                              |

- Źródło: `STANDARDY.md` 5.1. Ten sam rysunek wraca w 7.2 jako szablon.

### 3.2 Przykłady, na jakie pytania odpowiada standard

- Wizual: sześć kart. Na każdej pytanie, które agent inaczej by zgadywał, a pod nim odpowiedź jako mały rysunek. Nazwa standardu to mały, przygaszony podpis w rogu. Wszystkie przykłady są z trzech standardów z bloku 4:
  - Jak określić próg złożoności funkcji? Przekreślone 10, strzałka, 15, podpis "ustalony pomiarem na repozytorium" (`code_quality`).
  - Co, jeśli komendy nie ma na liście? "Zmienia historię gita?": tak, to decyduje człowiek, nie, to agent może (`git`).
  - Jakich znaków nie używać? Prawdziwe znaki obok zamienników: długi myślnik, zakrzywione cudzysłowy, wielokropek (`formatting`).
  - Gdzie trzymać wartość? Sekret do `.env`, wartość zależna od maszyny do `.env.local`, reszta w kodzie (`config`).
  - Czego agentowi nie wolno? Przekreślone commit i push, podpis "tylko człowiek, nawet na prośbę" (`git`).
  - Czego nie sprawdza żadne narzędzie? Cytat z pliku: "Żaden mechanizm nie sprawdza reguł z tego dokumentu." (`git`).
- Kliki: jedna karta na kliknięcie. W notatkach przy każdej karcie: co się psuje bez tej reguły.

### 3.3 Cztery klastry

- Wizual: 19 pomarańczowych kafelków w czterech grupach: sposób pracy, kod, budowa aplikacji, dane. To podział z `STANDARDY.md` 5.2 pod prostszymi nazwami. Grupy rozróżnia położenie i ramka, a nie kolor, bo kolory mają stałe znaczenie.
- Kliki: jeden klaster na klik.
- Źródło: `STANDARDY.md` 5.2.

## Blok 4 - trzy standardy z bliska

Zgodnie z `PLAN.md` bez wizuali: na slajdach stoją fragmenty samych standardów po Twoim przeglądzie. Dla każdego standardu trzy slajdy: problem (sekcja Po co), 2-3 reguły i kto ich pilnuje.

Jedyna propozycja wizualna to wąski pasek u dołu slajdu z regułami. Ma stały format: reguła, narzędzie, job w CI albo słowo nic. Do odrzucenia, jeśli wolisz czysty tekst.

### 4.1 formatting razem z code_quality

Problem:

- `formatting`: formatowanie review widzi jako pierwsze. Znaki typowe dla czata i homoglify zdradzają tekst wygenerowany.
- `code_quality`: bez jednego miejsca każdy odtwarza próg jakości z pamięci.

Reguły do wyboru:

- Znaki zakazane razem z homoglifami (`formatting`, sekcja Znaki zakazane).
  - Co się psuje: homoglifu nie odróżnisz na oko, a model wstawia go niezauważenie.
  - Kto pilnuje: `test_prose_style.py`, job `test-unit`.
- Zakaz pogrubień w prozie (`formatting`, Wyróżnienia w prozie).
  - Co się psuje: "267 pogrubień w plikach md ze script managera". Tyle pogrubień inline było w dokumentach przeniesionych ze `script-manager`. Wzorzec wziął się z nawyku i rozlał po całym zbiorze.
  - Kto pilnuje: `test_prose_style.py`, job `test-unit`.
- Komentarze tylko jako docstring i kontrola kodu z czata (`code_quality`, Komentarze w kodzie).
  - Co się psuje: komentarz rozjeżdża się z kodem przy refaktorze. Czat przy niepowiązanej zmianie kasuje docstring albo test, a diff dalej wygląda spójnie.
  - Kto pilnuje: tylko review.
- Złożoność C901 = 15, ustalona pomiarem (`code_quality`, Złożoność kodu).
  - Co się psuje: przy progu 10 sypią się fałszywe alarmy na naturalnych seriach warunków.
  - Kto pilnuje: ruff, job `lint-python`.

Granica tej pary: `formatting` pilnuje linii, znaków, cudzysłowów i wyróżnień, a `code_quality` komentarzy, docstringów, linterów i złożoności. To jest pomost do bloku 5.

Do przejrzenia przed prezentacją:

- `code_quality`, sekcja Komentarze w kodzie: zdanie o pogrubieniach dopuszcza umiarkowane pogrubienie. `formatting`, Wyróżnienia w prozie, zakazuje go całkowicie. Test egzekwuje wersję z `formatting`, więc tekst mówi co innego niż automat. Można to poprawić albo pokazać na 5.6 jako żywy przykład z pary, którą sala właśnie widziała.
- `code_quality`, Wymagania wydajności kodu: punkty O(1) i O(n) nie mają uzasadnienia. To jedyne miejsce w obu plikach, które łamie zasadę reguły z uzasadnieniem z anatomii.
- `formatting`, Zakres i granice: standard sam przyznaje, że skrócona lista znaków w `CLAUDE.md` różni się od pełnej i że ten rozjazd zostaje nienaprawiony. Materiał na 5.6.

### 4.2 git

Problem: reguły pracy z gitem żyły w głowach dwóch osób, a agent technicznie może zrobić na gicie wszystko. Granica niewymuszona mechanizmem musi być przynajmniej zapisana.

Reguły:

- Jedno kryterium: czy operacja dotyka historii, a nie czy jest lokalna. Z niego wychodzą trzy stopnie:
  - zakaz bezwarunkowy: commit, push;
  - tylko na wyraźną prośbę: add, rebase;
  - reszta wolno.

  Co się psuje: commit podpisany tożsamością człowieka, który go nie napisał, a po pushu cofnięcie przestaje być lokalne. Kto pilnuje: nic, naruszenie widać dopiero po fakcie w `git log`.

- Operację spoza listy rozstrzyga kryterium, a nie podobieństwo do najbliższej nazwy.
  - Co się psuje: agent zgaduje po podobieństwie.
  - Kto pilnuje: nic.
- Do `main` i `dev` zmiana wchodzi tylko przez MR, a jeden MR to jedno zamknięte zadanie.
  - Co się psuje: review dostaje worek zmian, a wycofanie jednej rzeczy wymaga rozplątywania reszty.
  - Kto pilnuje: ochrona gałęzi w GitLabie (poza repo) i potok. Zasady "jedno zadanie na MR" nie pilnuje nic.

Mocny punkt: sekcja Czego ten standard nie egzekwuje mówi wprost, że nic go nie pilnuje. Hook nie obejmuje commit, add ani push i działa tylko w Claude Code. Pasuje do 5.7.

Do przejrzenia: reguły potoku odsyłają do PRD zamkniętych zadań (CIG-1, CFC-1 w `plans_finished/`). To argument za kafelkiem potok CI jako częściowym w bloku 6.

### 4.3 config

Problem: rozlana konfiguracja oznacza, że przy rotacji sekretu przeszukujesz cały kod. Każde miejsce czyta zmienne środowiskowe po swojemu, więc błąd wychodzi losowo na produkcji, daleko od przyczyny.

Reguły:

- Trzy warstwy i przypisanie wartości: najpierw po sekretności, potem po zmienności. Zmienne środowiskowe czyta tylko fasada `config/config.py`.
  - Co się psuje: na pytanie "skąd to jest czytane" odpowiada dopiero grep po całym repo.
  - Kto pilnuje: `test_env_contract.py`, job `test-unit` (szablony i klucze). Odczytu zmiennych poza fasadą nie pilnuje żaden test, tylko pierwsze pytanie checklisty w review.
- Walidacja przy starcie. Wartości wymagane nie mają domyślnych, a `LOG_LEVEL` domyślnie to `INFO`, nigdy `DEBUG`.
  - Co się psuje: `DEBUG` razem z danymi osobowymi w logach to ekspozycja danych.
  - Kto pilnuje: model Pydantic w `config/settings.py`.
- Sekrety: dwie bariery (blokady w `.claude/settings.json` i hook), a sekret ujawniony gdziekolwiek uznaje się za spalony.
  - Co się psuje: reguła hooka powstała po faktycznym ujawnieniu dwóch tokenów podczas grepa po całym drzewie.
  - Kto pilnuje: hook (tylko Claude Code), blokady, gitleaks w jobie `secrets`.

Połączenia z innymi blokami:

- Z blokiem 0: `config` to najczystszy przykład podejścia bez fallbacków. Brak wymaganej wartości zatrzymuje start i nic nie jest podstawiane (sekcja Zawartość pliku konfiguracyjnego).
- Z blokiem 5: pliki `.env` nie mają komentarzy, bo znaczenie zmiennej ma jedno miejsce i jest nim ten standard (sekcja Zawartość plików środowiska).

Do przejrzenia:

- To najdłuższy z trzech plików (166 linii).
- Lista ponad 30 pozycji środowiska to materiał referencyjny, a nie reguły. Jest w niej dużo historii: daty, nazwy inicjatyw, stare nazwy zmiennych. Na slajd się nie nadaje i warto rozważyć, czy w ogóle należy do standardu.
- Stan dokumentu jest z 2026-10-01, więc plik zmienia się właśnie teraz.

## Blok 5 - odpowiedzialność i nakładanie się

### 5.1 Duplikat szkodzi agentowi bardziej niż człowiekowi

- Wizual: dwa pliki z tą samą regułą, jedna kopia zmienia kolor. Agent stoi pośrodku.
- Klik: agent bierze jedną kopię albo skleja obie w fallback (czerwone).
- Do notatek: człowiek zapyta albo sprawdzi historię, a agent nie ma jak ustalić, która kopia jest aktualna.

### 5.2 Jedna reguła, jeden adres

- Wizual: reguła jako kropka w jednym pliku, a do niej strzałki odesłań z innych plików.
- Klik: wariant, gdy kopia jest nieunikniona, bo narzędzie potrzebuje własnej listy. Wtedy zgodności pilnuje test: `test_prose_style.py` sprawdza, że `formatting` nadal cytuje każdy znak z listy testu.
- Do notatek: `plan-prd` krok 5, mały rdzeń `CLAUDE.md`.

### 5.3 Granica to jedno zdanie po obu stronach

- Wizual: dwie karty obok siebie, `errors` i `idempotency`. Podświetlone jest zdanie graniczne: błędy mówią, czy ponowić, a idempotencja, czy ponowienie jest bezpieczne.
- Źródło: sekcje Zakres i granice w obu plikach.

### 5.4 Mapa i hierarchia

- Wizual: fragment tabeli Co otworzyć przed zadaniem z mapy, a obok dwie drabiny z `STANDARDY.html` sekcja 05.
- Do notatek: status widać w mapie, a dwa kłócące się źródła to sygnał nr 1, czyli agent pyta.

### 5.5 Graf

- Wizual: 19 kafelków z bloku 3 łączy się krawędziami.
- Kliki:
  1. huby, czyli `MVP.md` i `review`, który odsyła do 18 pozostałych;
  2. jeden węzeł z krawędziami, np. `database`;
  3. pary graniczne.
- Źródło: `STANDARDY.md` 5.2, 5.3, graf w `STANDARDY.html` sekcja 03. Współrzędne trzeba przepisać na stałe, bo silnik nie mierzy DOM (D-005).

### 5.6 Gdy to się sypie

Wizual: trzy przypadki, każdy na jeden klik. Wybierz trzy z pięciu:

1. Status w dwóch miejscach. Przy czasie mapa mówi "częściowy" (`README.md`, sekcja Czas i strefy czasowe), a plik mówi "gotowy" (`standard_time.md`, linia Status). Skutek: status częściowy każe agentowi pytać, a agent, który przeczyta sam plik, pytać nie będzie.
2. Pogrubienia: `code_quality` kontra `formatting`, opisane w 4.1. To nawiązanie do pary, którą sala właśnie widziała.
3. Odsyłacze z numerem linii: z sześciu trzy były martwe (mapa, sekcja długów). Praktyczna rada: odsyłaj do sekcji, a nie do linii.
4. `README.md` miał naraz siedem nieprawdziwych liczb (mapa, sekcja długów, 2026-09-01).
5. Skrócona lista znaków w `CLAUDE.md` kontra pełna w `formatting`. To znany rozjazd, który zostaje nienaprawiony.

Moja propozycja: 1, 2 i 3.

### 5.7 Granice automatów

- Wizual: dwie linijki z `.claude/agents/dod-reviewer.md`, czyli "dziewiętnastu" w linii 15 i "osiemnastu" w linii 30. Obok ta sama para w `.codex/agents/dod-reviewer.toml` i zielony test parytetu.
- Klik: z mapy, sekcja długów, przypadek bramki formatowania, która stała czerwona na gałęzi, a nikt tego nie zgłosił.
- Do notatek: parytet sprawdza identyczność, a nie prawdę. Kontrola sprawdza formę dowodu, a nie jego prawdziwość (`STANDARDY.md` 4.4).

### 5.8 Jak pilnować na co dzień

- Wizual: krótka lista, która w bloku 7 staje się instrukcją do ćwiczenia:
  1. nowa reguła: najpierw sprawdzasz w mapie, czy ma już adres;
  2. "Czego tu nie ma" piszesz przed regułami;
  3. sąsiad dostaje lustrzane odesłanie;
  4. liczby i statusy trzymasz w jednym miejscu, a wszędzie indziej odsyłacz;
  5. odsyłasz do sekcji, a nie do linii;
  6. kopia nieunikniona: test zgodności;
  7. spór bez rozstrzygnięcia idzie do `decision_registry.md`.

### 5.9 Kahoot: gdzie mieszka ta reguła

Dziesięć pytań i trzy zapasowe. Wśród złych odpowiedzi celowo stoi sąsiad z granicy. Treść pytań do przepisania; po zatwierdzeniu wpiszę je do `docs/kahoot.md` (limity: pytanie 120 znaków, odpowiedź 75).

Źródło każdego pytania to sekcje Czego tu nie ma w mapie i w standardach.

| Nr  | Przypadek                        | Poprawna                     | Pułapki                                 |
| --- | -------------------------------- | ---------------------------- | --------------------------------------- |
| 1   | ponowić wywołanie po timeoucie?  | `errors`                     | `idempotency`, `architecture`, `worker` |
| 2   | czy ponowienie zdubluje efekt?   | `idempotency`                | `errors`, `database`, `worker`          |
| 3   | format zapisu błędu w logu       | `logging`                    | `errors`, `architecture`, `formatting`  |
| 4   | skąd moduł bierze logger         | `architecture`               | `logging`, `config`, `code_quality`     |
| 5   | komentarze i docstringi          | `code_quality`               | `formatting`, `documentation`, `naming` |
| 6   | typ kolumny z czasem             | `time`                       | `database`, `naming`, `MVP.md`          |
| 7   | sekret zaszyty w kodzie          | `security`                   | `config`, `code_quality`, `review`      |
| 8   | znaczenie zmiennej środowiskowej | `config`                     | `.env.example`, `MVP.md`, `README.md`   |
| 9   | komendy do cofania zmian w gicie | `docs/setup/git_commands.md` | `git`, `CLAUDE.md`, `review`            |
| 10  | konwencja komunikatu commita     | żaden, świadomie             | `git`, `formatting`, `naming`           |
| Z1  | nieużywana zależność w pyproject | `code_quality`               | `security`, `config`, `architecture`    |
| Z2  | skan podatności zależności       | `security`                   | `code_quality`, `config`, `review`      |
| Z3  | kształt tabel i kolumn           | `MVP.md`                     | `database`, `naming`, `idempotency`     |

Czas na pytanie: 20 s. Pytania 9 i 10 są celowo podchwytliwe: pierwsze pokazuje, że czynności to nie reguły, a drugie, że świadomy brak też jest odpowiedzią.

## Blok 6 - mapa infra

### 6.1 Mapa obszarów

- Wizual: kafelki obszarów w pięciu pasach. Cztery pierwsze to grupy z 3.3 pod tymi samymi nazwami (sposób pracy, kod, budowa aplikacji, dane), piąty to wdrożenie i utrzymanie. `coolify` przechodzi do piątego pasa, bo mapa pyta o obszar projektu, a nie o treść standardu.
- Kliki:
  1. pusta mapa, wszystkie kafelki jako szare kontury;
  2. 19 węzłów grafu z 5.5 wlatuje w swoje kafelki (pomarańczowe);
  3. kafelki częściowe (pomarańczowy kontur) z drobnym podpisem, gdzie leżą rozproszone reguły;
  4. braki (łupkowe);
  5. świadome braki z podpisem;
  6. liczniki: 19 pokrytych, 7 częściowo, 4 brak, 2 świadomie.
- Klasyfikacja niżej przejrzana i zatwierdzona 2026-10-01. Wydajność stoi w pasie kodu (reguły w `code_quality`), a architektura jednej warstwy w pasie budowy aplikacji.

| Obszar                           | Stan      | Na czym opieram                                                      |
| -------------------------------- | --------- | -------------------------------------------------------------------- |
| 19 obszarów z własnym standardem | pokryte   | mapa `docs/standards/README.md`                                      |
| potok CI                         | częściowo | `git` (MR, świeżość), `review` (mapa do jobów), reszta w PRD CIG-1   |
| zależności i ich aktualizacja    | częściowo | deptry w `code_quality`, pip-audit w `security`, brak polityki       |
| monitoring i alerty              | częściowo | kanał alertu w `config`, reakcja na błąd w `errors`                  |
| wydajność                        | częściowo | sekcja w `code_quality`, bez uzasadnień                              |
| dane osobowe                     | częściowo | `logging` i `MVP.md` (kategoria ryzyka 9), bez własnego adresu       |
| integracje zewnętrzne            | częściowo | `architecture` (wrappery, ponawianie), `docs/INTEGRATIONS.md`        |
| kontenery i lokalne środowisko   | brak      | `compose.*`, `docker/`, `makefile`, tylko instrukcje w `docs/setup`  |
| kontrakt API i wersjonowanie     | brak      | `api/API.md`, `MVP.md` R1; `errors` mapuje tylko błędy               |
| release i wersjonowanie          | brak      | `CHANGELOG.md`, `VERSION_*_STATUS.md`                                |
| kopie zapasowe i odtwarzanie     | częściowo | `coolify` zakazuje agentowi kasowania kopii; runbooki w `docs/setup` |
| runbooki i incydenty             | brak      | `docs/RUNBOOK.md`                                                    |
| wewnętrzna architektura warstwy  | świadomie | mapa: brakuje materiału, nie decyzji                                 |
| treść komunikatów commita        | świadomie | `git`, Zakres i granice                                              |

Opcjonalnie można dodać szare kafelki "nie dotyczy" (frontend, aplikacja mobilna), żeby mapa wyglądała ogólnie, a nie jak lista quantaska.

### 6.2 Kandydaci do ćwiczenia

- Wizual: ta sama mapa, cztery kafelki kandydatów podświetlone akcentem, reszta przygaszona. Od razu przejście do 7.1.

## Blok 7 - ćwiczenie

### 7.1 Wybór obszaru

- Wizual: mapa z 6.2, głosowanie ręką.
- Kandydaci:
  1. config: standard już istnieje, więc wyniki zespołów można porównać z prawdziwym plikiem; sąsiedzi `architecture`, `logging`, `security`, `coolify`. Minus: był omawiany w bloku 4;
  2. potok CI: wszyscy go znają, ma wyraźnych sąsiadów (`git`, `review`, `code_quality`, `security`, `tests`), a jego reguły stoją dziś w PRD zamkniętego zadania;
  3. kontenery i lokalne środowisko: czysty brak, sąsiedzi `config`, `coolify`, `database`;
  4. wydajność: dziś sekcja w `code_quality`, sąsiedzi `code_quality`, `database`, `architecture`.
- Do notatek: ten sam obszar dla wszystkich zespołów (jak w `PLAN.md`) daje bonus na koniec. Zespoły narysują granice w różnych miejscach, a to jest dokładnie problem z bloku 5.

### 7.2 Szablon

- Wizual: szkielet z 3.1 wraca. Na pasach numery kolejności pracy:
  1. Zakres i granice, zaczynając od "Czego tu nie ma";
  2. Po co;
  3. reguły z uzasadnieniem;
  4. checklista;
  5. kto pilnuje.
- Stan dokumentu i Reguła odstępstwa są już wypełnione w szablonie, bo zespoły nie muszą ich wymyślać.

### 7.3 Zegar

- Wizual: pasek czasu z etapami: 5 min granice, 12 min reguły, 5 min checklista i narzędzie, 3 min zapas. Opcjonalnie odliczanie na żywo.

### 7.4 Wyniki

- Wizual: kafelek wybranego braku na środku, a wokół sąsiedzi. Przy każdym sąsiedzie zaznaczasz, który zespół narysował tam granicę. Rozbieżności są puentą.
- Każdy zespół ma 2-3 minuty.

### 7.5 Zamknięcie pętli

- Wizual: diagram pipeline'u z bloku 1 wraca, a nowy SEED wjeżdża na start łańcucha.
- Do notatek: to rola 5. `standard_agentic_workflow.md` też powstał łańcuchem, który opisuje (inicjatywa `moving_infra`).

### Przygotowanie poza slajdami

- Plik szablonu md dla zespołów, z gotowymi sekcjami Stan dokumentu i Reguła odstępstwa.
- Plik z sekcjami Czego tu nie ma wszystkich sąsiadów wybranego braku, bo bez nich zespoły nie mają jak narysować granic.
- Twoja własna wersja standardu na zapas, gdyby sala milczała.

## Otwarte sprawy

1. Czas całości: założyłem 90 minut.
2. Blok 0: który przykład z historii. Mogę przeszukać transkrypty.
3. Blok 4: czy wąski pasek z regułą i tym, kto jej pilnuje, może zostać, czy czysty tekst.
4. Znaleziska z 5.6 i 5.7 oraz z sekcji do przejrzenia w bloku 4: poprawiasz przed prezentacją czy zostawiasz jako żywe przykłady.
5. Klasyfikacja kafelków w 6.1 do Twojej weryfikacji, zwłaszcza obszary częściowe.
6. Ćwiczenie: laptop na zespół i markdown czy kartka; ile zespołów.
7. Kolory: fioletowy nie był sprawdzany pod kątem daltonizmu razem z trójką.
8. Po zatwierdzeniu: przeniesienie do `SEED.md`, `docs/overview.md`, `src/slides/stages.js`, `docs/kahoot.md`, znaczenia kolorów w `docs/conventions.md` i decyzja D-014.
