import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as parseIranPhone, i as looksLikePhone, s as toPersianDigits } from "./phone-CG57bSRI.mjs";
import { c as ClipboardPaste, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as displayName, o as useBook, r as Route$5 } from "./router-CdA9Lyn8.mjs";
import { i as formatJalaliDateTime, r as ContactSummary, t as ContactAvatar } from "./contact-row-NkS5TyGZ.mjs";
import { n as Input, t as Button } from "./input-D-ATWlHF.mjs";
import { i as Textarea, n as CallTimeline, r as PhonePanel, t as Badge } from "./textarea-CXInE3v5.mjs";
import { t as Label } from "./label-2gHoGVxj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DX0XxxF-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CallIntake({ parsed, onSaved }) {
	const existing = useBook((s) => s.contacts).find((c) => c.national === parsed.national);
	if (!existing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCallerForm, {
		parsed,
		onSaved
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturningCallerForm, {
		contact: existing,
		onSaved
	});
}
function NewCallerForm({ parsed, onSaved }) {
	const saveNewContact = useBook((s) => s.saveNewContact);
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	async function submit(event) {
		event.preventDefault();
		if (!lastName.trim()) {
			toast.error("نام خانوادگی را وارد کنید");
			return;
		}
		if (!reason.trim()) {
			toast.error("علت تماس را بنویسید");
			return;
		}
		try {
			const contact = await saveNewContact({
				national: parsed.national,
				lastName,
				firstName,
				company,
				reason
			});
			toast.success("مخاطب و علت تماس ثبت شد");
			onSaved?.(contact);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 rounded-xl bg-card px-4 py-3.5 ring-1 ring-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "new",
				className: "mt-0.5 shrink-0",
				children: "اولین تماس"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-6 text-muted-foreground",
				children: "این شماره قبلاً تماس نگرفته. نام خانوادگی، شرکت و علت تماس را ثبت کنید."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3 rounded-xl bg-card p-4 ring-1 ring-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "last-name",
					label: "نام خانوادگی",
					value: lastName,
					onChange: setLastName,
					required: true,
					autoComplete: "family-name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "first-name",
					label: "نام",
					value: firstName,
					onChange: setFirstName,
					autoComplete: "given-name",
					hint: "اختیاری"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "company",
					label: "شرکت",
					value: company,
					onChange: setCompany,
					autoComplete: "organization",
					hint: "اختیاری"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "reason",
						children: "علت تماس"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "reason",
						required: true,
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "مثلاً پیگیری قرارداد، استعلام قیمت، هماهنگی جلسه"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					size: "lg",
					children: "ثبت تماس"
				})
			]
		})]
	});
}
function ReturningCallerForm({ contact, onSaved }) {
	const allCalls = useBook((s) => s.calls);
	const addCall = useBook((s) => s.addCall);
	const calls = (0, import_react.useMemo)(() => allCalls.filter((c) => c.contactId === contact.id).slice().sort((a, b) => b.at - a.at), [allCalls, contact.id]);
	const last = calls[0];
	const [reason, setReason] = (0, import_react.useState)("");
	const navigate = useNavigate();
	async function submit(event) {
		event.preventDefault();
		if (!reason.trim()) {
			toast.error("علت تماس جدید را بنویسید");
			return;
		}
		try {
			await addCall(contact.id, reason);
			setReason("");
			toast.success("علت تماس تازه ثبت شد");
			onSaved?.(contact);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-4 py-3.5 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactAvatar, { contact }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: displayName(contact)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "known",
									children: "قبلاً تماس گرفته"
								})]
							}),
							contact.company ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: contact.company
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [toPersianDigits(calls.length), " تماس ثبت‌شده"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 text-xs font-medium text-foreground underline-offset-4 hover:underline",
					onClick: () => void navigate({
						to: "/book/$id",
						params: { id: contact.id }
					}),
					children: "مشاهده پرونده کامل"
				})]
			}),
			last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-4 py-3.5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "آخرین علت تماس"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium leading-6",
						children: last.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-muted-foreground",
						children: formatJalaliDateTime(last.at)
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-3 rounded-xl bg-card p-4 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "new-reason",
						children: "علت تماس جدید"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "new-reason",
						required: true,
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "این بار برای چه موضوعی تماس گرفت؟"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					size: "lg",
					children: "ثبت تماس تازه"
				})]
			}),
			calls.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-4 py-4 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm font-medium",
					children: "سابقهٔ تماس‌ها"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallTimeline, { calls })]
			}) : null
		]
	});
}
function Field({ id, label, value, onChange, required, autoComplete, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			required,
			value,
			autoComplete,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
var KEY = "tamasban-hint-v1";
function InstallHint() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useLayoutEffect)(() => {
		try {
			setOpen(localStorage.getItem(KEY) !== "1");
		} catch {
			setOpen(true);
		}
	}, []);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "relative rounded-xl bg-card px-4 py-3.5 ring-1 ring-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute left-2 top-2 flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground",
				"aria-label": "بستن راهنما",
				onClick: () => {
					try {
						localStorage.setItem(KEY, "1");
					} catch {}
					setOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "بعد از هر تماس"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 pl-8 text-xs leading-6 text-muted-foreground",
				children: "مرورگر اجازهٔ دیدن تماس‌های ورودی گوشی را ندارد. شماره را از فهرست تماس کپی کنید و اینجا بچسبانید. برای دسترسی سریع، این صفحه را به صفحهٔ اصلی اندروید اضافه کنید."
			})
		]
	});
}
function Home() {
	const { n } = Route$5.useSearch();
	const navigate = useNavigate();
	const ready = useBook((s) => s.ready);
	const contacts = useBook((s) => s.contacts);
	const calls = useBook((s) => s.calls);
	const [raw, setRaw] = (0, import_react.useState)(n ?? "");
	(0, import_react.useEffect)(() => {
		if (typeof n === "string") setRaw(n);
	}, [n]);
	const parsed = (0, import_react.useMemo)(() => parseIranPhone(raw), [raw]);
	const hasInput = parsed.digits.length > 0;
	const recent = (0, import_react.useMemo)(() => {
		return [...contacts].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
	}, [contacts]);
	function lastCall(contactId) {
		return calls.filter((c) => c.contactId === contactId).sort((a, b) => b.at - a.at)[0];
	}
	function setNumber(value, syncUrl = false) {
		setRaw(value);
		if (!syncUrl) return;
		const next = parseIranPhone(value);
		navigate({
			to: "/",
			search: next.valid ? { n: next.local } : {},
			replace: true
		});
	}
	async function pasteFromClipboard() {
		try {
			const clipped = (await navigator.clipboard.readText()).trim();
			if (!clipped) {
				toast.error("کلیپ‌بورد خالی است");
				return;
			}
			if (!looksLikePhone(clipped) && !/\d{8,}/.test(clipped)) {
				toast.error("در کلیپ‌بورد شماره‌ای پیدا نشد");
				return;
			}
			setNumber(clipped, true);
			toast.success("شماره چسبانده شد");
		} catch {
			toast.error("اجازهٔ خواندن کلیپ‌بورد داده نشد. شماره را خودتان بچسبانید.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold tracking-tight",
				children: "تماس تازه"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-6 text-muted-foreground",
				children: "شماره را وارد کنید تا بین‌المللی، ساده و لینک واتساپ همین لحظه دیده شود."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						dir: "ltr",
						inputMode: "tel",
						autoComplete: "tel",
						enterKeyHint: "done",
						placeholder: "0912… یا +98…",
						value: raw,
						onChange: (e) => setNumber(e.target.value),
						onBlur: () => {
							if (parsed.valid) setNumber(parsed.local, true);
						},
						className: "pe-11 text-lg tracking-wide",
						"aria-label": "شماره تماس",
						suppressHydrationWarning: true
					}), raw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground",
						"aria-label": "پاک کردن شماره",
						onClick: () => setNumber("", true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "secondary",
					onClick: () => void pasteFromClipboard(),
					className: "shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, {}), "چسباندن"]
				})]
			}),
			hasInput && !parsed.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "شماره را کامل کنید — برای ایران باید ده رقم بعد از صفر باشد."
			}) : null,
			parsed.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise-in space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhonePanel, { parsed }), ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallIntake, {
					parsed,
					onSaved: (contact) => void navigate({
						to: "/",
						search: { n: contact.local },
						replace: true
					})
				}, parsed.national) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 rounded-xl bg-card" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallHint, {}), ready && recent.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "آخرین مخاطب‌ها"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "برای شبیه‌سازی تماس، یکی را انتخاب کنید."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: recent.map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "w-full rounded-xl text-right transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]",
								onClick: () => setNumber(contact.local, true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactSummary, {
									contact,
									lastCall: lastCall(contact.id)
								})
							}) }, contact.id))
						})
					]
				}) : ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6 text-muted-foreground",
					children: "هنوز مخاطبی ندارید. اولین شماره را وارد کنید."
				}) : null]
			})
		]
	});
}
//#endregion
export { Home as component };
