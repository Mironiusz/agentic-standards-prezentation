/**
 * Treść slajdów bloku 4: trzy standardy z bliska (`PLAN_SLAJDY.md`, blok 4). Fragmenty w `cards` są
 * cytatami z plików w `C:\Quanta\quantask\docs\standards` (stan na 2026-10-01). Reszta to hasła, a nie gotowe zdania.
 *
 * Reguła: `std` (standard), `rule` (hasło), `demo` (opcjonalne etykiety pod hasłem: napis albo `{ label, cls }`), `breaks` (co się psuje),
 * `guard` (kto pilnuje: lista `[rodzaj, podpis]`, rodzaj to `tool`, `ci`, `human`, `none` albo `plain`).
 * Znaki typograficzne w przykładach idą jako encje HTML, żeby nie stały w kodzie dosłownie.
 *
 * `summary` to zapowiedzi trzech slajdów standardu w notatkach slajdu poprzedniego, a `notes` to notatki prelegenta:
 * wstęp i kliknięcie slajdu po co oraz po jednym akapicie na każdą regułę w slajdach reguł i pilnowania.
 */

export const FORMATTING = {
  prefix: 'fmt',
  title: 'formatting + code_quality',
  cards: [
    {
      path: 'docs/standards/standard_formatting.md',
      heading: '## Po co ten dokument',
      body: '<p>Formatowanie jest tym, co <mark>review widzi jako pierwsze</mark>, zanim dojdzie do logiki zmiany...</p>',
    },
    {
      path: 'docs/standards/standard_code_quality.md',
      heading: '## Po co ten dokument',
      body: '<p>Bez jednego miejsca opisującego te wymogi każdy reviewer i każdy agent musiałby je <mark>odtwarzać z pamięci</mark> albo z rozproszonych fragmentów w innych plikach...</p>',
    },
  ],
  rules: [
    {
      std: 'formatting',
      rule: 'znaki zakazane i homoglify',
      demo: ['&mdash;', '&ndash;', '&ldquo; &rdquo;', '&hellip;', '&times;', 'U+0430'],
      breaks: 'zdradzają tekst z czata, homoglifu nie widać na oko',
      guard: [
        ['tool', 'test_prose_style.py'],
        ['ci', 'test-unit'],
      ],
    },
    {
      std: 'formatting',
      rule: 'zakaz pogrubień w prozie',
      breaks: '267 pogrubień w plikach md ze script&nbsp;managera',
      guard: [
        ['tool', 'test_prose_style.py'],
        ['ci', 'test-unit'],
      ],
    },
    {
      std: 'code_quality',
      rule: 'docstring zamiast komentarza',
      breaks: 'komentarz rozjeżdża się z kodem, czat kasuje docstring przy okazji',
      guard: [['human', 'review']],
    },
    {
      std: 'code_quality',
      rule: 'złożoność C901 = 15, z pomiaru',
      breaks: 'przy progu 10 fałszywe alarmy',
      guard: [
        ['tool', 'ruff C901'],
        ['ci', 'lint-python'],
      ],
    },
  ],
  summary: {
    poCo: 'formatting i code_quality: po co są i dlaczego omawiamy je razem',
    rules: 'formatting i code_quality: wybrane reguły i co się psuje bez nich',
    guards: 'formatting i code_quality: kto pilnuje tych reguł',
  },
  notes: {
    poCo: 'Pierwsza para to formatting i code_quality. Omawiamy je razem, bo to para graniczna: dwa standardy, które dzielą się jednym obszarem i odsyłają do siebie nawzajem.',
    poCoClick:
      'Formatting: formatowanie jest pierwszą rzeczą, którą widzi review, więc ma mieć jeden kształt i nie kosztować uwagi recenzenta. Code_quality: bez jednego miejsca na wymogi jakości każdy reviewer i każdy agent odtwarzałby progi z pamięci, i każdy trochę inaczej.',
    rules: [
      'Znaki zakazane to typowe znaki czata, takie jak półpauza czy zakrzywiony cudzysłów, oraz homoglify, czyli znaki nieodróżnialne na oko od zwykłych, na przykład cyrylickie a. Model potrafi wstawić je niezauważenie.',
      'Zakaz pogrubień w prozie powstał z konkretnego rozjazdu: w plikach md przeniesionych ze script managera było 267 pogrubień inline, bo wzorzec z nawyku rozlał się po całym zbiorze.',
      'Komentarz linijkowy rozjeżdża się z kodem przy pierwszym refaktorze, więc dokumentacja logiki idzie do docstringa. Kod z czata dodatkowo sprawdzamy, czy przy okazji nie skasował docstringa albo testu.',
      'Próg złożoności 15 nie jest wzięty z książki, tylko z pomiaru na tym repozytorium. Przy progu 10 sypały się fałszywe alarmy na funkcjach, które naturalnie mają serię warunków.',
    ],
    guards: [
      'Znaków zakazanych pilnuje test test_prose_style.py, który chodzi w jobie test-unit.',
      'Ten sam test pilnuje pogrubień w prozie.',
      'Tu nie ma automatu: komentarze i skasowaną dokumentację wyłapuje tylko review.',
      'Złożoność sprawdza ruff regułą C901 w jobie lint-python.',
    ],
  },
};

