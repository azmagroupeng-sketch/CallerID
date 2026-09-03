import { create } from "zustand";
import { parseIranPhone } from "./phone";
import {
  createCall,
  createContact,
  deleteCall,
  deleteContact,
  listBook,
  patchContact,
} from "./book-server";

export type { CallEntry, Contact } from "./book-types";
import type { CallEntry, Contact } from "./book-types";

type BookState = {
  /** First successful load happened — pages render instead of skeletons. */
  ready: boolean;
  /** Last hydrate/refresh failure message (Persian), null when fine. */
  error: string | null;
  /** A background refresh is in flight. */
  syncing: boolean;
  contacts: Contact[];
  calls: CallEntry[];
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  findByNational: (national: string) => Contact | undefined;
  callsFor: (contactId: string) => CallEntry[];
  lastCall: (contactId: string) => CallEntry | undefined;
  saveNewContact: (input: {
    national: string;
    lastName: string;
    firstName: string;
    company: string;
    reason: string;
  }) => Promise<Contact>;
  addCall: (contactId: string, reason: string) => Promise<CallEntry>;
  updateContact: (
    contactId: string,
    patch: Partial<Pick<Contact, "lastName" | "firstName" | "company">>,
  ) => Promise<void>;
  removeContact: (contactId: string) => Promise<void>;
  removeCall: (callId: string) => Promise<void>;
};

export function displayName(contact: Contact): string {
  const full = `${contact.firstName} ${contact.lastName}`.trim();
  return full || contact.company || contact.local;
}

export function initials(contact: Contact): string {
  const source = contact.lastName || contact.firstName || contact.company;
  return (source.trim().charAt(0) || "؟").slice(0, 1);
}

function friendly(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message === "Unauthorized") {
    return "نشست منقضی شده — دوباره وارد شوید";
  }
  if (/fetch|network|Failed/i.test(message)) {
    return "ارتباط با سرور برقرار نشد";
  }
  return message || "خطای نامشخص";
}

export const useBook = create<BookState>((set, get) => ({
  ready: false,
  error: null,
  syncing: false,
  contacts: [],
  calls: [],

  refresh: async () => {
    if (get().syncing) {
      return;
    }
    set({ syncing: true });
    try {
      const data = await listBook();
      set({
        contacts: data.contacts,
        calls: data.calls,
        error: null,
        ready: true,
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

  findByNational: (national) =>
    get().contacts.find((c) => c.national === national),

  callsFor: (contactId) =>
    get()
      .calls.filter((c) => c.contactId === contactId)
      .sort((a, b) => b.at - a.at),

  lastCall: (contactId) => get().callsFor(contactId)[0],

  saveNewContact: async (input) => {
    const { contact, call } = await createContact({ data: input });
    set((s) => ({
      contacts: [contact, ...s.contacts.filter((c) => c.id !== contact.id)],
      calls: [call, ...s.calls],
      error: null,
    }));
    return contact;
  },

  addCall: async (contactId, reason) => {
    const call = await createCall({ data: { contactId, reason } });
    set((s) => ({
      calls: [call, ...s.calls],
      contacts: s.contacts.map((c) =>
        c.id === contactId ? { ...c, updatedAt: call.at } : c,
      ),
      error: null,
    }));
    return call;
  },

  updateContact: async (contactId, patch) => {
    const current = get().contacts.find((c) => c.id === contactId);
    if (!current) throw new Error("مخاطب پیدا نشد");
    const updated = await patchContact({
      data: {
        id: contactId,
        lastName: patch.lastName ?? current.lastName,
        firstName: patch.firstName ?? current.firstName,
        company: patch.company ?? current.company,
      },
    });
    if (updated) {
      set((s) => ({
        contacts: s.contacts.map((c) => (c.id === contactId ? updated : c)),
        error: null,
      }));
    }
  },

  removeContact: async (contactId) => {
    await deleteContact({ data: { id: contactId } });
    set((s) => ({
      contacts: s.contacts.filter((c) => c.id !== contactId),
      calls: s.calls.filter((c) => c.contactId !== contactId),
      error: null,
    }));
  },

  removeCall: async (callId) => {
    await deleteCall({ data: { id: callId } });
    set((s) => ({
      calls: s.calls.filter((c) => c.id !== callId),
      error: null,
    }));
  },
}));
