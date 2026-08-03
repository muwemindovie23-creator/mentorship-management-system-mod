import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validators";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { hashResetToken } from "@/lib/tokens";

export async function POST(req: Request): Promise<Response> {
  const limit = rateLimit(clientKey(req, "reset-password"), {
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

  const parsed = resetPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const tokenHash = hashResetToken(parsed.data.token);
  const resetToken = await db.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return Response.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    db.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);

  return Response.json({
    message: "Your password has been reset. You can now log in.",
  });
}
