# Hermeneia

Russian–English translation and annotation environment for art, design, museum and archive research. Built as a React/Vite single-page application.

## What is inside

- React single-page app built with Vite.
- Tailwind CSS styling.
- `lucide-react` icon set.
- Runtime PDF parsing through PDF.js CDN.
- Gemini API calls configured through environment variables.
- Document queue mode, manual text mode, glossary locks, translation history, page-grid status, and printable dossier export.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Add your Gemini key in `.env`:

```bash
VITE_GEMINI_API_KEY=your_key_here
```

Then open the local Vite URL printed in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Notes for Codex

Start with `src/App.jsx`. The pasted prototype has been preserved as one component so Codex can refactor safely in smaller passes.

Suggested first refactors:

1. Split PDF/file handling into `src/hooks/useDocumentQueue.js`.
2. Move Gemini request logic to `src/lib/geminiClient.js`.
3. Move export generation to `src/lib/exportHtml.js`.
4. Extract UI blocks into `src/components/`.
5. Add tests around glossary locking and page queue state.

## Known constraints

- PDF.js is loaded from CDN at runtime.
- Gemini calls happen client-side, so this is suitable for prototyping, not production key security.
- The app currently expects files below 10 MB.
