# Plan treści

Źródło prawdy o tym, co mówimy. Slajdy powstają z tego planu, a zmiany względem niego zapisujemy
jako decyzje w `docs/decisions.md`. `PLAN.md` (plan prelegenta) i `PLAN_SLAJDY.md` (rozpisanie slajd po
slajdzie) to materiał roboczy, z którego powstał ten plan.

## Cel i odbiorcy

Prezentacja pokazuje, jak w quantasku standardy z `docs/standards` prowadzą pracę agenta: gdzie działają
w workflow, jak są zbudowane, gdzie się nakładają i jakich obszarów jeszcze brakuje. Zakładamy, że na
sali siedzą programiści, którzy pracują albo zaczną pracować z agentami; plany nie mówią nic więcej o
tym, kto przyjdzie i co już wie, a z notatek do `lancuch` wynika tylko, że część sali może pracować w
zespołach z innym workflow. Całość trwa około 91 minut (suma z `src/slides/timing.js`), z czego ponad 40
zajmuje ćwiczenie w zespołach po 3-4 osoby. Sala ma wyjść z tezą z bloku 0, że agentowi potrzeba
kontraktów, a nie dłuższego promptu, z wiedzą, jak zbudowany jest standard, i z doświadczeniem rysowania
granic między standardami na jednym obszarze projektu.

## Bloki i slajdy

Jeden nagłówek i jeden akapit na slajd: co widać, co mówimy i co ma zostać w głowie.

Kolejność jest jak w `src/slides/index.js`, a numeracja bloków i slajdów jak w `PLAN_SLAJDY.md`, poza
blokiem 4, gdzie slajdy mają kolejne numery od 4.1 do 4.9 zamiast jednego numeru na standard. Czas bloku
to suma czasów jego slajdów z `src/slides/timing.js`. Liczba kliknięć nie obejmuje intro, które gra samo
po wejściu na slajd.

### Blok 0: Wstęp (3 min)

#### 0.1 Standardy w pipeline agentowym

`tytul`, 0 kliknięć. Sam tytuł, nad nim dopisek
`quantask - docs/standards`, pod nim imię i nazwisko prelegenta. Mówimy jedno zdanie o temacie: agent w
quantasku pracuje według standardów z `docs/standards` i o tym, jak one działają, jest ta prezentacja.

#### 0.2 Co robi agent, kiedy nie wie?

`agent-nie-wie`, 4 kliknięcia. Prawdziwa rozmowa ze script-managera,
z integracji z API Fleethanda: prośba o kolejną porcję testów, test agenta z atrapą odpowiedzi API, w której
stoi pole `fhTabImei`, a miesiąc później zdanie agenta, że `GET /api/vehicle` tego pola w ogóle nie zwraca.
Na końcu dwa czerwone skutki: kontrola zawsze daje False, a testy są zielone, bo atrapa zna ten sam
kontrakt. Mówimy, że agent przepisał założenie z kodu do testu, zamiast odpytać API, a autora samego kodu
produkcyjnego nie da się ustalić. Zostaje obraz agenta, który zamiast sprawdzić, zgaduje kontrakt, i testów,
które to zgadywanie utrwalają.

#### 0.3 Teza

`teza`, 2 kliknięcia. Trzy czerwone etykiety: zgaduje kontrakt, dorabia fallbacki,
halucynuje; potem przekreślony dłuższy prompt i strzałka do słowa kontrakty. Mówimy, że dopisywanie do
promptu się nie skaluje, bo agent i tak nie wie, która reguła jest aktualna i kiedy ją stosować, a
standard mówi mu, gdzie szukać, czego nie zgadywać, jak zapisać wynik i kiedy zapytać. Zostaje teza całej
prezentacji: agentowi potrzeba kontraktów, a nie dłuższego promptu; trzy etykiety wrócą na `slabosci`.

### Blok 1: Workflow w quantasku (4 min 40 s)

#### 1.1 Workflow w quantasku

