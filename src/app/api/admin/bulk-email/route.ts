import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { bulkEmailSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { sendBulkMail } from "@/lib/email/mailer";
import { bulkEmail } from "@/lib/email/templates";
import type { Role } from "@prisma/client";

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession(["ADMIN"]);

    const limit = rateLimit(`bulk-email:${session.user.id}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!limit.success) {
      return Response.json(
        { error: "Bulk email rate limit reached. Try again later." },
        { status: 429 }
      );
    }

    const parsed = bulkEmailSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const roles: Role[] =
      parsed.data.audience === "MENTORS"
        ? ["MENTOR"]
        : parsed.data.audience === "MENTEES"
          ? ["MENTEE"]
          : ["MENTOR", "MENTEE"];

    const recipients = await db.user.findMany({
      where: { status: "APPROVED", role: { in: roles } },
      select: { email: true },
    });

    const mail = bulkEmail(parsed.data.subject, parsed.data.body);
    const result = await sendBulkMail(
      recipients.map((r) => r.email),
      mail.subject,
      mail.html
    );

    return Response.json({
      message: `Sent ${result.sent} emails (${result.failed} failed)`,
      ...result,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
