import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function authErrorText(message: string | undefined): string {
  const raw = message ?? "";
  if (/invalid email or password/i.test(raw)) {
    return "ایمیل یا رمز عبور اشتباه است";
  }
  if (/already exists|already registered|user_already_exists/i.test(raw)) {
    return "این ایمیل قبلاً ثبت شده — وارد شوید";
  }
  if (/at least 8|too short|min_password/i.test(raw)) {
    return "رمز عبور باید حداقل ۸ نویسه باشد";
  }
  if (/invalid email/i.test(raw)) {
    return "ایمیل معتبر نیست";
  }
  return raw ? `خطا: ${raw}` : "عملیات ناموفق بود — دوباره تلاش کنید";
}

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
        در حال بررسی نشست…
      </div>
    );
  }
  if (user) {
    return <Navigate to="/" />;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "عضو تیم",
        });
        if (error) throw new Error(authErrorText(error.message));
      } else {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (error) throw new Error(authErrorText(error.message));
      }
      // useSession updates and the <Navigate to="/" /> above takes over.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "عملیات ناموفق بود");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Mark />
          <h1 className="text-lg font-semibold tracking-tight">
            {mode === "signin" ? "ورود به تماس‌بان" : "ساخت حساب تماس‌بان"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            دفترچهٔ تماس تیمی است: همهٔ اعضا اطلاعات مشترک را می‌بینند و کامل
            می‌کنند.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-card p-1 ring-1 ring-border">
          {(
            [
              ["signin", "ورود"],
              ["signup", "ثبت‌نام"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "h-10 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-[var(--motion-quick)]",
                mode === value
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
        >
          {mode === "signup" ? (
            <div className="space-y-1.5">
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="مثلاً مریم رضایی"
              />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              dir="ltr"
              type="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="text-left"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">رمز عبور</Label>
            <Input
              id="password"
              dir="ltr"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              className="text-left"
            />
            {mode === "signup" ? (
              <p className="text-xs text-muted-foreground">
                حداقل ۸ نویسه
              </p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy
              ? "لطفاً صبر کنید…"
              : mode === "signin"
                ? "ورود"
                : "ساخت حساب و ورود"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
          هر عضو تیم با ایمیل خودش وارد می‌شود؛ دفترچه یکی است.
        </p>
      </div>
    </div>
  );
}
