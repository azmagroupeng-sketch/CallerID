import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { ContactRow } from "@/components/contact-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportBookToExcel } from "@/lib/excel";
import { toAsciiDigits, toPersianDigits } from "@/lib/phone";
import { displayName, useBook } from "@/lib/store";

export const Route = createFileRoute("/book/")({
  component: BookPage,
});

function BookPage() {
  const ready = useBook((s) => s.ready);
  const contacts = useBook((s) => s.contacts);
  const calls = useBook((s) => s.calls);
  const [query, setQuery] = useState("");
  const [exporting, setExporting] = useState(false);

  async function downloadExcel() {
    if (exporting) return;
    setExporting(true);
    try {
      await exportBookToExcel(contacts, calls);
      toast.success("فایل اکسل ساخته شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ساخت فایل ناموفق بود");
    } finally {
      setExporting(false);
    }
  }

  const filtered = useMemo(() => {
    const q = toAsciiDigits(query).trim().toLowerCase();
    const list = [...contacts].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return list;
    const compact = q.replace(/\s/g, "");
    return list.filter((c) => {
      const hay =
        `${displayName(c)} ${c.company} ${c.local} ${c.e164} ${c.national}`.toLowerCase();
      return hay.includes(q) || hay.replace(/\s/g, "").includes(compact);
    });
  }, [contacts, query]);

  function lastCall(contactId: string) {
    return calls
      .filter((c) => c.contactId === contactId)
      .sort((a, b) => b.at - a.at)[0];
  }

  if (!ready) {
    return (
      <div className="space-y-3">
        <div className="h-11 rounded-lg bg-card" />
        <div className="h-16 rounded-xl bg-card" />
        <div className="h-16 rounded-xl bg-card" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight">دفترچه</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {contacts.length === 0
              ? "مخاطبی ثبت نشده."
              : `${toPersianDigits(contacts.length)} مخاطب · مشترک بین همهٔ اعضا`}
          </p>
        </div>
        {contacts.length > 0 ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            disabled={exporting}
            onClick={() => void downloadExcel()}
          >
            <FileDown />
            {exporting ? "در حال ساخت…" : "خروجی اکسل"}
          </Button>
        ) : null}
      </div>

      {contacts.length > 0 ? (
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو نام، شرکت یا شماره"
          aria-label="جستجو در دفترچه"
        />
      ) : null}

      {filtered.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {contacts.length === 0
            ? "از صفحهٔ تماس تازه اولین شماره را ثبت کنید."
            : "نتیجه‌ای برای این جستجو نیست."}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((contact) => (
            <li key={contact.id}>
              <ContactRow contact={contact} lastCall={lastCall(contact.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