`lancuch`, 2 kliknięcia. Rząd ośmiu faz z plikami artefaktów pod spodem
(SEED, SHAPE, PRD, PLAN, kod, pamięć, review, archiwum), budowany grupami według skilla, który je
prowadzi: intro pokazuje `plan-shape`, kliknięcia dokładają `plan-prd` i `plan-implement`. Mówimy, że to
konkretny workflow quantaska: SEED to dosłowne zgłoszenie, PRD mówi co i dlaczego bez treści technicznej,
PLAN mówi jak, z faktami popartymi dowodem, a `plan-implement` pisze kod, sam woła review i archiwizuje.
Zostaje, że stan procesu żyje tylko w plikach, przejścia między skillami są ręczne, a przerwanie sesji
nic nie kosztuje.

#### 1.2 Bramki i pętle

`bramki`, 1 kliknięcie. Ten sam łańcuch z bramkami na granicach faz (wywiad
zamknięty, potwierdzenie, plan zamknięty, ready), a po kliknięciu dwie pętle powrotne: obalone założenie
z PLAN do PRD i otwarte `Block: yes` z implementacji do PRD. Mówimy, że bramka to marker w pliku i
miejsce, w którym człowiek może zatrzymać albo zawrócić proces, a PRD jest kontraktem, którego nie wolno
obejść po cichu. Zostaje, że plan nie rośnie w trakcie implementacji: wszystko nieprzewidziane kończy się
pytaniem.

#### 1.3 Skala

`skala`, 0 kliknięć. Pięć liczników, które odliczają w górę: 166 inicjatyw w archiwum, 14
w toku, 211 seedów, 369 wpisów pamięci i 1395 odpowiedzi na pytania agenta, ze stanem na 2026-10-01.
Mówimy, że to nie eksperyment, a ostatnia liczba obejmuje tylko pytania zamknięte z Claude Code, więc
jest dolnym oszacowaniem. Zostaje, że każda taka odpowiedź to miejsce, w którym agent nie zgadywał.

### Blok 2: Rola standardów w pipeline (8 min)

#### 2.1 Rola 1: kontrakt pracy agenta

`rola-proces`, 2 kliknięcia. Przygaszony pipeline z bloku 1, pod
nim pomarańczowy pas z sześcioma standardami pracy agenta (`agentic_workflow`, `agent_docs`, `review`,
`formatting`, `git`, `coolify`), a po drugim kliknięciu przykład: `plan-prd` w kroku 5 odsyła do
`standard_agent_docs.md`, z którego format sekcji Fakty czyta też `test_plan_document_contract.py`.
Mówimy, że te standardy opisują nie kod, tylko sposób pracy agenta, i leżą pod całym łańcuchem. Zostaje,
że skill opisuje kroki, a zasady wyniku zostawia standardowi, więc zmiana reguły to poprawka w jednym
pliku, a nie w siedmiu parach skilli dla Claude Code i Codeksa.

#### 2.2 Rola 2: gdzie szukać zasad

`rola-nawigacja`, 2 kliknięcia. Ścieżka od startu sesji: hook
`SessionStart` (wskazania), `CLAUDE.md` (twarde zakazy) i mapa w `README.md`, a obok siatka 19 szarych
standardów, z których na pomarańczowo zapalają się tylko `config` i `logging`. Mówimy, że hook dopisuje
do kontekstu wskazania, a nie treść plików, rdzeń zawiera tylko zakazy stosowalne bez kontekstu, a mapa
przekłada typ zadania na listę plików do otwarcia. Zostaje, że do kontekstu trafia tylko to, czego
zadanie dotyka, a nie cały zbiór.

#### 2.3 Rola 3: wiedza na właściwym etapie

`rola-fazy`, 2 kliknięcia. Tabela z wierszem na fazę (SEED i
SHAPE, PRD, PLAN, kod, review, pamięć i archiwum): pasek z segmentem na każdy standard, liczba i dwa
hasła o tym, jak standardy wchodzą do pracy; obrys segmentu to standard pracy agenta, wypełnienie to
wiedza o kodzie i danych albo sprawdzanie. Najpierw wchodzą wszystkie fazy poza PRD (przy kodzie i w
review pracuje 19 standardów), a potem PRD z trzema standardami i przekreśloną czarną listą: model
danych, kolumny, migracje, ścieżki, nazwy funkcji, biblioteki, deployment, sekrety. Zostaje, że wiedza
techniczna ma zakaz wejścia do PRD, a sam ten zakaz też stoi w standardzie, więc oddzielenie tego, co
budujemy, od tego, jak, jest wymuszone.

