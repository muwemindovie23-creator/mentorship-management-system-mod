import { db } from "@/lib/db";
import { verifyEmailSchema } from "@/lib/validators";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { hashToken } from "@/lib/tokens";

export async function POST(req: Request): Promise<Response> {
  const limit = rateLimit(clientKey(req, "verify-email"), {
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!limit.success) {
    return Response.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = verifyEmailSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const tokenHash = hashToken(parsed.data.token);
  const verificationToken = await db.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return Response.json(
      { error: "This verification link is invalid or has expired." },
      { status: 400 }
    );
  }

  await db.$transaction([
    db.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    db.emailVerificationToken.deleteMany({
      where: { userId: verificationToken.userId },
    }),
  ]);

  return Response.json({
    message:
      "Email verified. An administrator still needs to approve your account before you can log in.",
  });
}
