# GO ON [OFF] SHORE

Interaktywny frontend projektu GO ON [OFF] SHORE z modułem **Ustawienia CRM**.

## Zakres aktualnej wersji

- Górny pasek menu: Biznes Plan, Prezentacja, Road Mapa, Konta & Funkcje, Organizacja & Zespół, Ustawienia.
- Logo w lewym górnym rogu jako osobny element `<span class="brand-off">[OFF]</span>`.
- Moduł Ustawienia jako główne centrum konfiguracji projektu.
- Konfigurator Biznes Planu: tytuł, podtytuł, tekst, tabela z liczbą kolumn, wierszy i rozmiarem komórek.
- Konfigurator Prezentacji: lista slajdów, temat przewodni i pole kodu HTML wizualizacji slajdu.
- Konfigurator Road Mapy: wersje platformy, Q, opis prac, zatrudniane osoby, dział, odpowiedzialność, cel i efekt końcowy.
- Konfigurator Kont & Funkcji: Konto Użytkownika, Konto Firmy, Konto Partnera, funkcje, opis funkcji i Q rozpoczęcia prac.
- Konfigurator Organizacji: działy, role i odpowiedzialności.

## Pliki

```text
index.html
css/styles.css
js/app.js
```

## Działanie

Dane zapisują się lokalnie w przeglądarce przez `localStorage`, więc jest to frontendowy prototyp CRM/Formularza. Backend i baza danych mogą zostać podłączone w kolejnym etapie.
