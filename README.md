# Slovo

**Russian–English Scholarly Translation Studio**  
by [dotai](https://dotai.org)

---

An instrument for translating, annotating, and exporting Russian archival, art-historical, museological, and academic texts into publication-ready English. Slovo is not a chatbot. It is a translation desk — built for the researcher working with Soviet-era catalogues, museum documentation, manuscript notes, archive scans, and scholarly apparatus.

## The Pipeline

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
| **archive** | `useDocumentSource.js`, `documentParser.js` | PDF.js CDN, canvas rendering, text extraction |
| **OCR** | `openaiClient.js` → `openaiOcr()` | GPT-4o vision (high-detail image analysis) |
| **translation** | `translatorRouter.js` → `deepseekClient.js` | DeepSeek Chat primary; OpenAI fallback |
| **terminology** | `promptBuilder.js`, `GlossaryPanel.jsx`, Lexicon tab | Glossary enforcement, vocabulary index |
| **annotation** | `useAnnotations.js`, Annotations + Citations tabs | Researcher notes, confidence scores, auto-detected citations |
| **publication** | `exportService.js`, `ExportModal.jsx` | Plaintext report + print-ready HTML dossier |

## Architecture

All model calls route through a single dispatcher:

```
App.jsx
  └─ translatePage() / translateText()
       └─ translatorRouter (task dispatch)
            ├─ ocr       → OpenAI GPT-4o
            ├─ translate → DeepSeek Chat
            └─ polish    → OpenAI GPT-4o-mini
```

## Project Structure

```
src/
├── App.jsx                 orchestrator (state + wiring)
├── components/             UI layer
│   ├── Header.jsx
│   ├── SettingsBar.jsx
│   ├── DocumentSourcePanel.jsx
│   ├── TranslationViewer.jsx
│   ├── PageGrid.jsx
│   ├── WorkspaceTabs.jsx
│   ├── GlossaryPanel.jsx
│   ├── ApiKeyPanel.jsx
│   ├── HistorySidebar.jsx
│   └── ExportModal.jsx
├── hooks/                  stateful logic
│   ├── useDocumentSource.js
│   ├── useAnnotations.js
│   └── useApiKeys.js
├── services/               API clients + business logic
│   ├── translatorRouter.js (entry point)
│   ├── openaiClient.js
│   ├── deepseekClient.js
│   ├── promptBuilder.js
│   ├── documentParser.js
│   └── exportService.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── fetchHelpers.js
```

## Quick Start

```bash
git clone https://github.com/theblackyellowarrow/hermeneia.git slovo
cd slovo
npm install
cp .env.example .env
```

Add your API keys to `.env`:

```env
VITE_OPENAI_API_KEY=sk-...
VITE_DEEPSEEK_API_KEY=sk-...
```

Then:

```bash
npm run dev
```

Open the printed local Vite URL.

## Environment

| Variable | Purpose |
|---|---|
| `VITE_OPENAI_API_KEY` | OCR (image pages) and translation fallback |
| `VITE_DEEPSEEK_API_KEY` | Primary translation engine (free tier) |
| `VITE_APP_ID` | Application identifier (default: `hermeneia-local`) |

## Provider Model

Slovo ships with a graduated access model:

- **DeepSeek** — free, always available, handles the majority of translation tasks
- **OpenAI free tier** — 10 pages of OCR and fallback translation, shared key
- **Bring your own key** — after the free tier, users supply their own OpenAI key for unrestricted use

Keys are stored in the browser's `localStorage` only. They are never transmitted to a server.

## Design Principles

- Black is archive space, not just dark mode
- Cyan is signal — detection, translation in motion, active state
- The interface is a research instrument, not a chat application
- The researcher remains the authorial agent; the model is subordinate
- Squared panels, restrained typography, no rounded SaaS aesthetic
- Export dossiers are designed to resemble scholarly publications, not app printouts

## Constraints

- PDF.js loaded from CDN at runtime
- API calls are client-side (prototype security model)
- PDF and image files limited to 10 MB
- Desktop-first layout; mobile collapses into tabs
- No backend, no database, no user accounts

## Commands

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # ESLint
```

## Deployment

Configured for Vercel with zero-config Vite detection. Push to the `master` branch and Vercel redeploys automatically. Requires `VITE_OPENAI_API_KEY` and `VITE_DEEPSEEK_API_KEY` in the Vercel environment variables dashboard.
