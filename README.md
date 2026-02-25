# 🏗️ Landing Builder

AI-powered landing page builder SDK. Generate and visually edit landing pages from natural language prompts.

**Framework-agnostic core** with official renderers for React, Vue, and Angular.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@landing-builder/core` | Schema, prompt engine, block registry, HTML renderer | ✅ Ready |
| `@landing-builder/react` | React components, editor, hooks | ✅ Ready |
| `@landing-builder/vue` | Vue 3 components and composables | 🚧 Coming |
| `@landing-builder/angular` | Angular components and services | 🚧 Coming |

## Quick Start

```bash
npm install @landing-builder/core @landing-builder/react
```

### Generate from prompt

```tsx
import { generateFromPrompt, createOpenAIAdapter } from '@landing-builder/core';

const llm = createOpenAIAdapter({ apiKey: 'sk-...' });

const page = await generateFromPrompt({
  prompt: 'Landing page for a yoga studio with pricing, testimonials and CTA',
  llm,
  locale: 'en',
});
```

### Render (React)

```tsx
import { LandingRenderer } from '@landing-builder/react';

export default function Preview() {
  return <LandingRenderer page={page} />;
}
```

### Visual Editor (React)

```tsx
import { LandingEditor, usePageState } from '@landing-builder/react';

export default function Editor() {
  const [page, actions] = usePageState(initialPage, (updated) => {
    // Save to DB, localStorage, etc.
    savePage(updated);
  });

  return <LandingEditor page={page} actions={actions} />;
}
```

### Static HTML Export

```ts
import { renderToHtml } from '@landing-builder/core';

const html = renderToHtml(page, { fullDocument: true });
// Deploy anywhere — Netlify, S3, etc.
```

### Custom Blocks

```tsx
import { registerBlock } from '@landing-builder/react';

registerBlock({
  type: 'video-hero',
  label: 'Video Hero',
  icon: '🎬',
  category: 'content',
  renderer: MyVideoHeroComponent,
  defaultProps: { videoUrl: '', headline: 'Watch our story' },
});
```

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   User Prompt                     │
│        "Landing for SaaS with pricing..."        │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│            @landing-builder/core                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │ Prompt Engine│→ │ LandingPage  │→ │  HTML    │ │
│  │ (LLM Adapter)│  │ JSON Schema  │  │ Renderer │ │
│  └─────────────┘  └──────┬───────┘  └─────────┘ │
│                          │                        │
│  ┌─────────────┐  ┌──────┴───────┐               │
│  │Block Registry│  │Editor Ops    │               │
│  └─────────────┘  │(add/move/del)│               │
│                    └──────────────┘               │
└──────────────────────┬───────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌───────────┐ ┌──────────┐ ┌──────────┐
   │   React   │ │   Vue    │ │ Angular  │
   │ Renderer  │ │ Renderer │ │ Renderer │
   │ + Editor  │ │ + Editor │ │ + Editor │
   └───────────┘ └──────────┘ └──────────┘
```

## Key Design Decisions

- **JSON-first**: Pages are serializable JSON — store in any DB, version control, or API
- **LLM-agnostic**: Adapter pattern — use OpenAI, Claude, Ollama, or any compatible API
- **Framework renderers are thin**: All logic lives in `core`; renderers just map JSON → components
- **Extensible blocks**: Register custom section types with your own components
- **Undo/redo built-in**: Editor state management includes full history

## Development

```bash
git clone https://github.com/jagjerez-org/landing-builder.git
cd landing-builder
npm install
npm run build
```

## License

MIT © jagjerez-org