#### 2.4 Rola 4: sprawdzenie przed oddaniem

`rola-bramka`, 2 kliknięcia. Pod pipeline'em z podświetloną
fazą review dwie ramki: 11 standardów, które sprawdza komenda i CI, oraz 8, które sprawdza człowiek;
drugie kliknięcie dokłada przy standardach z komendą nazwy jobów CI (`lint-python`, `lint-docs`,
`typecheck`, `deadcode`, `deps`, `security`, `audit`, `secrets`, `test-unit`, `database`). Mówimy, że
review przechodzi po wszystkich 19 standardach i każdemu daje jeden z trzech stanów (nie dotyczy,
sprawdzono automatycznie, sprawdzono ręcznie), a w quantasku każda niezgodność blokuje review, bo nie ma
kodu zastanego. Zostaje, że review agenta i potok GitLaba przy MR do `dev` i `main` odpalają te same
komendy.

#### 2.5 Rola 5: standardy powstają w praktyce

`rola-petla`, 3 kliknięcia. Od review rozchodzą się trzy
cele: `decision_registry.md` (decyzje na później), `README.md` (znane długi) i `agent_docs/memory`
(wzorce); potem strzałki z podpisem decyzja zapada do paska 19 standardów, a na końcu przykład DEC-3,
który zapala naraz `agent_docs`, `naming`, `documentation` i `tests`. Mówimy, że znalezisko większe niż
jedno zadanie nie ginie w raporcie, tylko trafia do rejestru, a po decyzji do standardu, `MVP.md` albo
kodu. Zostaje, że standardy nie są pisane raz na zawsze, a jedna decyzja (jednostką kodu jest warstwa)
potrafi zmienić cztery pliki.

#### 2.6 Wszędzie jest standard

`wszedzie`, 2 kliknięcia. Przygaszony pipeline i pięć pasków ról nad
fazami, w których działają, a potem obrys każdej fazy. Mówimy, że kontrakt pracy agenta leży pod całym
łańcuchem, wiedza omija PRD, sprawdzenie to review, a standardy powstają z tego, co wyjdzie między review
a archiwum. Zostaje puenta bloku: każda faza ma co najmniej jedną rolę standardów, także PRD, a bez
standardu dostajemy to, co agent akurat zgadnie.

#### 2.7 Słabość i mechanizm

`slabosci`, 3 kliknięcia. Trzy czerwone etykiety z tezy wracają, a każde
kliknięcie dokłada do jednej z nich mechanizm: nawigację z `Block: yes` i czterema sygnałami trafności,
hierarchię rdzenia (punkt 2, brak zgadywania kontraktu, stoi nad punktem 3, zgodnością ze standardem) i
dowód przy każdym fakcie w PLAN (`kod:`, `cmd:`, `db:`, `dok:`, `ZAŁOŻENIE:`). Mówimy, że żaden parametr
procesu nie zwalnia agenta z pytania o nieznany kontrakt, a format dowodu nie gwarantuje prawdy, tylko
podnosi koszt zmyślenia i robi je widocznym przy czytaniu. Zostaje, że każda słabość z tezy ma w
quantasku konkretny mechanizm, który ją łata.

### Blok 3: Anatomia standardu (5 min)

#### 3.1 Anatomia standardu

`szkielet`, 6 kliknięć. Makieta pliku `standard_obszar.md` z sześcioma
pasami sekcji: Stan dokumentu, Po co ten dokument, Zakres i granice, Reguła odstępstwa, Reguły z
uzasadnieniem, Checklista; każde kliknięcie zapala jeden pas i dopisuje obok hasło, po co ta sekcja
agentowi. Mówimy, że prawie każdy z 19 standardów ma ten szkielet, a sekcje odpowiadają kolejno na
pytania: czy dokument jest aktualny, jak zastosować regułę do nieprzewidzianego przypadku, czego tu nie
ma i gdzie to jest, czy niezgodność blokuje review, co się psuje bez reguły i co sprawdzić w review.
Zostaje sześć sekcji, bo ten sam rysunek wraca jako szablon ćwiczenia.

