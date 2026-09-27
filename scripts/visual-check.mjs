import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "https://jovia.freebuff.app";
const OUT = "screenshots";
fs.mkdirSync(OUT, { recursive: true });

const results = [];
const add = (name, pass, detail = "") =>
  results.push({ name, pass, detail: String(detail).slice(0, 300) });

/**
 * Scan for real horizontal overflow: an element only matters if it can widen
 * the page. Elements clipped by an ancestor with overflow-x hidden/clip (or
 * any scroll container) cannot cause page-wide swiping, so they are ignored.
 */
async function overflowReport(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const doc = document.documentElement;
    const offenders = [];
    for (const el of document.body.querySelectorAll("*")) {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && (r.right > vw + 1 || r.left < -1))) continue;
      // Walk ancestors: is this element clipped by a scroll container?
      let contained = false;
      let p = el.parentElement;
      while (p) {
        const s = getComputedStyle(p);
        if (["hidden", "clip", "auto", "scroll"].includes(s.overflowX)) {
          contained = true;
          break;
        }
        p = p.parentElement;
      }
      if (contained) continue;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString().slice(0, 90)) || "",
        right: Math.round(r.right),
        left: Math.round(r.left),
      });
    }
    return {
      vw,
      docScrollW: doc.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      offenders: offenders.slice(0, 8),
      offenderCount: offenders.length,
      canScroll:
        doc.scrollWidth > vw + 1 ||
        document.body.scrollWidth > vw + 1,
    };
  });
}

function assertNoOverflow(page, label) {
  return overflowReport(page).then((ov) => {
    add(
      `${label}: no horizontal overflow`,
      !ov.canScroll && ov.offenderCount === 0,
      `vw=${ov.vw} docScrollW=${ov.docScrollW} bodyScrollW=${ov.bodyScrollW} unclipped-offenders=${ov.offenderCount}` +
        (ov.offenderCount ? ` ${JSON.stringify(ov.offenders)}` : "")
    );
    return ov;
  });
}

async function checkPage(page, label, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  return assertNoOverflow(page, label);
}

const browser = await chromium.launch();
const errors = [];

