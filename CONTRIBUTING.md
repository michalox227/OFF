# Wytyczne wspólnego rozwoju

## Konwencja commitów

```
type(scope): subject

- feat: Nowa funkcjonalność
- fix: Naprawienie błędu
- docs: Zmiany dokumentacji
- style: Formatowanie, brakujące średniki
- refactor: Refaktoryzacja kodu
- test: Testy
- chore: Build, dependencies
```

### Przykład
```
feat(auth): add login endpoint
fix: resolve memory leak in cache
docs: update installation guide
```

## Pull Request

1. Stwórz branch: `git checkout -b feature/nazwa`
2. Commituj zmiany: `git commit -m "type: description"`
3. Wyślij: `git push origin feature/nazwa`
4. Otwórz Pull Request

## Standardy kodu

- Używaj sensownych nazw zmiennych
- Komentuj skomplikowaną logikę
- Testuj zmiany przed wysłaniem PR

## Raportowanie błędów

Użyj GitHub Issues i podaj:
- Wersję
- Kroki do reprodukcji
- Spodziewane zachowanie
- Faktyczne zachowanie
