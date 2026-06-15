# AGENTS.md

Project: Hermeneia (fka Slovo Decode)

Purpose:
Academic translation platform for art history,
museology, archives and design research.

## Pipeline

```
archive  →  OCR  →  translation  →  terminology  →  annotation  →  publication
   │          │          │               │              │              │
   ▼          ▼          ▼               ▼              ▼              ▼
 PDF.js    OpenAI    DeepSeek        glossary       researcher    plaintext
 upload    GPT-4o    Chat            locks +        annotations   + print
 + text    vision                    vocabulary     + citations   HTML
 extract                             (lexicon)                    dossier
```

### Stage mapping

| Stage | Code | Technology |
|---|---|---|
| archive | `useDocumentSource.js`, `documentParser.js` | PDF.js CDN, canvas rendering, text extraction |
| OCR | `openaiClient.js` → `openaiOcr()` | GPT-4o vision (high-detail image analysis) |
| translation | `translatorRouter.js` → `deepseekClient.js` | DeepSeek Chat (context-aware, glossary-locked) |
| terminology | `promptBuilder.js`, `GlossaryPanel.jsx`, `WorkspaceTabs.jsx` (Lexicon tab) | Glossary enforcement, vocabulary index |
| annotation | `useAnnotations.js`, `WorkspaceTabs.jsx` (Annotations + Citations tabs) | Researcher notes, confidence scores, auto-detected citations |
| publication | `exportService.js`, `ExportModal.jsx` | Plaintext report + print-ready HTML dossier |

## Rules

- Never simplify translation quality.
- Preserve publication metadata.
- Preserve page numbering.
- Preserve glossary locks.
- Use British English.
- Do not remove OCR fallback.
- Do not censor.
- Do not change export formatting without approval.

## Architecture

All translation calls route through `src/services/translatorRouter.js`:

```
App.jsx
  └─ translatePage() / translateText()
       └─ translatorRouter (task dispatch)
            ├─ ocr       → OpenAI GPT-4o
            ├─ translate → DeepSeek Chat
            └─ polish    → OpenAI GPT-4o-mini
```

## Project structure

```
src/
├── App.jsx                 orchestrator (state + wiring)
├── components/             UI layer (pure presentational)
│   ├── Header.jsx
│   ├── SettingsBar.jsx
│   ├── DocumentSourcePanel.jsx
│   ├── TranslationViewer.jsx
│   ├── PageGrid.jsx
│   ├── WorkspaceTabs.jsx
│   ├── GlossaryPanel.jsx
│   ├── HistorySidebar.jsx
│   └── ExportModal.jsx
├── hooks/                  stateful logic
│   ├── useDocumentSource.js
│   └── useAnnotations.js
├── services/               API clients + business logic
│   ├── translatorRouter.js (entry point)
│   ├── openaiClient.js
│   ├── deepseekClient.js
│   ├── promptBuilder.js
│   ├── documentParser.js
│   └── exportService.js
└── utils/
    ├── constants.js
    └── helpers.js
```

## Environment

```
VITE_OPENAI_API_KEY=sk-...
VITE_DEEPSEEK_API_KEY=sk-...
VITE_APP_ID=hermeneia-local
```

## Key constraints

- PDF.js loaded from CDN at runtime (no offline build dependency).
- API calls happen client-side — prototype only, not production key security.
- PDF/images limited to 10 MB.
- Black-and-yellow visual language; `rounded-none` throughout.
