import { auth } from "@/lib/auth";
import type { Role } from "@prisma/client";
import type { Session } from "next-auth";

export class AuthorizationError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Server-side guard for API routes and server actions.
 * Returns the session or throws an AuthorizationError.
 */
export async function requireSession(roles?: Role[]): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    throw new AuthorizationError(401, "Authentication required");
  }
  if (session.user.status !== "APPROVED") {
    throw new AuthorizationError(403, "Account is not approved");
  }
  if (roles && !roles.includes(session.user.role)) {
    throw new AuthorizationError(403, "Insufficient permissions");
  }

  return session;
}

export function errorResponse(error: unknown): Response {
  if (error instanceof AuthorizationError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
