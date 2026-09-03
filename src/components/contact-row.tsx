import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { formatJalaliRelative } from "@/lib/jalali";
import { formatLocal } from "@/lib/phone";
import {
  displayName,
  initials,
  type Contact,
  type CallEntry,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export function ContactAvatar({
  contact,
  size = "md",
}: {
  contact: Contact;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={
        size === "sm"
          ? "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium"
          : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-base font-medium"
      }
    >
      {initials(contact)}
    </span>
  );
}

export function ContactSummary({
  contact,
  lastCall,
  className,
  showChevron = false,
}: {
  contact: Contact;
  lastCall?: CallEntry;
  className?: string;
  showChevron?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl bg-card px-3 py-3 ring-1 ring-border",
        className,
      )}
    >
      <ContactAvatar contact={contact} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium">{displayName(contact)}</p>
          {lastCall ? (
            <p className="shrink-0 text-xs text-muted-foreground">
              {formatJalaliRelative(lastCall.at)}
            </p>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          <span dir="ltr">{formatLocal(contact.local)}</span>
          {contact.company ? ` · ${contact.company}` : ""}
        </p>
        {lastCall ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {lastCall.reason}
          </p>
        ) : null}
      </div>
      {showChevron ? (
        <ChevronLeft className="size-4 shrink-0 text-muted-foreground" />
      ) : null}
    </div>
  );
}

export function ContactRow({
  contact,
  lastCall,
}: {
  contact: Contact;
  lastCall?: CallEntry;
}) {
  return (
    <Link
      to="/book/$id"
      params={{ id: contact.id }}
      className="block rounded-xl transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]"
    >
      <ContactSummary contact={contact} lastCall={lastCall} showChevron />
    </Link>
  );
}
