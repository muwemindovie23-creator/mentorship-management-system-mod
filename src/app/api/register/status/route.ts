import { db } from "@/lib/db";
import { emailSchema } from "@/lib/validators";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Lets the login form show a friendly "pending approval" message
 * instead of a generic credentials error. Only the coarse status is
 * revealed, never whether the password was correct.
 */
export async function POST(req: Request): Promise<Response> {
  const limit = rateLimit(clientKey(req, "status"), {
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (!limit.success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = emailSchema.safeParse((json as { email?: string })?.email);
  if (!parsed.success) {
    return Response.json({ status: "UNKNOWN" });
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data },
    select: { status: true },
  });

  return Response.json({ status: user?.status ?? "UNKNOWN" });
}
