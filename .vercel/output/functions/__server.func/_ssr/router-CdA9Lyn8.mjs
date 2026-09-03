import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, _ as createFileRoute, b as Navigate, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BDknyNNs.mjs";
import { fn as literal, hn as object, mn as number, vn as string, yn as union } from "../_libs/@better-auth/core+[...].mjs";
import { r as signOut, t as authClient } from "./client-DUtYoQbQ.mjs";
import { i as hasGateSessionMarker, t as auth } from "./server-Cc3-YLs9.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { d as BookUser, i as PhoneIncoming, n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CdA9Lyn8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "خطایی رخ داد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: error.message || "یک خطای پیش‌بینی‌نشده رخ داد. صفحه را دوباره بارگذاری کنید."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "9",
				className: "fill-card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10.2 12.4c1.8-2 3.6-2.6 5.2-.6l.9 1.1c.5.6.4 1.5-.2 2.1l-.7.7c1.5 2.8 3.2 4.5 6 6l.7-.7c.6-.6 1.5-.7 2.1-.2l1.1.9c2 1.6 1.4 3.4-.6 5.2-1.7 1.5-4 .6-6.8-1.1-2.9-1.8-5.6-4.6-7.4-7.4-1.7-2.8-2.6-5.1-1.1-6.8Z",
				className: "fill-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M20.5 8.5h5v1.4h-5A1.1 1.1 0 0 0 19.4 11v.8h-1.4V11A2.5 2.5 0 0 1 20.5 8.5Z",
				className: "fill-primary",
				opacity: "0.7"
			})
		]
	});
}
function Toaster$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		dir: "rtl",
		theme: "dark",
		position: "top-center",
		toastOptions: { classNames: {
			toast: "bg-card text-foreground border-border font-[family-name:var(--font-sans)]",
			title: "text-foreground",
			description: "text-muted-foreground"
		} },
		...props
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "در حال خروج…" : "خروج"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var nationalSchema = string().regex(/^[1-9]\d{9}$/, "شماره باید ده رقم بعد از صفر باشد");
var listBook = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("94d37bcb62a992fb2b7cd627b13ae85a778b703f0a4218b9078b6cd88b8fa717"));
var createContactInput = object({
	national: nationalSchema,
	lastName: string().trim().min(1).max(120),
	firstName: string().trim().max(120).default(""),
	company: string().trim().max(160).default(""),
	reason: string().trim().min(1).max(2e3)
});
var createContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => createContactInput.parse(input)).handler(createSsrRpc("5ce76cd6cbf7b1faf30c65fe56da6851e8678f32e7e7951eb06fb0cdec6ecf19"));
var patchContactInput = object({
	id: string().min(1),
	lastName: string().trim().min(1).max(120),
	firstName: string().trim().max(120).default(""),
	company: string().trim().max(160).default("")
});
var patchContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => patchContactInput.parse(input)).handler(createSsrRpc("834220eb244bb7f121a467dbf07b506e4c8436789c4e23de7e61f871b4153475"));
var idInput = object({ id: string().min(1) });
var deleteContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => idInput.parse(input)).handler(createSsrRpc("6bc6fb99b6c512ba8054d12bdd06f36d51b2977a0f3280935bd7ee5f085c93b8"));
var createCallInput = object({
	contactId: string().min(1),
	reason: string().trim().min(1).max(2e3)
});
var createCall = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => createCallInput.parse(input)).handler(createSsrRpc("fe6fa65ce93a510e4b38403dd877efbc73956eb65a3c381a2feaf4ce7e706f85"));
var deleteCall = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => idInput.parse(input)).handler(createSsrRpc("2427678765f4050b4906070696222be51fd7faabc994016ba620294fdba72d73"));
function displayName(contact) {
	return `${contact.firstName} ${contact.lastName}`.trim() || contact.company || contact.local;
}
function initials(contact) {
	return ((contact.lastName || contact.firstName || contact.company).trim().charAt(0) || "؟").slice(0, 1);
}
function friendly(err) {
	const message = err instanceof Error ? err.message : String(err);
	if (message === "Unauthorized") return "نشست منقضی شده — دوباره وارد شوید";
	if (/fetch|network|Failed/i.test(message)) return "ارتباط با سرور برقرار نشد";
	return message || "خطای نامشخص";
}
var useBook = create((set, get) => ({
	ready: false,
	error: null,
	syncing: false,
	contacts: [],
	calls: [],
	refresh: async () => {
		if (get().syncing) return;
		set({ syncing: true });
		try {
			const data = await listBook();
			set({
				contacts: data.contacts,
				calls: data.calls,
				error: null,
				ready: true
			});
		} catch (err) {
			set({ error: friendly(err) });
		} finally {
			set({ syncing: false });
		}
	},
	hydrate: async () => {
		await get().refresh();
	},
	findByNational: (national) => get().contacts.find((c) => c.national === national),
	callsFor: (contactId) => get().calls.filter((c) => c.contactId === contactId).sort((a, b) => b.at - a.at),
	lastCall: (contactId) => get().callsFor(contactId)[0],
	saveNewContact: async (input) => {
		const { contact, call } = await createContact({ data: input });
		set((s) => ({
			contacts: [contact, ...s.contacts.filter((c) => c.id !== contact.id)],
			calls: [call, ...s.calls],
			error: null
		}));
		return contact;
	},
	addCall: async (contactId, reason) => {
		const call = await createCall({ data: {
			contactId,
			reason
		} });
		set((s) => ({
			calls: [call, ...s.calls],
			contacts: s.contacts.map((c) => c.id === contactId ? {
				...c,
				updatedAt: call.at
			} : c),
			error: null
		}));
		return call;
	},
	updateContact: async (contactId, patch) => {
		const current = get().contacts.find((c) => c.id === contactId);
		if (!current) throw new Error("مخاطب پیدا نشد");
		const updated = await patchContact({ data: {
			id: contactId,
			lastName: patch.lastName ?? current.lastName,
			firstName: patch.firstName ?? current.firstName,
			company: patch.company ?? current.company
		} });
		if (updated) set((s) => ({
			contacts: s.contacts.map((c) => c.id === contactId ? updated : c),
			error: null
		}));
	},
	removeContact: async (contactId) => {
		await deleteContact({ data: { id: contactId } });
		set((s) => ({
			contacts: s.contacts.filter((c) => c.id !== contactId),
			calls: s.calls.filter((c) => c.contactId !== contactId),
			error: null
		}));
	},
	removeCall: async (callId) => {
		await deleteCall({ data: { id: callId } });
		set((s) => ({
			calls: s.calls.filter((c) => c.id !== callId),
			error: null
		}));
	}
}));
var TABS = [{
	to: "/",
	label: "تماس تازه",
	icon: PhoneIncoming
}, {
	to: "/book",
	label: "دفترچه",
	icon: BookUser
}];
function AppShell({ children }) {
	const hydrate = useBook((s) => s.hydrate);
	const refresh = useBook((s) => s.refresh);
	const ready = useBook((s) => s.ready);
	const error = useBook((s) => s.error);
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useLayoutEffect)(() => {
		hydrate();
	}, [hydrate, user]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const pull = () => {
			if (document.visibilityState === "visible") refresh();
		};
		document.addEventListener("visibilitychange", pull);
		window.addEventListener("focus", pull);
		const timer = window.setInterval(pull, 3e4);
		return () => {
			document.removeEventListener("visibilitychange", pull);
			window.removeEventListener("focus", pull);
			window.clearInterval(timer);
		};
	}, [user, refresh]);
	if (pathname === "/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground",
		children: "در حال بررسی نشست…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground md:flex md:justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden", "md:max-w-[390px] md:ring-1 md:ring-border"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-5 py-3.5 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-semibold leading-tight tracking-tight",
								children: "تماس‌بان"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "دفترچهٔ تیمی تماس‌ها"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					]
				}),
				!ready && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-5 mt-4 flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2.5 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-5 text-muted-foreground",
						children: error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void refresh(),
						className: "shrink-0 text-xs font-medium text-foreground underline-offset-4 hover:underline",
						children: "تلاش دوباره"
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 overflow-y-auto px-5 pb-28 pt-5",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "absolute inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md",
					"aria-label": "ناوبری اصلی",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-1",
						children: TABS.map((tab) => {
							const active = tab.to === "/" ? pathname === "/" : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
							const Icon = tab.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: tab.to,
								className: cn("flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-[var(--motion-quick)]", active ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4",
									strokeWidth: 1.75
								}), tab.label]
							}) }, tab.to);
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
/**
* ثبت سرویس‌کاربر /sw.js — فقط در build نهایی (PROD) تا کش آفلاین با HMR
* محیط توسعه تداخل نکند. بی‌صداست: هر خطا فقط سکوت می‌شود.
*/
function PwaRegister() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	}, []);
	return null;
}
var styles_default = "/assets/styles-18E7gl9b.css";
var APP_NAME = "تماس‌بان";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0d0b"
			},
			{
				name: "description",
				content: "بعد از هر تماس، شماره بین‌المللی و ساده، لینک واتساپ و سابقهٔ شمسی را ببینید."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-1 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "این صفحه پیدا نشد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "مسیر اشتباه است یا مخاطب حذف شده."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground",
				children: "بازگشت به تماس تازه"
			})
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaRegister, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$4 = () => import("./routes-DX0XxxF-.mjs");
var Route$5 = createFileRoute("/")({
	validateSearch: (raw) => ({ n: typeof raw.n === "string" ? raw.n : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./book-DRA9Uyqf.mjs");
var Route$4 = createFileRoute("/book")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./login-BaGzGwiw.mjs");
var Route$3 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./book.index-z2pdujjy.mjs");
var Route$2 = createFileRoute("/book/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./book._id-DEwbgXjK.mjs");
var Route$1 = createFileRoute("/book/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: { ANY: async ({ request }) => auth.handler(request) } } });
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var BookRoute = Route$4.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$3.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var BookIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => BookRoute
});
var BookIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => BookRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$6
});
var BookRouteChildren = {
	BookIdRoute,
	BookIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	BookRoute: BookRoute._addFileChildren(BookRouteChildren),
	LoginRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { initials as a, Mark as c, displayName as i, cn as l, Route$1 as n, useBook as o, Route$5 as r, useCurrentUserState as s, router_exports as t };