#### 3.2 Przykłady, na jakie pytania odpowiada standard

`tresci`, 6 kliknięć. Sześć kart, każda z
pytaniem, które agent inaczej by zgadywał, małym rysunkiem odpowiedzi i nazwą standardu w rogu: próg
złożoności 10 -> 15 (`code_quality`), komenda spoza listy rozstrzygana pytaniem, czy zmienia historię
gita (`git`), znaki zakazane i ich zamienniki (`formatting`), wartość w `.env`, `.env.local` albo w
kodzie (`config`), commit i push tylko dla człowieka (`git`) oraz cytat, że żaden mechanizm nie sprawdza
reguł z dokumentu (`git`). Przy każdej karcie mówimy, co się psuje bez tej reguły. Zostaje, że standard
to w praktyce zbiór odpowiedzi na pytania, a reguła miękka opisana wprost jako miękka działa, podczas gdy
taka, która udaje twardą, usypia czujność.

#### 3.3 Czego dotyczą standardy

`klastry`, 4 kliknięcia. 19 pomarańczowych kafelków w czterech ramkach,
po jednej grupie na kliknięcie: sposób pracy, kod, budowa aplikacji, dane. Mówimy, co jest w każdej
grupie, i że standardy danych najmocniej opierają się na `MVP.md`. Zostaje układ kafelków, bo ten sam
wraca w grafie odwołań i na mapie obszarów.

### Blok 4: Trzy standardy z bliska (12 min)

Dziewięć slajdów powstaje z trzech fabryk w `src/slides/04-standardy/standard-slides.js` i danych z
`src/slides/04-standardy/data.js`, po trzy na standard: po co (fragment sekcji Po co ten dokument,
kliknięcie zapala kluczowe zdanie), reguły (wiersz na regułę: hasło i co się psuje) i kto pilnuje (te
same reguły z łańcuchem: narzędzie, job w CI, człowiek albo nic).

#### 4.1 `formatting` + `code_quality`: po co

`fmt-po-co`, 1 kliknięcie. Dwie karty z fragmentami sekcji
Po co ten dokument z obu plików; kliknięcie zapala fragmenty o tym, że review widzi formatowanie jako
pierwsze, i o odtwarzaniu wymogów z pamięci. Mówimy, że omawiamy je razem, bo to para graniczna: dwa
standardy dzielą jeden obszar i odsyłają do siebie nawzajem. Zostaje, że formatowanie ma nie kosztować
uwagi recenzenta, a progi jakości mają jedno miejsce, zamiast żyć w pamięci każdego reviewera i agenta.

#### 4.2 `formatting` + `code_quality`: reguły

`fmt-reguly`, 4 kliknięcia. Cztery wiersze z regułą i
tym, co się psuje bez niej: znaki zakazane i homoglify, zakaz pogrubień w prozie (267 pogrubień w plikach
md ze script managera), docstring zamiast komentarza i złożoność C901 = 15 z pomiaru. Mówimy, że model
wstawia znaki czata i homoglify niezauważenie, wzorzec pogrubień rozlał się z nawyku, komentarz rozjeżdża
się z kodem przy refaktorze, a przy progu 10 sypały się fałszywe alarmy. Zostaje, że przy każdej regule
stoi, co konkretnie psuje jej brak.

#### 4.3 `formatting` + `code_quality`: kto pilnuje

`fmt-pilnuje`, 4 kliknięcia. Te same cztery reguły,
a każde kliknięcie dokłada łańcuch tego, kto ich pilnuje: `test_prose_style.py` w jobie `test-unit` przy
znakach i pogrubieniach, sam review przy komentarzach i ruff C901 w jobie `lint-python` przy złożoności.
Mówimy, że trzy z czterech reguł mają automat, a komentarze i skasowaną dokumentację wyłapuje tylko
człowiek. Zostaje rozróżnienie, które wraca w całym bloku: narzędzie, job w CI, człowiek albo nic.

#### 4.4 `git`: po co

