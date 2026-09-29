/**
 * Deno Deploy entrypoint for the Jovia Network site.
 *
 * Deno Deploy runs code — it does not host a folder — so this handler maps
 * requests to the Vite build output. It is deliberately defensive so it
 * works no matter how the deployment is configured:
 *   • Serves ./dist if present (built via `deno task build` / `npm run build`).
 *   • dist/ is ALSO committed to the repo, so even a build-less deployment
 *     serves the real site instead of a blank page.
 *   • SPA fallback to index.html for /app, /auth and other client-side routes.
 *   • Correct MIME types (mp4, woff2, images) — required for video playback.
 *   • Immutable caching for fingerprinted /assets, short TTL elsewhere.
 *
 * Deploy targets:
 *   - Deno Deploy GitHub integration: build command `deno task build`,
 *     entrypoint `serve.ts` (build command is optional — dist/ is committed).
 *   - CLI: `deployctl deploy --project=<name> --entrypoint=serve.ts --prod`
 *   - Local: `deno task build && deno task start`
 */

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json",
};

function contentType(path: string): string {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return "application/octet-stream";
  return MIME[path.slice(dot).toLowerCase()] ?? "application/octet-stream";
}

/**
 * Resolve the dist/ folder. Prefers the directory next to this file; falls
 * back to $CWD/dist (some deploy runners start the process from the repo
 * root with a different module layout). Resolved lazily and memoized so
 * Deno.cwd() is stable at request time.
 */
let cachedRoot: string | null = null;
async function resolveDistRoot(): Promise<string | null> {
  if (cachedRoot) return cachedRoot;
  const candidates = [
    new URL("./dist/", import.meta.url).pathname,
    `${Deno.cwd().replace(/\/$/, "")}/dist/`,
  ];
  for (const root of candidates) {
    try {
      const stat = await Deno.stat(`${root}index.html`);
      if (stat.isFile) {
        cachedRoot = root;
        return root;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function serveFile(filePath: string, status = 200): Promise<Response> {
  const body = await Deno.readFile(filePath);
  const immutable = filePath.includes("/assets/");
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType(filePath),
      "cache-control": immutable
        ? "public, max-age=31536000, immutable"
        : status === 200
        ? "public, max-age=300"
        : "no-cache",
    },
  });
}

function buildMissingResponse(distResolved: boolean): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Jovia Network — deploying</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#16032f;color:#fff;
font-family:system-ui,sans-serif;text-align:center;padding:24px}h1{color:#FFD700;font-size:1.4rem}
p{color:#B9A6E8;max-width:32rem;line-height:1.6}</style></head>
<body><div><h1>JOVIA NETWORK</h1><p>${distResolved
    ? "The site build output is unavailable. Re-run the deployment with build command <code>deno task build</code>."
    : "This deployment has not finished building yet. Set the build command to <code>deno task build</code> and the entrypoint to <code>serve.ts</code> in the Deno Deploy dashboard, then redeploy."}</p></div></body></html>`;
  return new Response(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const handler = async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);

    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }
    if (pathname.includes("\0") || pathname.includes("..")) {
      return new Response("Bad request", { status: 400 });
    }

    if (pathname === "/healthz") {
      return new Response("ok", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    const distRoot = await resolveDistRoot();
    if (!distRoot) {
      return buildMissingResponse(false);
    }

    // Map the URL to a file inside dist/.
    const rel = pathname.replace(/^\/+/, "");
    let filePath = rel === "" ? `${distRoot}index.html` : `${distRoot}${rel}`;

    // Directories resolve to their index.html (e.g. /some-dir/).
    try {
      const stat = await Deno.stat(filePath);
      if (stat.isDirectory) filePath = `${filePath.replace(/\/$/, "")}/index.html`;
    } catch {
      // Not found — handled below.
    }

    // Serve the file if it exists...
    try {
      const stat = await Deno.stat(filePath);
      if (stat.isFile) {
        const response = await serveFile(filePath);
        response.headers.set("x-content-type-options", "nosniff");
        response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
        return response;
      }
    } catch {
      // fall through to SPA fallback / 404
    }

    // ...otherwise: SPA fallback for extension-less routes (/app, /auth, ...).
    const lastSegment = pathname.split("/").pop() ?? "";
    if (!lastSegment.includes(".")) {
      return await serveFile(`${distRoot}index.html`, 200);
    }

    // Asset-like path that doesn't exist: plain 404.
    return new Response("Not found", { status: 404 });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
};

if (import.meta.main) {
  // On Deno Deploy the port is provided by the platform; locally default
  // to 8000 (PORT env var still respected for local previews).
  Deno.serve(handler);
}
