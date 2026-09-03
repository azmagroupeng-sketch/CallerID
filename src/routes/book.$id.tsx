import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CallTimeline } from "@/components/call-timeline";
import { ContactAvatar } from "@/components/contact-row";
import { PhonePanel } from "@/components/phone-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseIranPhone, toPersianDigits } from "@/lib/phone";
import { displayName, useBook, type Contact } from "@/lib/store";

export const Route = createFileRoute("/book/$id")({
  component: ContactPage,
});

function ContactPage() {
  const { id } = Route.useParams();
  const ready = useBook((s) => s.ready);
  const contacts = useBook((s) => s.contacts);
  const allCalls = useBook((s) => s.calls);
  const contact = contacts.find((c) => c.id === id);
  const calls = useMemo(
    () =>
      allCalls
        .filter((c) => c.contactId === id)
        .slice()
        .sort((a, b) => b.at - a.at),
    [allCalls, id],
  );

  if (!ready) {
    return <div className="h-40 rounded-xl bg-card" />;
  }

  if (!contact) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-lg font-semibold">مخاطب پیدا نشد</h1>
        <p className="mt-2 text-sm text-muted-foreground">شاید حذف شده باشد.</p>
        <Link
          to="/book"
          className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          بازگشت به دفترچه
        </Link>
      </div>
    );
  }

  const parsed = parseIranPhone(contact.local);

  return (
    <div className="space-y-5">
      <Link
        to="/book"
        className="inline-flex h-10 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        دفترچه
      </Link>

      <div className="flex items-center gap-3">
        <ContactAvatar contact={contact} />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {displayName(contact)}
          </h1>
          <p className="text-xs text-muted-foreground">
            {toPersianDigits(calls.length)} تماس ثبت‌شده
          </p>
        </div>
      </div>

      <PhonePanel parsed={parsed} />
      <NewCallForm contact={contact} />

      <div className="rounded-xl bg-card px-4 py-4 ring-1 ring-border">
        <p className="mb-4 text-sm font-medium">سابقه با تاریخ شمسی</p>
        <CallTimeline calls={calls} />
      </div>

      <EditContactForm contact={contact} />
      <DeleteContactButton contact={contact} />
    </div>
  );
}

function NewCallForm({ contact }: { contact: Contact }) {
  const addCall = useBook((s) => s.addCall);
  const [reason, setReason] = useState("");

  async function saveCall(event: React.FormEvent) {
    event.preventDefault();
    if (!reason.trim()) {
      toast.error("علت تماس را بنویسید");
      return;
    }
    try {
      await addCall(contact.id, reason);
      setReason("");
      toast.success("علت تماس ثبت شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
    }
  }

  return (
    <form
      onSubmit={saveCall}
      className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
    >
      <div className="space-y-1.5">
        <Label htmlFor="detail-reason">علت تماس جدید</Label>
        <Textarea
          id="detail-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="این بار برای چه موضوعی تماس گرفت؟"
        />
      </div>
      <Button type="submit" className="w-full">
        ثبت تماس تازه
      </Button>
      <Button type="button" variant="secondary" className="w-full" asChild>
        <Link to="/" search={{ n: contact.local }}>
          باز کردن در تماس تازه
        </Link>
      </Button>
    </form>
  );
}

function EditContactForm({ contact }: { contact: Contact }) {
  const updateContact = useBook((s) => s.updateContact);
  const [lastName, setLastName] = useState(contact.lastName);
  const [firstName, setFirstName] = useState(contact.firstName);
  const [company, setCompany] = useState(contact.company);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!lastName.trim()) {
      toast.error("نام خانوادگی را وارد کنید");
      return;
    }
    try {
      await updateContact(contact.id, { lastName, firstName, company });
      toast.success("اطلاعات مخاطب ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    }
  }

  return (
    <form
      onSubmit={saveProfile}
      className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
    >
      <p className="text-sm font-medium">ویرایش مخاطب</p>
      <div className="space-y-1.5">
        <Label htmlFor="edit-last">نام خانوادگی</Label>
        <Input
          id="edit-last"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-first">نام</Label>
        <Input
          id="edit-first"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="edit-company">شرکت</Label>
        <Input
          id="edit-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <Button type="submit" variant="secondary" className="w-full">
        ذخیره تغییرات
      </Button>
    </form>
  );
}

function DeleteContactButton({ contact }: { contact: Contact }) {
  const removeContact = useBook((s) => s.removeContact);
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await removeContact(contact.id);
      toast.success("مخاطب حذف شد");
      void navigate({ to: "/book" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق بود");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={onDelete}
    >
      {confirmDelete ? "تأیید حذف مخاطب و سابقه" : "حذف مخاطب"}
    </Button>
  );
}
