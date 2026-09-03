import { useLayoutEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "tamasban-hint-v1";

export function InstallHint() {
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    try {
      setOpen(localStorage.getItem(KEY) !== "1");
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <aside className="relative rounded-xl bg-card px-4 py-3.5 ring-1 ring-border">
      <button
        type="button"
        className="absolute left-2 top-2 flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="بستن راهنما"
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          setOpen(false);
        }}
      >
        <X className="size-4" />
      </button>
      <p className="text-sm font-medium">بعد از هر تماس</p>
      <p className="mt-1.5 pl-8 text-xs leading-6 text-muted-foreground">
        مرورگر اجازهٔ دیدن تماس‌های ورودی گوشی را ندارد. شماره را از فهرست تماس
        کپی کنید و اینجا بچسبانید. برای دسترسی سریع، این صفحه را به صفحهٔ اصلی
        اندروید اضافه کنید.
      </p>
    </aside>
  );
}
