import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatLocal, r as kindLabel, t as formatE164 } from "./phone-CG57bSRI.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as MessageCircle, r as Phone, s as Copy, u as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as cn, o as useBook } from "./router-CdA9Lyn8.mjs";
import { a as formatJalaliRelative, i as formatJalaliDateTime } from "./contact-row-NkS5TyGZ.mjs";
import { t as Button } from "./input-D-ATWlHF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-CXInE3v5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CallTimeline({ calls, empty }) {
	const removeCall = useBook((s) => s.removeCall);
	if (calls.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: empty ?? "هنوز علت تماسی ثبت نشده."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative space-y-5 border-r border-border pr-4",
		children: calls.map((call) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "absolute -right-[21px] top-1.5 size-2 rounded-full bg-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatJalaliRelative(call.at),
							" · ",
							formatJalaliDateTime(call.at)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-6 text-foreground",
						children: call.reason
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void removeCall(call.id).catch((err) => toast.error(err instanceof Error ? err.message : "حذف ناموفق بود")),
					className: "shrink-0 text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline",
					children: "حذف"
				})]
			})]
		}, call.id))
	});
}
function CopyRow({ label, value, display, hint, href, hintLtr = false }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const shown = display ?? value;
	async function onCopy(event) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: label
				}),
				href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					target: "_blank",
					rel: "noopener noreferrer",
					className: `${valueClass} underline-offset-4 hover:underline`,
					dir: "ltr",
					children: shown
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: valueClass,
					dir: "ltr",
					children: shown
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					dir: hintLtr ? "ltr" : void 0,
					children: hint
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			className: "size-10 shrink-0",
			onClick: onCopy,
			"aria-label": `کپی ${label}`,
			children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-ok" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-primary/15 text-primary",
		muted: "bg-card text-muted-foreground ring-1 ring-border",
		new: "bg-warn/15 text-warn",
		known: "bg-ok/15 text-ok"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function PhonePanel({ parsed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-hidden rounded-xl bg-card ring-1 ring-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "شماره این تماس"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "muted",
					children: kindLabel(parsed.kind)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
				label: "شماره بین‌المللی",
				value: parsed.e164,
				hint: formatE164(parsed.e164),
				hintLtr: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
				label: "شماره ساده",
				value: parsed.local,
				hint: formatLocal(parsed.local),
				hintLtr: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
				label: "لینک واتساپ",
				value: parsed.waUrl,
				display: `wa.me/${parsed.wa}`,
				href: parsed.waUrl,
				hint: "با زدن لینک، گفتگو در واتساپ باز می‌شود"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: parsed.waUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), "واتساپ"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: parsed.telUrl,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), "تماس"]
					})
				})]
			}),
			parsed.kind === "landline" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-t border-border px-4 py-2.5 text-xs leading-5 text-muted-foreground",
				children: "واتساپ معمولاً روی شمارهٔ ثابت کار نمی‌کند؛ لینک برای همین شماره ساخته شده."
			}) : null
		]
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex min-h-24 w-full rounded-lg bg-card px-3 py-3 text-base text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] placeholder:text-muted-foreground", "focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Textarea as i, CallTimeline as n, PhonePanel as r, Badge as t };
