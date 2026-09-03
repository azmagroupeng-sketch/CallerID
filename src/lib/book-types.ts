/** Shared data shapes for the team book — used by server functions and the client store. */

export type Contact = {
  id: string;
  national: string;
  e164: string;
  local: string;
  lastName: string;
  firstName: string;
  company: string;
  createdAt: number;
  updatedAt: number;
};

export type CallEntry = {
  id: string;
  contactId: string;
  reason: string;
  at: number;
};
