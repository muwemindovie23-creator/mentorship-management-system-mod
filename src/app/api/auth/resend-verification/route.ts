import { db } from "@/lib/db";
import { resendVerificationSchema } from "@/lib/validators";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { generateVerificationToken } from "@/lib/tokens";
import { sendMail } from "@/lib/email/mailer";
import { verifyEmailEmail, APP_URL } from "@/lib/email/templates";

const GENERIC_MESSAGE =
  "If an unverified account exists for that email, a new verification link has been sent.";

export async function POST(req: Request): Promise<Response> {
  const limit = rateLimit(clientKey(req, "resend-verification"), {
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

  const parsed = resendVerificationSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ message: GENERIC_MESSAGE });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  if (user && !user.emailVerifiedAt) {
    await db.emailVerificationToken.deleteMany({ where: { userId: user.id } });

    const { token, tokenHash, expiresAt } = generateVerificationToken();
    await db.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
    const mail = verifyEmailEmail(user.name, verifyUrl);
    await sendMail({ to: user.email, ...mail });
  }

  return Response.json({ message: GENERIC_MESSAGE });
}
