# JOVIA Network

Jovia Network — watch, play, connect and earn. Celebrity videos, fun games, music and
social activities with real-time rewards in Naira.

Built with **Vite + React 18 + TypeScript + Tailwind + shadcn/ui** (no backend — demo
store in `localStorage`).

---

## Deploying to Deno Deploy

This repo ships `serve.ts`, a Deno Deploy entrypoint that serves the Vite build output
(`dist/`) with SPA fallback, correct MIME types (mp4, woff2…) and caching. **The built
site (`dist/`) is also committed to the repository**, so the deployment works even if
the build step is skipped or misconfigured.

### Option A — GitHub integration (recommended)

1. Open <https://dash.deno.com/new> → **Deploy from GitHub** → select the **JOVIA**
   repository, branch `main`.
2. Use exactly these settings:
   - **Build command:** `deno task build` *(optional — `dist/` is committed, so the
     site deploys even with this left empty)*
   - **Entrypoint:** `serve.ts`
3. Click **Link**. Wait for the build to finish, then open
   `https://<your-project>.deno.dev`.

> **Already linked the repo?** Deno Deploy redeploys on every push to `main`. Open the
> project → **Deployments** → **Redeploy** on the latest one after merging changes.

### Option B — deployctl CLI

```bash
deno install -Arf jsr:@deno/deployctl
deployctl deploy --project=<name> --entrypoint=serve.ts --prod
```

### Verify after deploying

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://<your-project>.deno.dev/           # 200
curl -sS https://<your-project>.deno.dev/app | grep -q 'id="root"' && echo "SPA OK"
curl -sSI https://<your-project>.deno.dev/videos/jovia-games.mp4 | head -1           # 200 + video/mp4
```

### Troubleshooting a blank page

- **"This deployment has not finished building yet"** — the entrypoint isn't `serve.ts`,
  or the linked branch isn't `main`. Fix the settings and redeploy.
- **404 / empty responses on every path** — the entrypoint is missing. Set
  **Entrypoint:** `serve.ts`.
- **Check the build log** (Deployments → latest → Build Logs). If the build failed but
  `dist/` is committed, the site still serves — report the log if anything else breaks.

---

## Local development

```bash
npm install
npm run dev        # Vite dev server (Freebuff preview uses this)
npm run build      # production build into dist/ (also committed for Deno Deploy)
deno task smoke    # one-shot check of the Deno entrypoint against dist/
```
