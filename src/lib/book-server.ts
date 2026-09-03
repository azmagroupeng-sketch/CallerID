import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CallEntry, Contact } from "./book-types";
import { parseIranPhone } from "./phone";

// تماس‌بان: دفترچهٔ تیمی مشترک — هر کاربر واردشده به همان داده‌ها دسترسی دارد
// (بدون user_id؛ طبق طراحی محصول). authMiddleware هویت هر فراخوانی را تأیید می‌کند.

type Row = Record<string, unknown>;

function toMs(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(String(value)).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapContact(row: Row): Contact {
  return {
    id: String(row.id),
    national: String(row.national),
    e164: String(row.e164),
    local: String(row.local),
    lastName: String(row.last_name ?? ""),
    firstName: String(row.first_name ?? ""),
    company: String(row.company ?? ""),
    createdAt: toMs(row.created_at),
    updatedAt: toMs(row.updated_at),
  };
}

function mapCall(row: Row): CallEntry {
  return {
    id: String(row.id),
    contactId: String(row.contact_id),
    reason: String(row.reason ?? ""),
    at: toMs(row.at),
  };
}

const nationalSchema = z
  .string()
  .regex(/^[1-9]\d{9}$/, "شماره باید ده رقم بعد از صفر باشد");

export const listBook = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const contactRows = await sql`select * from contacts order by updated_at desc`;
    const callRows = await sql`select * from calls order by at desc`;
    return {
      contacts: contactRows.map(mapContact),
      calls: callRows.map(mapCall),
    };
  });

const createContactInput = z.object({
  national: nationalSchema,
  lastName: z.string().trim().min(1).max(120),
  firstName: z.string().trim().max(120).default(""),
  company: z.string().trim().max(160).default(""),
  reason: z.string().trim().min(1).max(2000),
});

export const createContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => createContactInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const parsed = parseIranPhone(`0${data.national}`);
    const now = new Date();
    const contactId = crypto.randomUUID();
    const callId = crypto.randomUUID();
    const inserted = await sql`
      insert into contacts (id, national, e164, local, last_name, first_name, company, created_at, updated_at)
      values (${contactId}, ${data.national}, ${parsed.e164}, ${parsed.local},
              ${data.lastName}, ${data.firstName}, ${data.company}, ${now}, ${now})
      on conflict (national) do update set updated_at = now()
      returning *`;
    const contact = mapContact(inserted[0]!);
    await sql`
      insert into calls (id, contact_id, reason, at)
      values (${callId}, ${contact.id}, ${data.reason}, ${now})`;
    return {
      contact,
      call: { id: callId, contactId: contact.id, reason: data.reason, at: now.getTime() } as CallEntry,
    };
  });

const patchContactInput = z.object({
  id: z.string().min(1),
  lastName: z.string().trim().min(1).max(120),
  firstName: z.string().trim().max(120).default(""),
  company: z.string().trim().max(160).default(""),
});

export const patchContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => patchContactInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const updated = await sql`
      update contacts
      set last_name = ${data.lastName}, first_name = ${data.firstName},
          company = ${data.company}, updated_at = now()
      where id = ${data.id}
      returning *`;
    return updated[0] ? mapContact(updated[0]) : null;
  });

const idInput = z.object({ id: z.string().min(1) });

export const deleteContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => idInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from contacts where id = ${data.id}`;
    return { ok: true };
  });

const createCallInput = z.object({
  contactId: z.string().min(1),
  reason: z.string().trim().min(1).max(2000),
});

export const createCall = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => createCallInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const now = new Date();
    const callId = crypto.randomUUID();
    const inserted = await sql`
      insert into calls (id, contact_id, reason, at)
      values (${callId}, ${data.contactId}, ${data.reason}, ${now})
      returning *`;
    await sql`update contacts set updated_at = ${now} where id = ${data.contactId}`;
    return mapCall(inserted[0]!);
  });

export const deleteCall = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => idInput.parse(input))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from calls where id = ${data.id}`;
    return { ok: true };
  });