`git-po-co`, 1 kliknięcie. Fragment sekcji Po co ten dokument z `standard_git.md`;
kliknięcie zapala zdanie, że granica niewymuszona mechanizmem musi być przynajmniej zapisana. Mówimy, że
reguły pracy z gitem żyły wcześniej w głowach dwóch osób, a agent z dostępem do terminala technicznie
może zrobić na gicie wszystko. Zostaje, że granica, której nikt nie zapisał i nic nie wymusza, nie
istnieje.

#### 4.5 `git`: reguły

`git-reguly`, 3 kliknięcia. Trzy reguły: jedno kryterium, czy operacja dotyka
historii (zakaz: commit, push; na prośbę: add, rebase; reszta wolno), komenda spoza listy rozstrzygana
tym samym kryterium, a nie analogią, oraz zmiana do `main` i `dev` tylko przez MR, jeden MR na jedno
zadanie. Mówimy, co się psuje bez nich: commit z tożsamością człowieka, który go nie napisał, zgadywanie
po podobieństwie nazwy i worek zmian w review, z którego trudno wycofać jedną rzecz. Zostaje, że jedno
kryterium zamiast listy komend pozwala agentowi rozstrzygnąć przypadek, którego lista nie przewidziała.

#### 4.6 `git`: kto pilnuje

`git-pilnuje`, 3 kliknięcia. Te same reguły z łańcuchami: przy dwóch
pierwszych stoi nic (naruszenie widać po fakcie w `git log`), przy trzeciej ochrona gałęzi w GitLabie i
zielony potok MR, ale zasady jednego zadania na MR nie pilnuje nic; z ostatnim kliknięciem dochodzi cytat
z sekcji Czego ten standard nie egzekwuje. Mówimy, że hook blokujący groźne komendy nie obejmuje commit
ani push, a standard sam mówi wprost, że żaden mechanizm nie sprawdza jego reguł. Zostaje, że uczciwie
opisana reguła miękka jest lepsza niż reguła, która udaje twardą.

#### 4.7 `config`: po co

`config-po-co`, 1 kliknięcie. Fragment sekcji Po co ten dokument z
`standard_config.md`; kliknięcie zapala dwa koszty: przeszukanie całego kodu zamiast otwarcia jednego
pliku i błąd, który wychodzi losowo na produkcji, daleko od przyczyny. Mówimy, że rozlana konfiguracja
boli dopiero przy rotacji sekretu albo audycie, kiedy trzeba ustalić, kto co czyta. Zostaje, że błąd
konfiguracji ma się ujawnić przy starcie, a nie losowo.

#### 4.8 `config`: reguły

`config-reguly`, 3 kliknięcia. Trzy reguły: trzy warstwy, a zmienne
środowiskowe czyta tylko `config/config.py`; walidacja przy starcie, wartości wymagane bez domyślnych i
`LOG_LEVEL` domyślnie `INFO`, nigdy `DEBUG`; sekrety za dwiema barierami, a ujawniony sekret jest
spalony. Mówimy, że warstwę wybiera się najpierw po sekretności, potem po zmienności między maszynami,
`DEBUG` razem z danymi osobowymi w logach to ekspozycja danych, a reguła hooka powstała po wycieku dwóch
tokenów przy przeszukiwaniu całego drzewa. Zostaje, że brak wymaganej wartości zatrzymuje start, zamiast
podstawić coś po cichu.

#### 4.9 `config`: kto pilnuje

`config-pilnuje`, 3 kliknięcia. Łańcuchy: `test_env_contract.py` w jobie
`test-unit` przy szablonach i kluczach, review przy odczycie zmiennych poza fasadą, model Pydantic przy
starcie procesu, a przy sekretach hook (tylko Claude Code), blokady w `.claude/settings.json` i gitleaks
w jobie `secrets`. Mówimy, że test pilnuje szablonów i kluczy w plikach środowiska, a odczytu zmiennych
poza fasadą nie pilnuje żaden test, tylko pierwsze pytanie checklisty w review. Zostaje, że bariery na sekrety chronią przed pomyłką, a nie przed
intencją.

### Blok 5: Odpowiedzialność i nakładanie się (13 min)

