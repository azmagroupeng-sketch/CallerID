import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = "http://127.0.0.1:8080/";

async function main() {
  const out = "screenshots";
  mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: "msedge",
    args: ["--no-sandbox"],
  });

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGE: " + e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push("CONSOLE: " + msg.text());
  });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${out}/qa-1-login.png` });
  console.log("1. login loaded");

  // Click signup tab — use the second button in the toggle group
  const toggleBtns = page.locator("button", {
    has: page.locator("text=/^\u0633\u0637\u0628/"),
  });
  const count = await toggleBtns.count();
  console.log("   toggle buttons found:", count);

  // More reliable: click the second button in the toggle group
  const tabContainer = page.locator(".grid.grid-cols-2");
  const signupTab = tabContainer.locator("button").nth(1);
  await signupTab.click();
  await page.waitForTimeout(500);

  // Fill signup form
  await page.fill("#email", "demo2@tamasban.local");
  await page.fill("#password", "Demo1234!");
  await page.screenshot({ path: `${out}/qa-2-signup.png` });
  console.log("2. signup form filled");

  // Submit
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${out}/qa-3-after-submit.png` });

  const bodyText = await page.locator("body").innerText().catch(() => "");
  console.log("3. body:", bodyText.slice(0, 500));
  console.log("   errors:", errors);
  console.log("   URL:", page.url());

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
