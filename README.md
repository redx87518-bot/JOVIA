# JOVIA Network

Jovia Network — watch, play, connect and earn. Celebrity videos, fun games, music and
social activities with real-time rewards in Naira.

Built with **Vite + React 18 + TypeScript + Tailwind + shadcn/ui** (no backend — demo
store in `localStorage`).

---

## Deploying to Deno Deploy

This repo is configured **entirely from source** via the `deploy` key in `deno.json`.
Deno Deploy reads this file on every GitHub build, so there is **nothing to configure
in the dashboard** — no entrypoint, no build command fields. The app deploys as a
native **static site** with SPA mode enabled:

- **Install:** `npm install`
- **Build:** `npm run build` (Vite → `dist/`)
- **Runtime:** static, serving `./dist` with `spa: true` (unknown paths serve
  `index.html`, so `/app`, `/auth` and every client route work on refresh)

The built `dist/` folder is also committed to the repository, so even a build-less
deploy still serves a working site.

### Option A — GitHub integration (recommended)

1. Open <https://dash.deno.com/new> → **Deploy from GitHub** → select the **JOVIA**
   repository, branch `main`.
2. Leave all settings as detected (build command, entrypoint etc. come from
   `deno.json`). If the dashboard asks for an app directory, use the repository root.
3. Click **Link**. Wait for the build to finish, then open
   `https://<your-project>.deno.dev`.

> **Already linked the repo?** Deno Deploy redeploys on every push to `main`. Open the
> project → **Builds** → **Deploy Default Branch** after merging changes. Since the
> configuration lives in `deno.json`, a fresh build automatically picks it up.

### Option B — CLI

```bash
deno install -Arf jsr:@deno/deployctl
deployctl deploy --prod
```

deployctl reads the same `deploy` key from `deno.json`.

### Verify after deploying

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://<your-project>.deno.dev/   # 200
curl -sS https://<your-project>.deno.dev/app | grep -q 'id="root"' && echo "SPA OK"
curl -sS -o /dev/null -w "%{content_type}\n" https://<your-project>.deno.dev/videos/jovia-games.mp4  # video/mp4
```

### Troubleshooting

- **White/blank page** — check the build page on Deno Deploy: it must be a **static**
  runtime pointing at `dist`. If the dashboard shows a dynamic entrypoint from an old
  configuration, delete the app and re-link the repository (the `deploy` key in
  `deno.json` will then take over).
- **Build failed** — open **Build Logs** on the build page. If `dist/` is committed,
  the site still serves the committed build even when the build step fails.
- **404 on `/app` or `/auth`** — SPA mode is off. It is set by `spa: true` in
  `deno.json`; make sure the dashboard did not override the source configuration.

---

## Local development

```bash
npm install
npm run dev        # Vite dev server (Freebuff preview uses this)
npm run build      # production build into dist/ (also committed for Deno Deploy)
deno task check    # verify dist/ is complete before deploying
```

## Committing a fresh build

`dist/` is gitignored but intentionally committed so the deployment is
self-sufficient. After changing the app:

```bash
npm run build
git add -f dist/
git commit -m "Rebuild dist/"
```
