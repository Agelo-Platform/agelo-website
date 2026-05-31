# Contributing to agelo-website

Thank you for considering a contribution. This repo holds both the
landing page and the documentation served at
[agelo.app](https://agelo.app).

## Development setup

Requirements:

- Node 20+

```bash
git clone https://github.com/Agelo-Platform/agelo-website.git
cd agelo-website
npm install
npm run dev   # → http://localhost:4321/ (landing) and /docs/ (docs)
npm run build # → dist/ (static output)
```

## Editing the landing page

`src/pages/index.astro` is the only landing page. Keep it
self-contained: inline CSS, no external CDN beyond fonts, no
client-side JS frameworks. The brand palette is the violet → teal
gradient (`#7b5fff` → `#2edab0`).

## Editing the docs

Markdown lives under `src/content/docs/docs/`. The folder structure
maps 1:1 to URLs under `/docs/...`. Front-matter:

```yaml
---
title: A short, sentence-case title
description: One line that GitHub previews and search engines surface.
---
```

When you add a route to `agelo-server`, please also update
`src/content/docs/docs/api/<module>.md` so the published API reference
stays in sync.

## Style

- Be concrete, technical, and concise. No marketing fluff.
- Use admonitions sparingly: `note`, `tip`, `caution`, `danger`.
- Code blocks should be runnable. Always specify the language.
- Cross-link related pages via relative URLs.

## Pull request checklist

- [ ] `npm run build` succeeds (the bundled `astro check` runs in
  the production Dockerfile too).
- [ ] No broken internal links.
- [ ] Prose has been read for tone — neutral, technical voice.
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

## Commit messages

We use Conventional Commits. Examples:

```
docs(api): document the prompts /mcp read endpoint
feat(landing): add the architecture diagram below the hero
fix(docs): correct the JWT lifetime example in platform/auth.md
```

## Code of conduct

Be kind, be specific, and assume good faith. Harassment of any form
is not tolerated.

## License

By contributing you agree your work will be released under the project's
MIT [LICENSE](LICENSE).
