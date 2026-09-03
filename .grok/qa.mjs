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

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  desktop.on("pageerror", (e) => errors.push(e.message));

  await desktop.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await desktop.waitForTimeout(3000);
  await desktop.screenshot({ path: `${out}/qa-login.png`, fullPage: false });
  console.log("screenshot: qa-login.png");

  // Sign up
  try {
    const signupTab = desktop.locator('button:has-text("ثبت\u200cنام")');
    if (await signupTab.isVisible({ timeout: 3000 })) {
      await signupTab.click();
      await desktop.waitForTimeout(500);
    }
    await desktop.fill("#email", "test@tamasban.local");
    await desktop.fill("#password", "Test1234!");
    await desktop.locator('button[type="submit"]').click();
    await desktop.waitForTimeout(4000);
    await desktop.screenshot({ path: `${out}/qa-after-signup.png`, fullPage: false });
    console.log("screenshot: qa-after-signup.png");
  } catch (e) {
    console.error("signup error:", e.message);
    await desktop.screenshot({ path: `${out}/qa-error.png`, fullPage: false });
  }

  const bodyText = await desktop.locator("body").innerText().catch(() => "");
  console.log("body preview:", bodyText.slice(0, 300));
  console.log("page errors:", errors);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: `${out}/qa-mobile.png`, fullPage: false });
  console.log("screenshot: qa-mobile.png");

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