#### 5.1 Dwie kopie jednej reguły

`duplikat`, 2 kliknięcia. Dwa pliki z tą samą regułą (limit linii: 200)
i agent pośrodku; pierwsze kliknięcie zmienia jedną kopię na 120, drugie pokazuje dwa czerwone skutki:
agent bierze jedną albo skleja obie w fallback. Mówimy, że przykład jest umowny, a człowiek w takiej
sytuacji zapyta albo sprawdzi historię, podczas gdy agent nie ma jak ustalić, która kopia jest aktualna.
Zostaje, że dla agenta duplikat to sprzeczność, która tylko czeka na swój moment.

#### 5.2 Jedna reguła, jeden adres

`jeden-adres`, 1 kliknięcie. `standard_agent_docs.md` z formatem
sekcji Fakty pośrodku, a do niego odesłania z `plan-prd` w `.claude` i `.agents`, z `plan-implement` i z
`test_plan_document_contract.py`; po kliknięciu wariant z kopią nieuniknioną: lista znaków w
`standard_formatting.md` i własna lista w `test_prose_style.py`, połączone testem zgodności. Mówimy, że
każda reguła ma jeden adres, a gdy narzędzie potrzebuje własnej kopii, test sprawdza, że standard nadal
cytuje każdy znak z listy testu. Zostaje, że zamiast kopiować regułę, odsyłamy do jej adresu, a kopii
nieuniknionej pilnuje test.

#### 5.3 Granica to jedno zdanie

`granica`, 1 kliknięcie. Dwie karty z sekcjami Czego tu nie ma z
`standard_errors.md` i `standard_idempotency.md`; kliknięcie zapala zdanie graniczne i przygasza resztę.
Mówimy, że każdy standard ma w Zakresie i granicach listę tego, czego w nim nie ma, z adresem sąsiada, a
błędy mówią, czy ponowić, idempotencja zaś, czy ponowienie jest bezpieczne. Zostaje, że zdanie graniczne
jest adresem, a nie treścią reguły, więc wolno je powtórzyć po obu stronach.

#### 5.4 Mapa i hierarchia

`mapa-hierarchia`, 3 kliknięcia. Fragment tabeli Co otworzyć przed zadaniem z
`docs/standards/README.md`, a obok kolejno: drabina źródeł prawdy (`MVP.md` > standard > `CLAUDE.md`),
drabina sześciu zasad z podświetlonymi punktami 2 i 3 i etykieta, że gdy dwa źródła się kłócą, agent
pyta. Mówimy, że mapa jest jedynym wejściem do zbioru i jako jedyna mówi, który standard jest gotowy, a
który częściowy, a w hierarchii zasad brak zgadywania kontraktu stoi nad zgodnością ze standardem.
Zostaje, że sprzeczność źródeł to pierwszy sygnał trafności, czyli powód do pytania, a nie do cichego
wyboru.

#### 5.5 Kto do kogo odsyła

`graf`, 3 kliknięcia. 19 kafelków w układzie z `klastry`, z `MVP.md`
pośrodku i krawędziami odwołań, których grubość to liczba odwołań; kliknięcia podświetlają kolejno huby
(`MVP.md` i `review`), sąsiadów `database` i pary graniczne. Mówimy, że 11 z 19 standardów cytuje
`MVP.md`, `review` odsyła do wszystkich 18 pozostałych, a `database` najczęściej do `MVP.md`, potem do
`time`, `idempotency` i `architecture`. Zostaje, że krawędź w tym grafie to odesłanie, a nie kopia
treści.

#### 5.6 Gdy to się sypie

`sypie-sie`, 3 kliknięcia. Trzy prawdziwe rozjazdy z quantaska, po jednym na
kliknięcie: status `time` częściowy w `README.md` i gotowy w `standard_time.md`, pogrubienia z umiarem w
`code_quality` kontra zakaz w `formatting` (test egzekwuje wersję z `formatting`) oraz 3 z 6 martwych
odsyłaczy z numerem linii. Mówimy, że agent, który przeczyta sam `standard_time.md`, nie zapyta, tekst
jednego standardu mówi co innego niż automat, a odsyłacz do linii umiera, gdy treść przesunie się w
pliku. Zostaje rada: odsyłaj do sekcji, a nie do linii.

