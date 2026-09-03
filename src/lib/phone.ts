const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export type PhoneKind = "mobile" | "landline" | "unknown";

export type ParsedPhone = {
  input: string;
  digits: string;
  national: string;
  e164: string;
  local: string;
  wa: string;
  waUrl: string;
  telUrl: string;
  valid: boolean;
  kind: PhoneKind;
};

export function toAsciiDigits(value: string): string {
  return [...value]
    .map((ch) => {
      const persian = PERSIAN_DIGITS.indexOf(ch);
      if (persian !== -1) return String(persian);
      const arabic = ARABIC_DIGITS.indexOf(ch);
      if (arabic !== -1) return String(arabic);
      return ch;
    })
    .join("");
}

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

export function looksLikePhone(value: string): boolean {
  const digits = toAsciiDigits(value).replace(/[^\d]/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function extractNational(digits: string): string {
  let next = digits;
  if (next.startsWith("00")) next = next.slice(2);
  if (next.startsWith("98") && next.length > 2) return next.slice(2);
  if (next.startsWith("0")) return next.slice(1);
  return next;
}

export function parseIranPhone(input: string): ParsedPhone {
  const ascii = toAsciiDigits(input);
  const digits = ascii.replace(/[^\d]/g, "");
  const national = extractNational(digits);
  const valid = /^[1-9]\d{9}$/.test(national);
  const kind: PhoneKind = !valid
    ? "unknown"
    : national.startsWith("9")
      ? "mobile"
      : "landline";

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
    kind,
  };
}

export function formatE164(e164: string): string {
  if (!e164.startsWith("+98") || e164.length !== 13) return e164;
  const n = e164.slice(3);
  return `+98 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}

export function formatLocal(local: string): string {
  if (!local.startsWith("0") || local.length !== 11) return local;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

export function kindLabel(kind: PhoneKind): string {
  if (kind === "mobile") return "موبایل";
  if (kind === "landline") return "ثابت";
  return "نامشخص";
}