export const GIT = {
  prefix: 'git',
  title: 'git',
  cards: [
    {
      path: 'docs/standards/standard_git.md',
      heading: '## Po co ten dokument',
      body: '<p>Agent pracujący w tym repozytorium ma dostęp do terminala i technicznie może na gicie zrobić wszystko...</p><p><mark>Granica, która nie jest wymuszona mechanizmem, musi być przynajmniej zapisana</mark> - inaczej nie istnieje w ogóle.</p>',
    },
  ],
  rules: [
    {
      std: 'git',
      rule: 'kryterium: czy operacja dotyka historii',
      demo: [
        { label: 'zakaz: commit, push', cls: 'is-alert' },
        { label: 'na prośbę: add, rebase', cls: 'is-violet' },
        { label: 'wolno: reszta', cls: '' },
      ],
      breaks: 'commit z tożsamością człowieka, który go nie napisał',
      guard: [
        ['none', 'nic'],
        ['plain', 'git log po fakcie'],
      ],
    },
    {
      std: 'git',
      rule: 'spoza listy: kryterium, nie analogia',
      breaks: 'agent zgaduje po podobieństwie nazwy',
      guard: [['none', 'nic']],
    },
    {
      std: 'git',
      rule: 'do main i dev tylko przez MR, 1 MR = 1 zadanie',
      breaks: 'review dostaje worek zmian',
      guard: [
        ['tool', 'ochrona gałęzi w GitLabie'],
        ['tool', 'zielony potok MR'],
        ['none', '1 MR = 1 zadanie: nic'],
      ],
    },
  ],
  guardsNote: {
    path: 'docs/standards/standard_git.md',
    heading: '## Czego ten standard nie egzekwuje',
    body: '<p>Żaden mechanizm nie sprawdza reguł z tego dokumentu.</p>',
  },
  summary: {
    poCo: 'git: po co jest standard pracy z gitem',
    rules: 'git: wybrane reguły i co się psuje bez nich',
    guards: 'git: kto pilnuje tych reguł, czyli prawie nikt',
  },
  notes: {
    poCo: 'Drugi standard to git. Zanim powstał, reguły pracy z gitem żyły w głowach dwóch osób, a agent ma dostęp do terminala i technicznie może na gicie zrobić wszystko.',
    poCoClick: 'Kluczowe zdanie: granica, której nie wymusza żaden mechanizm, musi być przynajmniej zapisana, bo inaczej po prostu nie istnieje.',
    rules: [
      'Jedno kryterium zamiast listy komend: czy operacja dotyka historii. Commit i push są zakazane bezwarunkowo, nawet na prośbę użytkownika. Add i rebase tylko na wyraźną prośbę. Reszta jest dozwolona bez pytania.',
      'Komenda, której nie ma na liście, rozstrzyga się tym samym kryterium, a nie podobieństwem do najbliższej nazwy. Dla agenta to ważne, bo inaczej zgaduje przez analogię.',
      'Do main i dev zmiana wchodzi tylko przez Merge Request, a jeden MR to jedno zamknięte zadanie. Inaczej review dostaje worek zmian, a wycofanie jednej rzeczy wymaga rozplątywania reszty.',
    ],
    guards: [
      'Kryterium historii nie pilnuje nic. Naruszenie widać dopiero po fakcie w git log. Hook blokujący groźne komendy nie obejmuje commit ani push.',
      'Rozstrzygania po kryterium też nic nie pilnuje.',
      'Drogę przez MR pilnuje ochrona gałęzi w GitLabie i wymóg zielonego potoku. Zasady jednego zadania na MR nie pilnuje nikt, a standard mówi o tym wprost w sekcji o tym, czego nie egzekwuje.',
    ],
  },
};

