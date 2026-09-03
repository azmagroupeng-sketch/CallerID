import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

// Mounts this app's own Better Auth at /api/auth/* — sign-up/sign-in (email +
// password), session reads and sign-out all go through here.
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => auth.handler(request),
    },
  },
});
