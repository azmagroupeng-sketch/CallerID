import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" className="fill-card" />
      <path
        d="M10.2 12.4c1.8-2 3.6-2.6 5.2-.6l.9 1.1c.5.6.4 1.5-.2 2.1l-.7.7c1.5 2.8 3.2 4.5 6 6l.7-.7c.6-.6 1.5-.7 2.1-.2l1.1.9c2 1.6 1.4 3.4-.6 5.2-1.7 1.5-4 .6-6.8-1.1-2.9-1.8-5.6-4.6-7.4-7.4-1.7-2.8-2.6-5.1-1.1-6.8Z"
        className="fill-primary"
      />
      <path
        d="M20.5 8.5h5v1.4h-5A1.1 1.1 0 0 0 19.4 11v.8h-1.4V11A2.5 2.5 0 0 1 20.5 8.5Z"
        className="fill-primary"
        opacity="0.7"
      />
    </svg>
  );
}
