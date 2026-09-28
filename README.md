# JOVIA Network

Jovia Network — watch, play, connect and earn. Celebrity videos, fun games, music and
social activities with real-time rewards in Naira.

Built with **Vite + React 18 + TypeScript + Tailwind + shadcn/ui** (no backend — demo
store in `localStorage`).

---

## Deploying to Deno Deploy

The repo ships a ready-to-use Deno Deploy entrypoint (`serve.ts`) that serves the Vite
build output (`dist/`) with SPA fallback, correct MIME types (mp4 videos, woff2 fonts)
and cache headers. Deno Deploy cannot serve static files by itself — that's why a bare
deployment previously showed nothing.

### Option A — GitHub integration (recommended)

1. Push this repo to GitHub (already done — `main` is up to date).
2. Go to <https://github.com/apps/deno-deploy> or open
   <https://dash.deno.com/new> → **GitHub repo** flow:
   - Select the **JOVIA** repository and the `main` branch.
   - **Build command:** `deno task build` (runs `npm run build` → `dist/`)
   - **Entrypoint:** `serve.ts`
3. Click **Link** and wait for the first deployment — the app will be live at
   `https://<project>.deno.dev`.

### Option B — deployctl CLI

```bash
# One-time
deno install -Arf jsr:@deno/deployctl

# Build then deploy
deno task build
deployctl deploy --project=jovia --entrypoint=serve.ts --prod
```

### Verify after deploying

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://<project>.deno.dev/                 # 200
curl -sS https://<project>.deno.dev/app | grep -q 'id="root"' && echo "SPA fallback OK"
curl -sS -o /prem dev/null -w "%{http_code} %{content_type}\n" https://<project>.deno.dev/videos/jovia-games.mp4
```

### Why it showed blank before

A Vite SPA is just static files in `dist/`. Deno Deploy only runs code — with no
entrypoint to map requests to `dist/`, every request 404'd (or served an empty page)
because there was nothing to serve `index.html`, the hashed `assets/*.js` bundle, or
the `/videos` and `/images` media. `serve.ts` fixes this: static file serving with
SPA fallback, correct Content-Types, and immutable caching for fingerprinted assets.

---

## Local development

```bash
npm install
npm run dev      # Vite dev server (Freebuff preview uses this)
npm run build    # production build into dist/
deno task smoke  # one-shot check of the Deno entrypoint against dist/
```
