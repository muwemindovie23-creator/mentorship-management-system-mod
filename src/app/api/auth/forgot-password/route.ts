import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validators";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { generateResetToken } from "@/lib/tokens";
import { sendMail } from "@/lib/email/mailer";
import { passwordResetEmail, APP_URL } from "@/lib/email/templates";

const GENERIC_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

export async function POST(req: Request): Promise<Response> {
  const limit = rateLimit(clientKey(req, "forgot-password"), {
    limit: 5,
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

  const parsed = forgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    // Same generic response as the "user not found" case below, so the
    // endpoint never reveals whether an email is registered.
    return Response.json({ message: GENERIC_MESSAGE });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  if (user) {
    // Invalidate any previous outstanding tokens so only the latest
    // reset link works.
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const { token, tokenHash, expiresAt } = generateResetToken();
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const resetUrl = `${APP_URL}/reset-password?token=${token}`;
    const mail = passwordResetEmail(user.name, resetUrl);
    await sendMail({ to: user.email, ...mail });
  }

  return Response.json({ message: GENERIC_MESSAGE });
}
