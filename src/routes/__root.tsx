import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import { PwaRegister } from "@/components/pwa-register";
import appCss from "../styles.css?url";

const APP_NAME = "تماس‌بان";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0c0d0b" },
      {
        name: "description",
        content:
          "بعد از هر تماس، شماره بین‌المللی و ساده، لینک واتساپ و سابقهٔ شمسی را ببینید.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  notFoundComponent: () => (
    <div className="px-1 py-16 text-center">
      <h1 className="text-lg font-semibold">این صفحه پیدا نشد</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        مسیر اشتباه است یا مخاطب حذف شده.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        بازگشت به تماس تازه
      </Link>
    </div>
  ),
  component: () => (
    <html lang="fa" dir="rtl" className="dark antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <PwaRegister />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