#### 5.7 Granice automatów

`automaty`, 3 kliknięcia. Dwie linie z `.claude/agents/dod-reviewer.md` z
liczbami dziewiętnastu i osiemnastu standardów, potem ta sama para w `.codex/agents/dod-reviewer.toml` z
zielonym `test_agent_docs_parity.py`, a na końcu czerwony `ruff format --check` na gałęzi, którego nikt
nie zgłosił. Mówimy, że liczba standardów stoi w wielu miejscach i jedna kopia została w tyle, a test
parytetu jest zielony, bo obie kopie mają ten sam błąd. Zostaje, że test parytetu sprawdza identyczność,
a nie prawdę, a automat pomaga tylko wtedy, gdy ktoś patrzy na jego wynik.

#### 5.8 Jak pilnować na co dzień

`checklista`, 0 kliknięć. Lista siedmiu haseł, które wchodzą po kolei:
w mapie sprawdź, czy reguła ma już adres, najpierw Czego tu nie ma, lustrzane odesłanie u sąsiada, liczby
i statusy w jednym miejscu, odsyłacz do sekcji, a nie do linii, test zgodności dla kopii nieuniknionej i
spór bez rozstrzygnięcia do `decision_registry.md`. Mówimy, że to wnioski z całego bloku i zarazem
instrukcja do ćwiczenia. Zostaje, że pracę nad standardem zaczyna się od mapy i od sekcji Czego tu nie
ma, a nie od pisania reguł.

#### 5.9 Kahoot

`kahoot`, 0 kliknięć. Plansza przejścia do quizu: Kahoot, pytanie gdzie mieszka ta
reguła, 10 pytań po 20 s i miejsce na PIN gry. Mówimy, że sala dostaje przypadek i wybiera standard, w
którym mieszka reguła, a zła odpowiedź to zawsze sąsiad z granicy; pytania 9 i 10 są podchwytliwe, bo
pytają o czynności, które nie są regułami, i o obszar świadomie bez standardu. Zostaje rozróżnianie
sąsiadów z granicy, o które chodziło w całym bloku; slajd ma w planie czasu 5,5 minuty, bo obejmuje cały
quiz.

### Blok 6: Mapa infra (4 min)

#### 6.1 Mapa obszarów projektu

`mapa-infra`, 5 kliknięć. Intro pokazuje pustą mapę obszarów w pięciu
pasach (cztery grupy z `klastry` i piąty, wdrożenie i utrzymanie), potem 19 standardów wlatuje z pozycji
grafu na swoje kafelki, a kolejne kliknięcia dokładają obszary częściowe z podpisem, gdzie leżą ich
reguły, braki, świadome braki i liczniki: 19 pokrytych, 7 częściowo, 4 brak, 2 świadomie. Mówimy, że
`coolify` przechodzi tu do pasa wdrożenia, bo mapa pyta o obszar projektu, a nie o treść standardu, a
brak to obszar obecny w repozytorium bez standardu, na przykład kontenery albo kontrakt API, a kopie
zapasowe są częściowe, bo standard Coolify tylko zabrania agentowi je kasować. Wydajność stoi w pasie kodu,
bo jej reguły są dziś w `code_quality`, a architektura jednej warstwy w pasie budowy aplikacji. Zostaje
obraz tego, co ma standard, a czego brakuje.

#### 6.2 Kandydaci do ćwiczenia

`kandydaci`, 0 kliknięć. Ta sama mapa przygaszona, a na niej
podświetlone i ponumerowane cztery obszary: `config`, potok CI, kontenery i lokalne środowisko,
wydajność. Mówimy, że każdy kandydat jest w innym stanie: `config` ma gotowy standard, potok CI i
wydajność mają reguły rozproszone po innych standardach, a kontenery nie mają nic, i że każdy da się
opisać w 25 minut. Zostaje numeracja kandydatów, bo ta sama obowiązuje w głosowaniu i na planszy wyników.

### Blok 7: Ćwiczenie (41 min 30 s)

#### 7.1 Wybieramy obszar

