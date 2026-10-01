# Granice: kontenery i lokalne env

Sąsiedzi: `config`, `coolify`, `database`. Sekcje "Zakres i granice" bez zmian, z `docs/standards` w quantasku.

## standard_config.md

Stan dokumentu: 2026-10-01

Ten standard odpowiada za: podział konfiguracji na warstwy, regułę przypisania wartości do warstwy, walidację wartości pochodzących ze środowiska, miejsce przechowywania sekretów i zawartość pliku konfiguracyjnego.

Czego tu nie ma:

- wykrywanie sekretów zaszytych w kodzie i skan podatności zależności - to `standard_security.md`;
- format, poziomy i treść wpisu logu, mimo że poziom logowania jest wartością konfiguracyjną - to `standard_logging.md`;
- jedno miejsce prawdy dla mechanizmów współdzielonych jako reguła architektoniczna - to `standard_architecture.md`;
- co konkretnie serwis potrzebuje mieć skonfigurowane w warstwach drugiej i trzeciej - to `MVP.md` par. 12. Nazwy i znaczenie zmiennych warstwy pierwszej są natomiast tutaj, w sekcji o warstwach i miejscach przechowywania, bo żaden z trzech szablonów nie zawiera komentarzy i nie może ich nieść.

## standard_coolify.md

Stan dokumentu: 2026-08-27

Ten standard odpowiada za uprawnienia agenta wobec instalacji Coolify, podział dostępu na dwa tokeny o różnej sile, granicę między zasobami quantaska a cudzymi, źródło prawdy o konfiguracji środowiska docelowego oraz drogę, którą zmiana trafia na wdrożenie.

Czego tu nie ma:

- Jak podnieść dostęp, jakim wywołaniem co odczytać, czym różnią się endpointy - to `docs/setup/coolify_access.md`. Tutaj są reguły, tam czynności. Podział jest ten sam co między `standard_git.md` a `docs/setup/git_commands.md` i z tego samego powodu: czynność się zmienia częściej niż reguła, a nieaktualna czynność stojąca obok reguły podważa zaufanie do obu.
- Nazwy zmiennych środowiskowych i znaczenie każdej z nich - to `standard_config.md`, sekcja o trzech warstwach konfiguracji. Tutaj jest wyłącznie reguła mówiąca, gdzie mieszkają ich wartości.
- Role gałęzi, kierunki scalania i Merge Request - to `standard_git.md`. Wdrożenie jest tu opisane jako skutek scalenia, nie jako osobna droga wprowadzania zmian.
- Ustawienia samej instalacji: konta, uprawnienia zespołu, konfiguracja serwera, reguły zapory. Mieszkają poza repozytorium, więc żaden dokument w drzewie nie może ich wymusić ani zweryfikować.
- Stan instalacji w danym dniu: ile stoi aplikacji, jak się nazywają, jakie mają ustawienia. Stan odczytuje się z instalacji, a nie z dokumentu, który zestarzeje się przy pierwszej zmianie po tamtej stronie.

## standard_database.md

Stan dokumentu: 2026-08-12

Ten standard odpowiada za: rozdział źródła prawdy o schemacie od zrzutu stanu faktycznego, formę zmian schematu, prywatność bazy, zakaz logiki w bazie, dostęp do danych i pisanie zapytań.

Czego tu nie ma:

- kształt konkretnych tabel, kolumn, indeksów i ograniczeń - przesądza `MVP.md` par. 6 i 10; ten standard nie powtarza ich, żeby nie powstało drugie źródło prawdy;
- wybór typu kolumny czasu i semantyka przesunięcia strefowego - to `standard_time.md`;
- czy powtórzony zapis zdubluje dane - to `standard_idempotency.md`;
- limity czasu zapytań - to `standard_errors.md`.
