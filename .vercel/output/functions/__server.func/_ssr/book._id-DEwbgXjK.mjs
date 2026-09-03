import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as parseIranPhone, s as toPersianDigits } from "./phone-CG57bSRI.mjs";
import { f as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as displayName, n as Route$1, o as useBook } from "./router-CdA9Lyn8.mjs";
import { t as ContactAvatar } from "./contact-row-NkS5TyGZ.mjs";
import { n as Input, t as Button } from "./input-D-ATWlHF.mjs";
import { i as Textarea, n as CallTimeline, r as PhonePanel } from "./textarea-CXInE3v5.mjs";
import { t as Label } from "./label-2gHoGVxj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._id-DEwbgXjK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const { id } = Route$1.useParams();
	const ready = useBook((s) => s.ready);
	const contacts = useBook((s) => s.contacts);
	const allCalls = useBook((s) => s.calls);
	const contact = contacts.find((c) => c.id === id);
	const calls = (0, import_react.useMemo)(() => allCalls.filter((c) => c.contactId === id).slice().sort((a, b) => b.at - a.at), [allCalls, id]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 rounded-xl bg-card" });
	if (!contact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "مخاطب پیدا نشد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "شاید حذف شده باشد."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/book",
				className: "mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground",
				children: "بازگشت به دفترچه"
			})
		]
	});
	const parsed = parseIranPhone(contact.local);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/book",
				className: "inline-flex h-10 items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }), "دفترچه"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactAvatar, { contact }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-lg font-semibold tracking-tight",
						children: displayName(contact)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [toPersianDigits(calls.length), " تماس ثبت‌شده"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhonePanel, { parsed }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCallForm, { contact }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-4 py-4 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm font-medium",
					children: "سابقه با تاریخ شمسی"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallTimeline, { calls })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditContactForm, { contact }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteContactButton, { contact })
		]
	});
}
function NewCallForm({ contact }) {
	const addCall = useBook((s) => s.addCall);
	const [reason, setReason] = (0, import_react.useState)("");
	async function saveCall(event) {
		event.preventDefault();
		if (!reason.trim()) {
			toast.error("علت تماس را بنویسید");
			return;
		}
		try {
			await addCall(contact.id, reason);
			setReason("");
			toast.success("علت تماس ثبت شد");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "ثبت ناموفق بود");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: saveCall,
		className: "space-y-3 rounded-xl bg-card p-4 ring-1 ring-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "detail-reason",
					children: "علت تماس جدید"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "detail-reason",
					value: reason,
					onChange: (e) => setReason(e.target.value),
					placeholder: "این بار برای چه موضوعی تماس گرفت؟"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				children: "ثبت تماس تازه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				className: "w-full",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: { n: contact.local },
					children: "باز کردن در تماس تازه"
				})
			})
		]
	});
}
function EditContactForm({ contact }) {
	const updateContact = useBook((s) => s.updateContact);
	const [lastName, setLastName] = (0, import_react.useState)(contact.lastName);
	const [firstName, setFirstName] = (0, import_react.useState)(contact.firstName);
	const [company, setCompany] = (0, import_react.useState)(contact.company);
	async function saveProfile(event) {
		event.preventDefault();
		if (!lastName.trim()) {
			toast.error("نام خانوادگی را وارد کنید");
			return;
		}
		try {
			await updateContact(contact.id, {
				lastName,
				firstName,
				company
			});
			toast.success("اطلاعات مخاطب ذخیره شد");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "ذخیره ناموفق بود");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: saveProfile,
		className: "space-y-3 rounded-xl bg-card p-4 ring-1 ring-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "ویرایش مخاطب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "edit-last",
					children: "نام خانوادگی"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "edit-last",
					value: lastName,
					onChange: (e) => setLastName(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "edit-first",
					children: "نام"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "edit-first",
					value: firstName,
					onChange: (e) => setFirstName(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "edit-company",
					children: "شرکت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "edit-company",
					value: company,
					onChange: (e) => setCompany(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "secondary",
				className: "w-full",
				children: "ذخیره تغییرات"
			})
		]
	});
}
function DeleteContactButton({ contact }) {
	const removeContact = useBook((s) => s.removeContact);
	const navigate = useNavigate();
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	async function onDelete() {
		if (!confirmDelete) {
			setConfirmDelete(true);
			return;
		}
		try {
			await removeContact(contact.id);
			toast.success("مخاطب حذف شد");
			navigate({ to: "/book" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "حذف ناموفق بود");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "ghost",
		className: "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
		onClick: onDelete,
		children: confirmDelete ? "تأیید حذف مخاطب و سابقه" : "حذف مخاطب"
	});
}
//#endregion
export { ContactPage as component };
