# agelo-website

The public website and documentation for the Agelo platform.

- **Stack:** Astro 5 + Starlight 0.30
- **Search:** built-in Pagefind (no external SaaS)
- **Static output:** the build emits `dist/` you can host on Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static host.

## Layout

```
/            → marketing landing page (src/pages/index.astro)
/docs/...    → Starlight documentation (src/content/docs/docs/**)
```

The split works by nesting the Starlight content under `src/content/docs/docs/`. Starlight maps content paths 1:1 to URLs, so files at `src/content/docs/docs/getting-started/installation.md` resolve at `/docs/getting-started/installation`. The Astro page at `src/pages/index.astro` takes precedence at `/` and serves the marketing landing.

## Develop

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`:

- `http://localhost:4321/` — landing page
- `http://localhost:4321/docs/` — docs home
- `http://localhost:4321/docs/api/overview` — API reference start

## Build

```bash
npm run build
```

Outputs `dist/`. The full static site, including the Pagefind search index.

## Pull and run from GHCR

Every push to `master` builds a new image (Astro static output served via
nginx) and publishes it to `ghcr.io/agelo-platform/agelo-website` tagged
with the GitVersion-derived `AssemblySemVer` plus `:latest` and a
`sha-…` tag.

```bash
# This image is public — pull it anonymously. If a package is still
# private, authenticate first:
#   echo $GH_TOKEN | docker login ghcr.io -u <your-github-user> --password-stdin

# Pull and run the latest published image
docker pull ghcr.io/agelo-platform/agelo-website:latest
docker run --rm -p 4173:80 ghcr.io/agelo-platform/agelo-website:latest
# → http://localhost:4173/        landing
# → http://localhost:4173/docs/   docs
```

Pin a specific build with a tag:

```bash
docker pull ghcr.io/agelo-platform/agelo-website:0.0.1.0
```

For the full Agelo stack (backend + database + SPA + website) follow the
[Run with Docker Compose](https://agelo.app/docs/platform/docker-compose/)
guide.

## Deploy

Any static host works. For Vercel: connect the repo, no build config beyond `npm run build`. For GitHub Pages: deploy `dist/` from the build job.

## Releases & CI/CD

GitOps end-to-end: every PR merged to `master` is automatically built
and published as a new image to GHCR.

| Workflow | Trigger | Result |
|---|---|---|
| [`.github/workflows/build-image.yml`](.github/workflows/build-image.yml) | `push` → `master` (and `workflow_dispatch`) | GitVersion → AssemblySemVer → multi-stage Dockerfile (Astro build → nginx) → push `ghcr.io/agelo-platform/agelo-website:{version,latest,sha-…}`. |

GitVersion config lives in [`gitversion.yml`](gitversion.yml). Push a
`v0.1.0` git tag to anchor the next published image at that version.

## License

MIT — see [LICENSE](./LICENSE).