export const CONFIG = {
  prefix: 'config',
  title: 'config',
  cards: [
    {
      path: 'docs/standards/standard_config.md',
      heading: '## Po co ten dokument',
      body: '<p>...na pytanie "skąd to jest czytane i kto tego jeszcze używa" trzeba wtedy odpowiedzieć <mark>przeszukaniem całego kodu</mark>, zamiast otwarciem jednego pliku.</p><p>...błąd konfiguracji zamiast wywalić się przy starcie, ujawnia się <mark>losowo, na produkcji, daleko od przyczyny</mark>.</p>',
    },
  ],
  rules: [
    {
      std: 'config',
      rule: 'trzy warstwy, env czyta tylko config/config.py',
      demo: ['env', 'config/config.py', 'stałe lokalne'],
      breaks: 'skąd to czytane? grep po całym repo',
      guard: [
        ['tool', 'test_env_contract.py'],
        ['ci', 'test-unit'],
        ['human', 'odczyt poza fasadą: review'],
      ],
    },
    {
      std: 'config',
      rule: 'walidacja przy starcie, wymagane bez domyślnych',
      demo: ['LOG_LEVEL = INFO, nigdy DEBUG'],
      breaks: 'DEBUG + dane osobowe w logach = ekspozycja',
      guard: [
        ['tool', 'model Pydantic'],
        ['plain', 'start procesu'],
      ],
    },
    {
      std: 'config',
      rule: 'sekrety: dwie bariery, ujawniony = spalony',
      breaks: 'dwa tokeny ujawnione grepem po całym drzewie',
      guard: [
        ['tool', 'hook, tylko Claude Code'],
        ['tool', '.claude/settings.json'],
        ['tool', 'gitleaks'],
        ['ci', 'secrets'],
      ],
    },
  ],
  summary: {
    poCo: 'config: po co jest standard konfiguracji i sekretów',
    rules: 'config: wybrane reguły i co się psuje bez nich',
    guards: 'config: kto pilnuje tych reguł',
  },
  notes: {
    poCo: 'Trzeci standard to config. Konfiguracja rozlana po repozytorium boli dopiero przy rotacji sekretu albo audycie, kiedy trzeba ustalić, kto co czyta.',
    poCoClick: 'Dwa koszty: zamiast otworzyć jeden plik, przeszukujemy cały kod, a błąd konfiguracji wychodzi losowo na produkcji, daleko od przyczyny.',
    rules: [
      'Wartość trafia do warstwy według dwóch pytań: najpierw czy jest sekretem, potem czy zmienia się między maszynami. Zmienne środowiskowe czyta wyłącznie fasada config/config.py.',
      'Wartość wymagana jest walidowana przy starcie i nie ma wartości domyślnej, więc jej brak zatrzymuje start. LOG_LEVEL ma domyślnie INFO, nigdy DEBUG, bo DEBUG razem z danymi osobowymi w logach oznacza ekspozycję danych.',
      'Sekrety mają dwie bariery: blokady w ustawieniach Claude Code i hook. Reguła hooka powstała po prawdziwym wycieku dwóch tokenów przy przeszukiwaniu całego drzewa. Sekret ujawniony gdziekolwiek uznajemy za spalony.',
    ],
    guards: [
      'Test test_env_contract.py pilnuje szablonów i kluczy w plikach środowiska. Odczytu zmiennych poza fasadą nie pilnuje żaden test: łapie go tylko review, bo to pierwsze pytanie checklisty standardu.',
      'Walidację robi model Pydantic przy starcie procesu.',
      'Hook działa tylko w Claude Code, blokady są w .claude/settings.json, a sekrety zaszyte w kodzie łapie gitleaks w jobie secrets. Bariery chronią przed pomyłką, a nie przed intencją.',
    ],
  },
};
