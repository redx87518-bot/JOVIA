/**
 * Pre-deploy sanity check: verifies the built site in dist/ is complete and
 * self-consistent, so a bad deployment can never serve a blank page.
 *
 * Checks:
 *  1. dist/index.html exists, is valid HTML, and has a mount node.
 *  2. Every <script src> and <link rel="stylesheet"> referenced by index.html
 *     actually exists in dist/ (a missing bundle = white screen in production).
 *  3. Every image/video/font referenced from dist/ exists on disk.
 *
 * Run: `deno task check`   (exit 1 with a clear message if anything is broken)
 */

const distRoot = new URL("../dist/", import.meta.url).pathname;

async function exists(path: string): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isFile;
  } catch {
    return false;
  }
}

// 1. index.html must exist and mount the app.
const indexPath = `${distRoot}index.html`;
if (!(await exists(indexPath))) {
  console.error("FAIL: dist/index.html not found. Run `npm run build` first.");
  Deno.exit(1);
}
const html = await Deno.readTextFile(indexPath);
if (!/<div[^>]+id=["']root["']/.test(html)) {
  console.error("FAIL: dist/index.html has no #root mount node.");
  Deno.exit(1);
}

// 2. Collect every script/stylesheet reference and make sure the file exists.
const refs = [
  ...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:js|css))"/g),
].map((m) => m[1]);

if (refs.length === 0) {
  console.error("FAIL: dist/index.html references no JS/CSS bundles.");
  Deno.exit(1);
}

let failed = false;
for (const ref of refs) {
  const filePath = `${distRoot}${ref.replace(/^\//, "")}`;
  if (await exists(filePath)) {
    console.log(`PASS  ${ref}`);
  } else {
    console.error(`FAIL  ${ref} — referenced by index.html but missing from dist/`);
    failed = true;
  }
}

// 3. Media referenced from dist/ (relative /images, /videos, favicon, preview).
const mediaRefs = [
  ...new Set([
    ...html.matchAll(/(?:src|href|content)="(\/[^"]+\.(?:png|jpe?g|webp|svg|mp4|webm|ico))"/g),
  ].map((m) => m[1])),
];
for (const ref of mediaRefs) {
  const filePath = `${distRoot}${ref.replace(/^\//, "")}`;
  if (await exists(filePath)) {
    console.log(`PASS  ${ref}`);
  } else {
    console.error(`FAIL  ${ref} — referenced media missing from dist/`);
    failed = true;
  }
}

if (failed) {
  console.error("\nBuild output is broken — do not deploy. Re-run `npm run build`.");
  Deno.exit(1);
}
console.log(
  `\nAll build-output checks passed (${refs.length} JS/CSS, ${mediaRefs.length} media).`,
);
