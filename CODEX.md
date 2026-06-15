# Codex working brief

## Project shape

This repo contains a single preserved prototype in `src/App.jsx`. Treat it as working source first, then refactor.

## Immediate technical priorities

1. Extract Gemini API calls into `src/lib/geminiClient.js`.
2. Extract PDF and image parsing into `src/lib/documentSource.js`.
3. Extract queue state and worker control into `src/hooks/useTranslationQueue.js`.
4. Extract export HTML generation into `src/lib/compilePrintableDossier.js`.
5. Split interface sections into components:
   - `Header.jsx`
   - `SettingsBar.jsx`
   - `DocumentSourcePanel.jsx`
   - `TranslationViewer.jsx`
   - `PageGrid.jsx`
   - `LexiconPanel.jsx`
   - `ExportModal.jsx`

## Guardrails

- Preserve the art-history glossary behaviour.
- Keep PDF page ordering stable.
- Do not move API keys into committed files.
- Client-side Gemini calls are acceptable for prototype work only.
- Keep the black/yellow visual language unless explicitly asked to restyle.
