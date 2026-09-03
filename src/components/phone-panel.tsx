import { MessageCircle, Phone } from "lucide-react";
import { CopyRow } from "@/components/copy-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatE164,
  formatLocal,
  kindLabel,
  type ParsedPhone,
} from "@/lib/phone";

export function PhonePanel({ parsed }: { parsed: ParsedPhone }) {
  return (
    <section className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-medium">شماره این تماس</p>
        <Badge variant="muted">{kindLabel(parsed.kind)}</Badge>
      </div>
      <div className="h-px bg-border" />
      <CopyRow
        label="شماره بین‌المللی"
        value={parsed.e164}
        hint={formatE164(parsed.e164)}
        hintLtr
      />
      <div className="h-px bg-border" />
      <CopyRow
        label="شماره ساده"
        value={parsed.local}
        hint={formatLocal(parsed.local)}
        hintLtr
      />
      <div className="h-px bg-border" />
      <CopyRow
        label="لینک واتساپ"
        value={parsed.waUrl}
        display={`wa.me/${parsed.wa}`}
        href={parsed.waUrl}
        hint="با زدن لینک، گفتگو در واتساپ باز می‌شود"
      />
      <div className="flex gap-2 p-3">
        <Button asChild className="min-w-0 flex-1">
          <a
            href={parsed.waUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
            واتساپ
          </a>
        </Button>
        <Button asChild variant="secondary" className="min-w-0 flex-1">
          <a href={parsed.telUrl}>
            <Phone />
            تماس
          </a>
        </Button>
      </div>
      {parsed.kind === "landline" ? (
        <p className="border-t border-border px-4 py-2.5 text-xs leading-5 text-muted-foreground">
          واتساپ معمولاً روی شمارهٔ ثابت کار نمی‌کند؛ لینک برای همین شماره ساخته شده.
        </p>
      ) : null}
    </section>
  );
}
