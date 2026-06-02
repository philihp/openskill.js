# openskill.js documentation

The documentation site, built with [VitePress](https://vitepress.dev/) and
deployed to GitHub Pages.

## Local development

```bash
cd docs
npm install
npm run dev      # start a local dev server with hot reload
npm run build    # build the static site into .vitepress/dist
npm run preview  # preview the production build locally
```

## Deployment

Pushing to `main` with changes under `docs/` triggers the
[`Deploy Docs`](../.github/workflows/docs.yml) workflow, which builds the site
and publishes it to GitHub Pages.

> [!NOTE]
> The repository's **Settings → Pages → Build and deployment → Source** must be
> set to **GitHub Actions** for the workflow to publish.

## Structure

```
docs/
├─ .vitepress/config.ts   # site config, nav, and sidebar
├─ index.md               # home page
├─ guide/                 # narrative guide
└─ reference/             # options, API, and type reference
```
