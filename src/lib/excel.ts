import type { CallEntry, Contact } from "./book-types";
import { gregorianToJalali } from "./jalali";
import { displayName } from "./store";

function jalaliDate(ts: number): string {
  const d = new Date(ts);
  const [jy, jm, jd] = gregorianToJalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
  );
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}

function hhmm(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Build and download the full book as .xlsx — sheet 1: contacts summary,
 * sheet 2: every logged call. Lazy-imports SheetJS so it never rides the
 * initial bundle.
 */
export async function exportBookToExcel(
  contacts: Contact[],
  calls: CallEntry[],
): Promise<void> {
  const XLSX = await import("xlsx");

  const callsByContact = new Map<string, CallEntry[]>();
  for (const call of calls) {
    const list = callsByContact.get(call.contactId) ?? [];
    list.push(call);
    callsByContact.set(call.contactId, list);
  }

  const contactHeader = [
    "نام",
    "نام خانوادگی",
    "شرکت",
    "شماره",
    "بین‌المللی",
    "تعداد تماس",
    "آخرین تماس (شمسی)",
    "آخرین علت تماس",
  ];
  const contactRows = contacts.map((contact) => {
    const list = (callsByContact.get(contact.id) ?? [])
      .slice()
      .sort((a, b) => b.at - a.at);
    const last = list[0];
    return [
      contact.firstName,
      contact.lastName,
      contact.company,
      contact.local,
      contact.e164,
      list.length,
      last ? jalaliDate(last.at) : "",
      last?.reason ?? "",
    ];
  });

  const contactById = new Map(contacts.map((c) => [c.id, c]));
  const callHeader = [
    "مخاطب",
    "شماره",
    "تاریخ (شمسی)",
    "ساعت",
    "علت تماس",
    "زمان (میلادی)",
  ];
  const callRows = calls
    .slice()
    .sort((a, b) => b.at - a.at)
    .map((call) => {
      const contact = contactById.get(call.contactId);
      return [
        contact ? displayName(contact) : "",
        contact?.local ?? "",
        jalaliDate(call.at),
        hhmm(call.at),
        call.reason,
        new Date(call.at).toISOString(),
      ];
    });

  const wb = XLSX.utils.book_new();
  wb.Workbook = { Views: [{ RTL: true }] };

  const contactsSheet = XLSX.utils.aoa_to_sheet([contactHeader, ...contactRows]);
  contactsSheet["!cols"] = [
    { wch: 14 },
    { wch: 16 },
    { wch: 22 },
    { wch: 14 },
    { wch: 15 },
    { wch: 10 },
    { wch: 16 },
    { wch: 48 },
  ];
  XLSX.utils.book_append_sheet(wb, contactsSheet, "مخاطب‌ها");

  const callsSheet = XLSX.utils.aoa_to_sheet([callHeader, ...callRows]);
  callsSheet["!cols"] = [
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 8 },
    { wch: 48 },
    { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(wb, callsSheet, "تماس‌ها");

  const today = jalaliDate(Date.now()).replace(/\//g, "-");
  XLSX.writeFile(wb, `tamasban-${today}.xlsx`);
}
