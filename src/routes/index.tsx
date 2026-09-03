import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardPaste, X } from "lucide-react";
import { toast } from "sonner";
import { CallIntake } from "@/components/call-intake";
import { ContactSummary } from "@/components/contact-row";
import { InstallHint } from "@/components/install-hint";
import { PhonePanel } from "@/components/phone-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { looksLikePhone, parseIranPhone } from "@/lib/phone";
import { useBook } from "@/lib/store";

type Search = { n?: string };

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    n: typeof raw.n === "string" ? raw.n : undefined,
  }),
  component: Home,
});

function Home() {
  const { n } = Route.useSearch();
  const navigate = useNavigate();
  const ready = useBook((s) => s.ready);
  const contacts = useBook((s) => s.contacts);
  const calls = useBook((s) => s.calls);
  const [raw, setRaw] = useState(n ?? "");

  useEffect(() => {
    if (typeof n === "string") setRaw(n);
  }, [n]);

  const parsed = useMemo(() => parseIranPhone(raw), [raw]);
  const hasInput = parsed.digits.length > 0;

  const recent = useMemo(() => {
    return [...contacts]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
  }, [contacts]);

  function lastCall(contactId: string) {
    return calls
      .filter((c) => c.contactId === contactId)
      .sort((a, b) => b.at - a.at)[0];
  }

  function setNumber(value: string, syncUrl = false) {
    setRaw(value);
    if (!syncUrl) return;
    const next = parseIranPhone(value);
    void navigate({
      to: "/",
      search: next.valid ? { n: next.local } : {},
      replace: true,
    });
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const clipped = text.trim();
      if (!clipped) {
        toast.error("کلیپ‌بورد خالی است");
        return;
      }
      if (!looksLikePhone(clipped) && !/\d{8,}/.test(clipped)) {
        toast.error("در کلیپ‌بورد شماره‌ای پیدا نشد");
        return;
      }
      setNumber(clipped, true);
      toast.success("شماره چسبانده شد");
    } catch {
      toast.error("اجازهٔ خواندن کلیپ‌بورد داده نشد. شماره را خودتان بچسبانید.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">تماس تازه</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          شماره را وارد کنید تا بین‌المللی، ساده و لینک واتساپ همین لحظه دیده شود.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Input
            id="phone"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="done"
            placeholder="0912… یا +98…"
            value={raw}
            onChange={(e) => setNumber(e.target.value)}
            onBlur={() => {
              if (parsed.valid) setNumber(parsed.local, true);
            }}
            className="pe-11 text-lg tracking-wide"
            aria-label="شماره تماس"
            suppressHydrationWarning
          />
          {raw ? (
            <button
              type="button"
              className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="پاک کردن شماره"
              onClick={() => setNumber("", true)}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void pasteFromClipboard()}
          className="shrink-0"
        >
          <ClipboardPaste />
          چسباندن
        </Button>
      </div>

      {hasInput && !parsed.valid ? (
        <p className="text-xs text-muted-foreground">
          شماره را کامل کنید — برای ایران باید ده رقم بعد از صفر باشد.
        </p>
      ) : null}

      {parsed.valid ? (
        <div className="rise-in space-y-4">
          <PhonePanel parsed={parsed} />
          {ready ? (
            <CallIntake
              key={parsed.national}
              parsed={parsed}
              onSaved={(contact) =>
                void navigate({
                  to: "/",
                  search: { n: contact.local },
                  replace: true,
                })
              }
            />
          ) : (
            <div className="h-28 rounded-xl bg-card" />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <InstallHint />
          {ready && recent.length > 0 ? (
            <section className="space-y-2">
              <h2 className="text-sm font-medium">آخرین مخاطب‌ها</h2>
              <p className="text-xs text-muted-foreground">
                برای شبیه‌سازی تماس، یکی را انتخاب کنید.
              </p>
              <ul className="space-y-2">
                {recent.map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      className="w-full rounded-xl text-right transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]"
                      onClick={() => setNumber(contact.local, true)}
                    >
                      <ContactSummary
                        contact={contact}
                        lastCall={lastCall(contact.id)}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : ready ? (
            <p className="text-sm leading-6 text-muted-foreground">
              هنوز مخاطبی ندارید. اولین شماره را وارد کنید.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
