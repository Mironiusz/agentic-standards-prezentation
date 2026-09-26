# Kahoot: bank pytań

Źródło prawdy dla quizu (D-011). Plik `.xlsx` do wgrania powstaje z tego dokumentu:

```bash
npm run kahoot
```

Wynik: `out/kahoot.xlsx`. W Kahoocie: **Create new kahoot**, potem **Blank canvas**, a w edytorze
**Import** i wgranie tego pliku. Dopóki poniżej nie ma żadnego pytania, skrypt kończy się błędem
"nie znalazłem żadnego bloku".

## Format bloku

Parser (`scripts/kahoot-xlsx.mjs`) czyta dokładnie taki układ i przerywa przy każdym odstępstwie.
Blok zaczyna się nagłówkiem `## P` z numerem, a reszta nagłówka jest dowolna:

```
## P<numer>: <slajd>, <hasło>

**Pytanie:** <treść, maks. 120 znaków>

1. <odpowiedź, maks. 75 znaków>
2. <odpowiedź>
3. <odpowiedź>
4. <odpowiedź>

**Poprawna:** <numery po przecinku> · **Czas:** <5|10|20|30|60|90|120|240>

> <komentarz dla prelegenta, nie trafia do Kahoota>
```

Odpowiedzi mogą być od dwóch do czterech. Skrypt po złożeniu pliku wypisuje, ile razy poprawna
odpowiedź stoi na każdym z czterech miejsc, żeby dało się ją rozrzucić równo.

## Pytania
