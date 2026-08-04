import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { changePasswordSchema } from "@/lib/validators";

/** POST /api/profile/password — change the current user's own password. */
export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession();

    const parsed = changePasswordSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const user = await db.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    const valid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.passwordHash
    );
    if (!valid) {
      return Response.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return Response.json({ message: "Password changed." });
  } catch (error) {
    return errorResponse(error);
  }
}
