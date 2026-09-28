/**
 * Deno Deploy entrypoint for the Jovia Network static build.
 *
 * Deno Deploy cannot serve a Vite `dist/` folder by itself — it runs code, so
 * the repo must provide a handler that maps requests to files. This file:
 *   1. Serves files from ./dist (output of `deno task build`).
 *   2. Falls back to dist/index.html for SPA routes (/app, /auth, ...) so
 *      deep links and client-side navigation work.
 *   3. Sets correct Content-Type (mp4, woff2, etc.) and cache headers
 *      (fingerprinted assets are immutable).
 *
 * It is intentionally dependency-free (Deno standard APIs only) so Deno
 * Deploy needs no remote modules and cold starts fast.
 *
 * Deploy targets:
 *   - Deno Deploy GitHub integration: build command `deno task build`,
 *     entrypoint `serve.ts`
 *   - CLI: `deployctl deploy --project=<name> --entrypoint=serve.ts`
 *   - Local: `deno task build && deno task start`
 */

const DIST_ROOT = new URL("./dist/", import.meta.url).pathname;

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
  return MIME[path.slice(path.lastIndexOf(".")).toLowerCase()] ??
    "application/octet-stream";
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

    // Map the URL to a file inside dist/.
    const rel = pathname.replace(/^\/+/, "");
    let filePath = rel === "" ? `${DIST_ROOT}index.html` : `${DIST_ROOT}${rel}`;

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
      try {
        return await serveFile(`${DIST_ROOT}index.html`, 200);
      } catch {
        return new Response("Build output missing — run `deno task build`.", {
          status: 503,
        });
      }
    }

    // Asset-like path that doesn't exist: plain 404.
    return new Response("Not found", { status: 404 });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
};

if (import.meta.main) {
  Deno.serve(
    { port: Number(Deno.env.get("PORT") ?? 8000) },
    handler,
  );
}