`wybor`, 0 kliknięć. Cztery karty kandydatów z numerem, sąsiadami, z którymi
trzeba będzie narysować granice, i jedną informacją, na przykład gotowy standard do porównania przy
`config` albo `compose.*`, `docker/` i `makefile` przy kontenerach. Mówimy o plusach i minusach każdego
obszaru (`config` jest najbezpieczniejszy, ale sala widziała go w bloku 4) i głosujemy ręką. Zostaje, że
wszystkie zespoły biorą ten sam obszar, żeby na koniec porównać, gdzie kto narysował granice.

#### 7.2 Szablon

`szablon`, 1 kliknięcie. Szkielet z `szkielet` jako `standard_twoj_obszar.md`, w którym
Stan dokumentu i Reguła odstępstwa są oznaczone jako gotowe w szablonie; kliknięcie numeruje kolejność
pracy: granice od Czego tu nie ma, po co, reguły z uzasadnieniem, checklista i kto pilnuje. Mówimy, że
granice idą pierwsze, bo bez sąsiadów nie wiadomo, co w ogóle należy do tego standardu. Zostaje, że
standard pisze się od granic, a nie od reguł.

#### 7.3 Praca w zespołach

`zegar`, 0 kliknięć. Napis 25 min i pasek podzielony proporcjonalnie: 5 min
granice, 12 min reguły z uzasadnieniem, 5 min checklista i narzędzie, 3 min zapasu. Mówimy, że zespoły po
3-4 osoby pracują nad tym samym obszarem, a slajd stoi na ekranie przez całą pracę, stąd 25 minut w
planie czasu.

#### 7.4 Gdzie kto narysował granice

`wyniki`, 0 kliknięć. Plansza z wybranym obszarem pośrodku, jego
sąsiadami wokół i znakiem zapytania na każdej krawędzi, przy którym zaznaczamy na żywo granice zespołów;
klawisz 1-4 wybiera planszę kandydata z głosowania. Każdy zespół ma 2-3 minuty na pokazanie swojego
standardu, a przy każdym sąsiedzie sprawdzamy, czy zespoły narysowały granicę w tym samym miejscu.
Zostaje, że rozbieżności między zespołami to problem z bloku 5 zobaczony w praktyce.

#### 7.5 Zamknięcie pętli

`zamkniecie`, 2 kliknięcia. Pipeline z bloku 1 wraca, kafelek nowego standardu
z ćwiczenia wjeżdża na SEED, potem fazy zapalają się po kolei i na końcu pojawia się 19 + 1 standardów.
Mówimy, że to, co napisały zespoły, wchodzi do łańcucha jako SEED i wychodzi jako dwudziesty standard, a
sam standard workflow agentowego też powstał tym łańcuchem, w inicjatywie `moving_infra`. Zostaje rola 5
w praktyce: standardy powstają z pracy, którą opisują.

## Poza slajdami

- Kahoot: bank 10 pytań i 3 zapasowych jest w `docs/kahoot.md` i to on jest źródłem prawdy o quizie
  (D-011). `npm run kahoot` składa z niego `out/kahoot.xlsx` do importu w edytorze Kahoota; pytania
  zapasowe nie trafiają do quizu, a komentarz przy każdym pytaniu podaje plik i linię z regułą.
- Materiały do ćwiczenia w `materialy/cwiczenie/`: ręcznie pisany szablon `standard_twoj_obszar.md` i po
  jednym pliku `granice_<obszar>.md` na kandydata, z sekcjami Zakres i granice jego sąsiadów przepisanymi
  bez zmian ze standardów quantaska. Pliki granic generuje `npm run cwiczenie -- <katalog quantaska>` na
  podstawie `src/components/candidates.js`. Własnej wersji standardu prelegenta na zapas, o której mówi
  `PLAN_SLAJDY.md`, w repozytorium nie ma.
- Plansza wyników: na slajdzie `wyniki` cyfra 1-4 przełącza na planszę kandydata o tym numerze, także z
  widoku prezentera na projektor. Po przeładowaniu strony slajd wraca do wariantu 1, a zrzuty i PDF-y
  pokazują wariant 1 (D-015).
