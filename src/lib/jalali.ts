import { toPersianDigits } from "./phone";

const MONTHS = [
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
  "اسفند",
] as const;

const WEEKDAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
] as const;

function div(a: number, b: number) {
  return ~~(a / b);
}

/** Gregorian Y-M-D → Jalali Y-M-D (1-indexed months). */
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    div(gy2 + 3, 4) -
    div(gy2 + 99, 100) +
    div(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1]!;
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
  return [jy, jm, jd];
}

function parts(ts: number) {
  const d = new Date(ts);
  const [jy, jm, jd] = gregorianToJalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
  );
  return { d, jy, jm, jd };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatJalaliDate(ts: number): string {
  const { jy, jm, jd } = parts(ts);
  return `${toPersianDigits(jd)} ${MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
}

export function formatJalaliDateTime(ts: number): string {
  const { d, jy, jm, jd } = parts(ts);
  const weekday = WEEKDAYS[d.getDay()] ?? "";
  const time = `${toPersianDigits(pad(d.getHours()))}:${toPersianDigits(pad(d.getMinutes()))}`;
  return `${weekday} ${toPersianDigits(jd)} ${MONTHS[jm - 1]} ${toPersianDigits(jy)}، ساعت ${time}`;
}

export function formatJalaliRelative(ts: number): string {
  const now = new Date();
  const d = new Date(ts);
  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startD = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startNow - startD) / 86_400_000);
  if (diffDays === 0) return "امروز";
  if (diffDays === 1) return "دیروز";
  if (diffDays > 1 && diffDays < 7) {
    return `${toPersianDigits(diffDays)} روز پیش`;
  }
  return formatJalaliDate(ts);
}
