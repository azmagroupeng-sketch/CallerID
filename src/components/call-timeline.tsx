import { toast } from "sonner";
import { formatJalaliDateTime, formatJalaliRelative } from "@/lib/jalali";
import type { CallEntry } from "@/lib/store";
import { useBook } from "@/lib/store";

export function CallTimeline({
  calls,
  empty,
}: {
  calls: CallEntry[];
  empty?: string;
}) {
  const removeCall = useBook((s) => s.removeCall);

  if (calls.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {empty ?? "هنوز علت تماسی ثبت نشده."}
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 border-r border-border pr-4">
      {calls.map((call) => (
        <li key={call.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -right-[21px] top-1.5 size-2 rounded-full bg-primary"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {formatJalaliRelative(call.at)} · {formatJalaliDateTime(call.at)}
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground">{call.reason}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                void removeCall(call.id).catch((err: unknown) =>
                  toast.error(
                    err instanceof Error ? err.message : "حذف ناموفق بود",
                  ),
                )
              }
              className="shrink-0 text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
