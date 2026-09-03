import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CallTimeline } from "@/components/call-timeline";
import { ContactAvatar } from "@/components/contact-row";
import { formatJalaliDateTime } from "@/lib/jalali";
import { toPersianDigits, type ParsedPhone } from "@/lib/phone";
import { displayName, useBook, type Contact } from "@/lib/store";

export function CallIntake({
  parsed,
  onSaved,
}: {
  parsed: ParsedPhone;
  onSaved?: (contact: Contact) => void;
}) {
  const contacts = useBook((s) => s.contacts);
  const existing = contacts.find((c) => c.national === parsed.national);

  if (!existing) {
    return <NewCallerForm parsed={parsed} onSaved={onSaved} />;
  }
  return <ReturningCallerForm contact={existing} onSaved={onSaved} />;
}

function NewCallerForm({
  parsed,
  onSaved,
}: {
  parsed: ParsedPhone;
  onSaved?: (contact: Contact) => void;
}) {
  const saveNewContact = useBook((s) => s.saveNewContact);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!lastName.trim()) {
      toast.error("نام خانوادگی را وارد کنید");
      return;
    }
    if (!reason.trim()) {
      toast.error("علت تماس را بنویسید");
      return;
    }
    try {
      const contact = await saveNewContact({
        national: parsed.national,
        lastName,
        firstName,
        company,
        reason,
      });
      toast.success("مخاطب و علت تماس ثبت شد");
      onSaved?.(contact);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl bg-card px-4 py-3.5 ring-1 ring-border">
        <Badge variant="new" className="mt-0.5 shrink-0">
          اولین تماس
        </Badge>
        <p className="text-sm leading-6 text-muted-foreground">
          این شماره قبلاً تماس نگرفته. نام خانوادگی، شرکت و علت تماس را ثبت کنید.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
      >
        <Field
          id="last-name"
          label="نام خانوادگی"
          value={lastName}
          onChange={setLastName}
          required
          autoComplete="family-name"
        />
        <Field
          id="first-name"
          label="نام"
          value={firstName}
          onChange={setFirstName}
          autoComplete="given-name"
          hint="اختیاری"
        />
        <Field
          id="company"
          label="شرکت"
          value={company}
          onChange={setCompany}
          autoComplete="organization"
          hint="اختیاری"
        />
        <div className="space-y-1.5">
          <Label htmlFor="reason">علت تماس</Label>
          <Textarea
            id="reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="مثلاً پیگیری قرارداد، استعلام قیمت، هماهنگی جلسه"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          ثبت تماس
        </Button>
      </form>
    </section>
  );
}

function ReturningCallerForm({
  contact,
  onSaved,
}: {
  contact: Contact;
  onSaved?: (contact: Contact) => void;
}) {
  const allCalls = useBook((s) => s.calls);
  const addCall = useBook((s) => s.addCall);
  const calls = useMemo(
    () =>
      allCalls
        .filter((c) => c.contactId === contact.id)
        .slice()
        .sort((a, b) => b.at - a.at),
    [allCalls, contact.id],
  );
  const last = calls[0];
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!reason.trim()) {
      toast.error("علت تماس جدید را بنویسید");
      return;
    }
    try {
      await addCall(contact.id, reason);
      setReason("");
      toast.success("علت تماس تازه ثبت شد");
      onSaved?.(contact);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl bg-card px-4 py-3.5 ring-1 ring-border">
        <div className="flex items-center gap-3">
          <ContactAvatar contact={contact} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium">{displayName(contact)}</p>
              <Badge variant="known">قبلاً تماس گرفته</Badge>
            </div>
            {contact.company ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {contact.company}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              {toPersianDigits(calls.length)} تماس ثبت‌شده
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() =>
            void navigate({ to: "/book/$id", params: { id: contact.id } })
          }
        >
          مشاهده پرونده کامل
        </button>
      </div>

      {last ? (
        <div className="rounded-xl bg-card px-4 py-3.5 ring-1 ring-border">
          <p className="text-xs text-muted-foreground">آخرین علت تماس</p>
          <p className="mt-1 text-sm font-medium leading-6">{last.reason}</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {formatJalaliDateTime(last.at)}
          </p>
        </div>
      ) : null}

      <form
        onSubmit={submit}
        className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
      >
        <div className="space-y-1.5">
          <Label htmlFor="new-reason">علت تماس جدید</Label>
          <Textarea
            id="new-reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="این بار برای چه موضوعی تماس گرفت؟"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          ثبت تماس تازه
        </Button>
      </form>

      {calls.length > 1 ? (
        <div className="rounded-xl bg-card px-4 py-4 ring-1 ring-border">
          <p className="mb-4 text-sm font-medium">سابقهٔ تماس‌ها</p>
          <CallTimeline calls={calls} />
        </div>
      ) : null}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      <Input
        id={id}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