// ---------- DESKTOP ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text().slice(0, 200)}`);
  });

  await checkPage(page, "desktop 1440", BASE + "/");
  await page.screenshot({ path: `${OUT}/desktop-hero.png` });
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });

  // Hero banners: read active title, click dots, verify rotation
  const title1 = await page
    .locator('section[aria-label="Featured campaigns"] h2')
    .innerText()
    .catch(() => "");
  add("banners: hero banner renders with title", title1.length > 5, `title="${title1}"`);
  const dots = page.locator('button[aria-label^="Show banner"]');
  const dotCount = await dots.count();
  add("banners: 3 carousel dots present", dotCount === 3, `dots=${dotCount}`);
  if (dotCount >= 2) {
    const getActive = () =>
      page.evaluate(() => {
        const dots = [
          ...document.querySelectorAll('button[aria-label^="Show banner"]'),
        ];
        return dots.findIndex((d) => d.getAttribute("aria-current") === "true");
      });
    const activeBefore = await getActive();
    await dots.nth((activeBefore + 1) % dotCount).click();
    await page.waitForTimeout(700);
    const activeAfter = await getActive();
    add(
      "banners: dot click selects the clicked banner",
      activeAfter === (activeBefore + 1) % dotCount,
      `index ${activeBefore} -> ${activeAfter}`
    );
    await page.screenshot({ path: `${OUT}/desktop-banner2.png` });
    // Auto-rotation keeps advancing (6s interval): observe a change over time
    await page.waitForTimeout(6500);
    const activeLater = await getActive();
    add(
      "banners: auto-rotation advances banner",
      activeLater !== activeAfter,
      `index ${activeAfter} -> ${activeLater}`
    );
  }

  // Home video lightbox (autoPlay mp4 -> plays in headless via codecs present)
  await page
    .locator('button[aria-label="Play the Jovia introduction video"]')
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/desktop-video-stage.png` });
  await page
    .locator('button[aria-label="Play the Jovia introduction video"]')
    .click();
  const dialog = page.locator('div[aria-label="Jovia introduction video"]');
  const dialogVisible = await dialog
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  add("video: lightbox opens on click", dialogVisible);
  if (dialogVisible) {
    await page.waitForTimeout(3500);
    const vstate = await page.evaluate(() => {
      const v = document.querySelector('div[aria-label="Jovia introduction video"] video');
      if (!v) return { exists: false };
      return {
        exists: true,
        videoWidth: v.videoWidth,
        paused: v.paused,
        ended: v.ended,
        currentTime: v.currentTime,
        fellback: !!v.dataset.fellback,
        stageGone: v.style.display === "none",
      };
    });
    const unavailable = await page
      .locator('div[aria-label="Jovia introduction video"] >> text=PREVIEW UNAVAILABLE')
      .isVisible()
      .catch(() => false);
    add(
      "video: sample clip loads and plays",
      vstate.exists && vstate.videoWidth > 0 && !vstate.paused && vstate.currentTime > 0.2,
      JSON.stringify(vstate)
    );
    add("video: branded fallback NOT triggered", !unavailable && !vstate.stageGone);
    await page.screenshot({ path: `${OUT}/desktop-video-open.png` });
    await dialog.locator('button[aria-label="Close video"]').click();
    const closed = await dialog
      .waitFor({ state: "hidden", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    add("video: lightbox closes", closed);
  }

  // VideoShowcase lightbox
  const showcaseBtn = page.locator('button[aria-label="Play Jovia Celebrity Videos preview"]');
  await showcaseBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await showcaseBtn.click();
  const sDialog = page.locator('div[aria-label="Jovia Celebrity Videos video preview"]');
  const sOpen = await sDialog
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  add("showcase: lightbox opens", sOpen);
  if (sOpen) {
    await page.waitForTimeout(3000);
    const sState = await page.evaluate(() => {
      const v = document.querySelector(
        'div[aria-label="Jovia Celebrity Videos video preview"] video'
      );
      return v ? { videoWidth: v.videoWidth, paused: v.paused, t: v.currentTime } : null;
    });
    add(
      "showcase: clip loads and plays",
      !!sState && sState.videoWidth > 0 && !sState.paused && sState.t > 0.1,
      JSON.stringify(sState)
    );
    await page.screenshot({ path: `${OUT}/desktop-showcase-open.png` });
    await sDialog.locator('button[aria-label="Close video"]').click();
  }

  // Stats section: scroll it into view to trigger whileInView counters
  const statsLabel = page.locator("text=Registered Users").first();
  await statsLabel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600); // counter animation (~2s)
  const statsText = await page.evaluate(() => document.body.innerText);
  const has200K = statsText.includes("200K+");
  const has150K = statsText.includes("150K+");
  const has3M = /₦300\.0M\+/.test(statsText);
  add(
    "stats: compact counters match screenshots (200K+ / 150K+ / ₦300.0M+)",
    has200K && has150K && has3M,
    `200K+=${has200K} 150K+=${has150K} ₦300M+=${has3M}`
  );

  // Signup flow (desktop)
  await page.goto(BASE + "/auth?mode=signup", { waitUntil: "networkidle" });
  const email = `visual.${Date.now()}@jovia.test`;
  await page.fill("#name", "Visual Checker");
  await page.fill("#email", email);
  await page.fill("#password", "password123");
  await page.screenshot({ path: `${OUT}/desktop-auth.png` });
  await page.click('button:has-text("Create account")');
  const onApp = await page
    .waitForURL("**/app**", { timeout: 8000 })
    .then(() => true)
    .catch(() => false);
  add("auth: signup lands on /app", onApp, `email=${email}`);
  if (onApp) {
    await page.waitForTimeout(900);
    await assertNoOverflow(page, "app dashboard 1440");
    await page.screenshot({ path: `${OUT}/desktop-app-dashboard.png` });
  }
  await ctx.close();
}

// ---------- MOBILE ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`mobile console: ${m.text().slice(0, 200)}`);
  });

  await checkPage(page, "mobile 390 landing", BASE + "/");
  await page.screenshot({ path: `${OUT}/mobile-hero.png` });
  await page.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });

  // Banner dot tap on mobile
  const dots = page.locator('button[aria-label^="Show banner"]');
  if ((await dots.count()) >= 3) {
    await dots.nth(2).click();
    await page.waitForTimeout(700);
    const t = await page
      .locator('section[aria-label="Featured campaigns"] h2')
      .innerText();
    add("mobile: banner rotation works on touch", t.length > 5, `title="${t}"`);
    await page.screenshot({ path: `${OUT}/mobile-banner3.png` });
  }

  const join = page.locator('a:has-text("Join us now")').first();
  add("mobile: hero CTA visible", await join.isVisible().catch(() => false));

  // Auth + app on mobile
  await page.goto(BASE + "/auth?mode=signup", { waitUntil: "networkidle" });
  await assertNoOverflow(page, "mobile 390 auth");
  await page.fill("#name", "Mobile Checker");
  await page.fill("#email", `mob.${Date.now()}@jovia.test`);
  await page.fill("#password", "password123");
  await page.click('button:has-text("Create account")');
  const onApp = await page
    .waitForURL("**/app**", { timeout: 8000 })
    .then(() => true)
    .catch(() => false);
  add("mobile: signup lands on /app", onApp);
  if (onApp) {
    await page.waitForTimeout(900);
    await assertNoOverflow(page, "mobile app dashboard");
    await page.screenshot({ path: `${OUT}/mobile-app-dashboard.png` });
    await page.goto(BASE + "/app?tab=tasks", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const lockedText = await page.evaluate(() => document.body.innerText);
    add(
      "mobile app: tasks gated pre-activation (Activate/Lock shown)",
      /activate/i.test(lockedText),
      ""
    );
    await page.screenshot({ path: `${OUT}/mobile-app-tasks-locked.png` });
  }
  await ctx.close();
}

// ---------- TABLET + SMALL PHONE ----------
{
  const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await ctx.newPage();
  await checkPage(page, "tablet 768", BASE + "/");
  await ctx.close();

  const ctx2 = await browser.newContext({ viewport: { width: 320, height: 568 } });
  const page2 = await ctx2.newPage();
  await checkPage(page2, "small phone 320", BASE + "/");
  await ctx2.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log("\n===== VISUAL CHECK RESULTS =====");
for (const r of results)
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  | " + r.detail : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (errors.length) {
  console.log("\n===== BROWSER ERRORS =====");
  for (const e of [...new Set(errors)].slice(0, 10)) console.log(e);
} else console.log("\nNo console/page errors detected.");
process.exit(failed.length ? 1 : 0);
