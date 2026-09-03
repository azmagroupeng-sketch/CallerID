//#region node_modules/.nitro/vite/services/ssr/assets/phone-CG57bSRI.js
var PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
var ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function toAsciiDigits(value) {
	return [...value].map((ch) => {
		const persian = PERSIAN_DIGITS.indexOf(ch);
		if (persian !== -1) return String(persian);
		const arabic = ARABIC_DIGITS.indexOf(ch);
		if (arabic !== -1) return String(arabic);
		return ch;
	}).join("");
}
function toPersianDigits(value) {
	return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}
function looksLikePhone(value) {
	const digits = toAsciiDigits(value).replace(/[^\d]/g, "");
	return digits.length >= 10 && digits.length <= 15;
}
function extractNational(digits) {
	let next = digits;
	if (next.startsWith("00")) next = next.slice(2);
	if (next.startsWith("98") && next.length > 2) return next.slice(2);
	if (next.startsWith("0")) return next.slice(1);
	return next;
}
function parseIranPhone(input) {
	const digits = toAsciiDigits(input).replace(/[^\d]/g, "");
	const national = extractNational(digits);
	const valid = /^[1-9]\d{9}$/.test(national);
	const kind = !valid ? "unknown" : national.startsWith("9") ? "mobile" : "landline";
	return {
		input,
		digits,
		national,
		e164: national ? `+98${national}` : "+98",
		local: national ? `0${national}` : "0",
		wa: national ? `98${national}` : "98",
		waUrl: national ? `https://wa.me/98${national}` : "https://wa.me/98",
		telUrl: national ? `tel:+98${national}` : "tel:+98",
		valid,
		kind
	};
}
function formatE164(e164) {
	if (!e164.startsWith("+98") || e164.length !== 13) return e164;
	const n = e164.slice(3);
	return `+98 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}
function formatLocal(local) {
	if (!local.startsWith("0") || local.length !== 11) return local;
	return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}
function kindLabel(kind) {
	if (kind === "mobile") return "موبایل";
	if (kind === "landline") return "ثابت";
	return "نامشخص";
}
//#endregion
export { parseIranPhone as a, looksLikePhone as i, formatLocal as n, toAsciiDigits as o, kindLabel as r, toPersianDigits as s, formatE164 as t };
