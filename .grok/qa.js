const { chromium } = require('playwright');
const { mkdirSync } = require('fs');

async function main() {
  const out = 'screenshots';
  mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
    args: ['--no-sandbox'],
  });

  // Desktop
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  desktop.on('pageerror', (e) => console.error('page error:', e.message));
  await desktop.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 20000 });
  await desktop.waitForTimeout(2000);
  await desktop.screenshot({ path: `${out}/qa-login.png`, fullPage: false });
  console.log('screenshot: qa-login.png');

  // Sign up a test user
  try {
    const signupTab = desktop.locator('button:has-text("ثبت‌نام")');
    if (await signupTab.isVisible({ timeout: 2000 })) {
      await signupTab.click();
      await desktop.waitForTimeout(500);
    }
    await desktop.fill('#email', 'test@tamasban.local');
    await desktop.fill('#password', 'Test1234!');
    const submitBtn = desktop.locator('button[type="submit"]');
    await submitBtn.click();
    await desktop.waitForTimeout(3000);
    await desktop.screenshot({ path: `${out}/qa-after-signup.png`, fullPage: false });
    console.log('screenshot: qa-after-signup.png');
  } catch (e) {
    console.error('signup error:', e.message);
    await desktop.screenshot({ path: `${out}/qa-error.png`, fullPage: false });
  }

  // Check if we landed on the home page (contacts list or empty state)
  const bodyText = await desktop.locator('body').innerText().catch(() => '');
  console.log('body preview:', bodyText.slice(0, 200));

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 20000 });
  await mobile.waitForTimeout(2000);
  await mobile.screenshot({ path: `${out}/qa-mobile.png`, fullPage: false });
  console.log('screenshot: qa-mobile.png');

  await browser.close();
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
