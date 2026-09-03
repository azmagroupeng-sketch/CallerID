/* تماس‌بان — service worker آفلاین
 * استراتژی: صفحات (navigate) شبکه اول، با بازگشت به شِل کش‌شده در حالت آفلاین؛
 * دارایی‌های هش‌شده (/assets/*) کش اول. این همین الان نصب‌پذیری را هم ارضا می‌کند.
 */
const CACHE = "tamasban-cache-v1";
const PRECACHE = [
  "/",
  "/__grok/manifest.webmanifest",
  "/__grok/icon-180.png",
  "/favicon.svg",
];

const OFFLINE_HTML = `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0c0d0b" />
    <title>تماس‌بان — آفلاین</title>
  </head>
  <body style="margin:0;background:#0c0d0b;color:#f2f0ea;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;">
    <div style="text-align:center;padding:24px;">
      <div style="font-size:40px;">📶</div>
      <h1 style="font-size:18px;margin:12px 0 6px;">اتصال اینترنت برقرار نیست</h1>
      <p style="font-size:14px;color:#a8a59c;line-height:1.8;margin:0;">
        دفترچهٔ تماس‌بان را بعد از برقراری اتصال دوباره باز کنید.
      </p>
    </div>
  </body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "reload" });
            if (res.ok) await cache.put(url, res);
          } catch {
            /* پیش‌کش ناقص هم نصب را نگه ندارد */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

async function assetFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) {
    try {
      await cache.put(req, res.clone());
    } catch {
      /* فضای کش یا پاسخ ذخیره‌نشدنی */
    }
  }
  return res;
}

async function navigateFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === "basic") {
      try {
        await cache.put("/", res.clone());
      } catch {
        /* ignore */
      }
    }
    return res;
  } catch {
    const shell = await cache.match("/");
    if (shell) return shell;
    return new Response(OFFLINE_HTML, {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(navigateFirst(req));
    return;
  }

  // دارایی‌های هش‌شده: نام ثابت → کش اول. بقیهٔ درخواست‌های GET هم‌ریشه:
  // شبکه اول با کش به‌عنوان پشتیبان.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(assetFirst(req));
  } else {
    event.respondWith(navigateFirst(req));
  }
});