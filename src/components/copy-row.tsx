import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyRow({
  label,
  value,
  display,
  hint,
  href,
  hintLtr = false,
}: {
  label: string;
  value: string;
  display?: string;
  hint?: string;
  href?: string;
  hintLtr?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const shown = display ?? value;

  async function onCopy(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("کپی شد");
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("کپی انجام نشد");
    }
  }

  const valueClass = "block truncate text-base font-medium text-foreground";

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${valueClass} underline-offset-4 hover:underline`}
            dir="ltr"
          >
            {shown}
          </a>
        ) : (
          <p className={valueClass} dir="ltr">
            {shown}
          </p>
        )}
        {hint ? (
          <p
            className="mt-0.5 text-xs text-muted-foreground"
            dir={hintLtr ? "ltr" : undefined}
          >
            {hint}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 shrink-0"
        onClick={onCopy}
        aria-label={`کپی ${label}`}
      >
        {copied ? (
          <Check className="size-4 text-ok" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  );
}
