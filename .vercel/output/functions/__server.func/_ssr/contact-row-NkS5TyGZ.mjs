import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatLocal, s as toPersianDigits } from "./phone-CG57bSRI.mjs";
import { l as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as initials, i as displayName, l as cn } from "./router-CdA9Lyn8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-row-NkS5TyGZ.js
var import_jsx_runtime = require_jsx_runtime();
var MONTHS = [
	"فروردین",
	"اردیبهشت",
	"خرداد",
	"تیر",
	"مرداد",
	"شهریور",
	"مهر",
	"آبان",
	"آذر",
	"دی",
	"بهمن",
	"اسفند"
];
var WEEKDAYS = [
	"یکشنبه",
	"دوشنبه",
	"سه‌شنبه",
	"چهارشنبه",
	"پنجشنبه",
	"جمعه",
	"شنبه"
];
function div(a, b) {
	return ~~(a / b);
}
/** Gregorian Y-M-D → Jalali Y-M-D (1-indexed months). */
function gregorianToJalali(gy, gm, gd) {
	const g_d_m = [
		0,
		31,
		59,
		90,
		120,
		151,
		181,
		212,
		243,
		273,
		304,
		334
	];
	const gy2 = gm > 2 ? gy + 1 : gy;
	let days = 355666 + 365 * gy + div(gy2 + 3, 4) - div(gy2 + 99, 100) + div(gy2 + 399, 400) + gd + g_d_m[gm - 1];
	let jy = -1595 + 33 * div(days, 12053);
	days %= 12053;
	jy += 4 * div(days, 1461);
	days %= 1461;
	if (days > 365) {
		jy += div(days - 1, 365);
		days = (days - 1) % 365;
	}
	const jm = days < 186 ? 1 + div(days, 31) : 7 + div(days - 186, 30);
	const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
	return [
		jy,
		jm,
		jd
	];
}
function parts(ts) {
	const d = new Date(ts);
	const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
	return {
		d,
		jy,
		jm,
		jd
	};
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function formatJalaliDate(ts) {
	const { jy, jm, jd } = parts(ts);
	return `${toPersianDigits(jd)} ${MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}
function formatJalaliDateTime(ts) {
	const { d, jy, jm, jd } = parts(ts);
	const weekday = WEEKDAYS[d.getDay()] ?? "";
	const time = `${toPersianDigits(pad(d.getHours()))}:${toPersianDigits(pad(d.getMinutes()))}`;
	return `${weekday} ${toPersianDigits(jd)} ${MONTHS[jm - 1]} ${toPersianDigits(jy)}، ساعت ${time}`;
}
function formatJalaliRelative(ts) {
	const now = /* @__PURE__ */ new Date();
	const d = new Date(ts);
	const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const startD = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	const diffDays = Math.round((startNow - startD) / 864e5);
	if (diffDays === 0) return "امروز";
	if (diffDays === 1) return "دیروز";
	if (diffDays > 1 && diffDays < 7) return `${toPersianDigits(diffDays)} روز پیش`;
	return formatJalaliDate(ts);
}
function ContactAvatar({ contact, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: size === "sm" ? "flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium" : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-base font-medium",
		children: initials(contact)
	});
}
function ContactSummary({ contact, lastCall, className, showChevron = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3 rounded-xl bg-card px-3 py-3 ring-1 ring-border", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactAvatar, { contact }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: displayName(contact)
						}), lastCall ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 text-xs text-muted-foreground",
							children: formatJalaliRelative(lastCall.at)
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 truncate text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							dir: "ltr",
							children: formatLocal(contact.local)
						}), contact.company ? ` · ${contact.company}` : ""]
					}),
					lastCall ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: lastCall.reason
					}) : null
				]
			}),
			showChevron ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4 shrink-0 text-muted-foreground" }) : null
		]
	});
}
function ContactRow({ contact, lastCall }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/book/$id",
		params: { id: contact.id },
		className: "block rounded-xl transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactSummary, {
			contact,
			lastCall,
			showChevron: true
		})
	});
}
//#endregion
export { formatJalaliRelative as a, formatJalaliDateTime as i, ContactRow as n, gregorianToJalali as o, ContactSummary as r, ContactAvatar as t };
