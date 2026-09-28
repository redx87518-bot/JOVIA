/**
 * One-shot smoke test for the Deno Deploy entrypoint.
 * Starts the real handler on an ephemeral port, verifies routes, MIME types
 * and SPA fallback, then exits (no long-lived processes).
 *
 * Run: `deno task smoke`
 */
import { handler } from "../serve.ts";

const PORT = 8931;
const controller = new AbortController();
const server = Deno.serve({ port: PORT, signal: controller.signal }, handler);

const BASE = `http://127.0.0.1:${PORT}`;
const failures: string[] = [];
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  | " + detail : ""}`);
  if (!ok) failures.push(name);
};

// / -> index.html
const home = await fetch(`${BASE}/`);
check(
  "GET / serves index.html",
  home.status === 200 && (await home.text()).includes("<div id=\"root\">"),
  `status=${home.status}`,
);

// SPA fallback for deep routes
const app = await fetch(`${BASE}/app?tab=tasks`);
const appText = await app.text();
check(
  "GET /app?tab=tasks falls back to index.html",
  app.status === 200 && appText.includes("<div id=\"root\">"),
  `status=${app.status}`,
);

// Fingerprinted asset (find JS bundle from index.html)
const html = await (await fetch(`${BASE}/`)).text();
const bundle = html.match(/assets\/index-[^"]+\.js/)?.[0];
if (bundle) {
  const js = await fetch(`${BASE}/${bundle}`);
  const body = await js.text();
  const isJs = !!js.headers.get("content-type")?.includes("javascript");
  check(
    "GET /assets/*.js serves JS with correct MIME",
    js.status === 200 && isJs && body.length > 10000,
    `status=${js.status} type=${js.headers.get("content-type")} bytes=${body.length}`,
  );
  check(
    "assets carry immutable cache header",
    (js.headers.get("cache-control") ?? "").includes("immutable"),
    js.headers.get("cache-control") ?? "missing",
  );
} else {
  check("GET /assets/*.js serves JS with correct MIME", false, "no bundle in index.html");
}

// Static media from public/
for (const [path, type] of [
  ["/images/hero-cac.jpg", "image/jpeg"],
  ["/images/jovia-games-preview.jpg", "image/jpeg"],
  ["/images/icon-temple-run.jpg", "image/jpeg"],
  ["/videos/jovia-games.mp4", "video/mp4"],
  ["/jovia-social-preview.png", "image/png"],
] as const) {
  const res = await fetch(`${BASE}${path}`);
  check(
    `GET ${path} -> ${type}`,
    res.status === 200 && res.headers.get("content-type") === type,
    `status=${res.status} type=${res.headers.get("content-type")}`,
  );
  await res.body?.cancel();
}

// Health endpoint
const health = await fetch(`${BASE}/healthz`);
check("GET /healthz -> ok", health.status === 200 && (await health.text()) === "ok");

// Unknown asset-like path should still 404 (no HTML leak for missing files)
const missing = await fetch(`${BASE}/images/does-not-exist.jpg`);
check(
  "GET /images/does-not-exist.jpg -> 404",
  missing.status === 404,
  `status=${missing.status}`,
);

controller.abort();
await server.finished.catch(() => {});

if (failures.length) {
  console.error(`\n${failures.length} smoke check(s) failed.`);
  Deno.exit(1);
}
console.log("\nAll Deno smoke checks passed.");
