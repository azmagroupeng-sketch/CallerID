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

  // 1. Load login page
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${out}/qa-1-login.png` });
  console.log("1. login page loaded");

  // 2. Sign up (mode switch + fill + submit)
  const signupBtn = page.getByText("ثبت\u200cنام");
  if (await signupBtn.isVisible({ timeout: 3000 })) {
    await signupBtn.click();
    await page.waitForTimeout(500);
  }
  await page.fill("#email", "demo@tamasban.local");
  await page.fill("#password", "Demo1234!");
  await page.screenshot({ path: `${out}/qa-2-signup-filled.png` });
  console.log("2. signup form filled");

  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${out}/qa-3-after-submit.png` });

  const bodyText = await page.locator("body").innerText().catch(() => "");
  console.log("3. body after submit:", bodyText.slice(0, 400));
  console.log("   errors:", errors);

  const url = page.url();
  console.log("   current URL:", url);

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
