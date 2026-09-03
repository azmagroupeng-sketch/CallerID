import { useEffect, useLayoutEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookUser, PhoneIncoming } from "lucide-react";
import { Mark } from "@/components/mark";
import { Toaster } from "@/components/ui/sonner";
import { SIGN_IN_PATH, RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { useBook } from "@/lib/store";

const TABS = [
  { to: "/", label: "تماس تازه", icon: PhoneIncoming },
  { to: "/book", label: "دفترچه", icon: BookUser },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrate = useBook((s) => s.hydrate);
  const refresh = useBook((s) => s.refresh);
  const ready = useBook((s) => s.ready);
  const error = useBook((s) => s.error);
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useLayoutEffect(() => {
    void hydrate();
  }, [hydrate, user]);

  // همگام‌سازی چنددستگاهی: با بازگشت به برنامه یا هر ۳۰ ثانیه، فهرست تازه
  // می‌شود تا تغییرات اعضای دیگر دیده شود.
  useEffect(() => {
    if (!user) return;
    const pull = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", pull);
    window.addEventListener("focus", pull);
    const timer = window.setInterval(pull, 30_000);
    return () => {
      document.removeEventListener("visibilitychange", pull);
      window.removeEventListener("focus", pull);
      window.clearInterval(timer);
    };
  }, [user, refresh]);

  if (pathname === SIGN_IN_PATH) {
    return (
      <div className="min-h-dvh bg-background">
        {children}
        <Toaster />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
        در حال بررسی نشست…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-background">
        <RedirectToSignIn />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground md:flex md:justify-center">
      <div
        className={cn(
          "relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden",
          "md:max-w-[390px] md:ring-1 md:ring-border",
        )}
      >
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-5 py-3.5 backdrop-blur-md">
          <Mark />
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold leading-tight tracking-tight">
              تماس‌بان
            </p>
            <p className="text-xs text-muted-foreground">دفترچهٔ تیمی تماس‌ها</p>
          </div>
          <UserButton />
        </header>

        {!ready && error ? (
          <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2.5 ring-1 ring-border">
            <p className="text-xs leading-5 text-muted-foreground">{error}</p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="shrink-0 text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              تلاش دوباره
            </button>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto px-5 pb-28 pt-5">{children}</main>

        <nav
          className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
          aria-label="ناوبری اصلی"
        >
          <ul className="grid grid-cols-2 gap-1">
            {TABS.map((tab) => {
              const active =
                tab.to === "/"
                  ? pathname === "/"
                  : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
              const Icon = tab.icon;
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-[var(--motion-quick)]",
                      active
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <Toaster />
    </div>
  );
}
