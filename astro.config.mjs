// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Layout split:
//   /            ← landing page (src/pages/index.astro, Astro page)
//   /docs/...    ← Starlight docs (files under src/content/docs/docs/**)
//
// Starlight reads from src/content/docs/ and maps file paths to URLs as-is.
// Nesting everything one level deeper under `docs/` puts the documentation
// at `/docs/*` while leaving `/` free for the marketing landing page.
//
// https://astro.build/config
export default defineConfig({
  site: 'https://agelo.dev',
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: 'Agelo',
      description:
        'Solution-design-driven kanban for human-AI collaboration. Boards built for agents.',
      // The brand mark — a gradient "A" with a card cut as negative
      // space — works on both light and dark headers without a retint,
      // so a single source covers Starlight's theme toggle.
      logo: {
        src: './public/agelo-mark.svg',
      },
      favicon: '/favicon.svg',
      pagefind: true,
      social: {
        github: 'https://github.com/Agelo-Platform',
      },
      editLink: {
        baseUrl: 'https://github.com/Agelo-Platform/agelo-website/edit/master/',
      },
      sidebar: [
        {
          label: 'Getting started',
          autogenerate: { directory: 'docs/getting-started' },
        },
        {
          label: 'Concepts',
          autogenerate: { directory: 'docs/concepts' },
        },
        {
          label: 'Platform',
          autogenerate: { directory: 'docs/platform' },
        },
        {
          label: 'API reference',
          autogenerate: { directory: 'docs/api' },
        },
        {
          label: 'MCP',
          autogenerate: { directory: 'docs/mcp' },
        },
        {
          label: 'CLI',
          autogenerate: { directory: 'docs/cli' },
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
