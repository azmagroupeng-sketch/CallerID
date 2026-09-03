import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-DUtYoQbQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Mark, l as cn, s as useCurrentUserState } from "./router-CdA9Lyn8.mjs";
import { n as Input, t as Button } from "./input-D-ATWlHF.mjs";
import { t as Label } from "./label-2gHoGVxj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BaGzGwiw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function authErrorText(message) {
	const raw = message ?? "";
	if (/invalid email or password/i.test(raw)) return "ایمیل یا رمز عبور اشتباه است";
	if (/already exists|already registered|user_already_exists/i.test(raw)) return "این ایمیل قبلاً ثبت شده — وارد شوید";
	if (/at least 8|too short|min_password/i.test(raw)) return "رمز عبور باید حداقل ۸ نویسه باشد";
	if (/invalid email/i.test(raw)) return "ایمیل معتبر نیست";
	return raw ? `خطا: ${raw}` : "عملیات ناموفق بود — دوباره تلاش کنید";
}
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground",
		children: "در حال بررسی نشست…"
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function submit(event) {
		event.preventDefault();
		if (busy) return;
		setBusy(true);
		try {
			if (mode === "signup") {
				const { error } = await authClient.signUp.email({
					email: email.trim(),
					password,
					name: name.trim() || email.split("@")[0] || "عضو تیم"
				});
				if (error) throw new Error(authErrorText(error.message));
			} else {
				const { error } = await authClient.signIn.email({
					email: email.trim(),
					password
				});
				if (error) throw new Error(authErrorText(error.message));
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "عملیات ناموفق بود");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-background px-5 text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-col items-center gap-2 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg font-semibold tracking-tight",
							children: mode === "signin" ? "ورود به تماس‌بان" : "ساخت حساب تماس‌بان"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-6 text-muted-foreground",
							children: "دفترچهٔ تماس تیمی است: همهٔ اعضا اطلاعات مشترک را می‌بینند و کامل می‌کنند."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid grid-cols-2 gap-1 rounded-xl bg-card p-1 ring-1 ring-border",
					children: [["signin", "ورود"], ["signup", "ثبت‌نام"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMode(value),
						className: cn("h-10 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-[var(--motion-quick)]", mode === value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: label
					}, value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-3 rounded-xl bg-card p-4 ring-1 ring-border",
					children: [
						mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "نام"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								autoComplete: "name",
								placeholder: "مثلاً مریم رضایی"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "ایمیل"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								dir: "ltr",
								type: "email",
								inputMode: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								autoComplete: "email",
								placeholder: "you@example.com",
								className: "text-left"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "رمز عبور"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									dir: "ltr",
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									autoComplete: mode === "signin" ? "current-password" : "new-password",
									className: "text-left"
								}),
								mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "حداقل ۸ نویسه"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: busy,
							children: busy ? "لطفاً صبر کنید…" : mode === "signin" ? "ورود" : "ساخت حساب و ورود"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-xs leading-6 text-muted-foreground",
					children: "هر عضو تیم با ایمیل خودش وارد می‌شود؛ دفترچه یکی است."
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
