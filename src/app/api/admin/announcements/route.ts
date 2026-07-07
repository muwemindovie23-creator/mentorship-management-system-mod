import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { announcementSchema } from "@/lib/validators";
import { sanitizeText, sanitizeMultiline } from "@/lib/sanitize";
import { sendBulkMail } from "@/lib/email/mailer";
import { announcementEmail } from "@/lib/email/templates";
import type { Role } from "@prisma/client";

function audienceRoles(audience: "ALL" | "MENTORS" | "MENTEES"): Role[] {
  if (audience === "MENTORS") return ["MENTOR"];
  if (audience === "MENTEES") return ["MENTEE"];
  return ["MENTOR", "MENTEE"];
}

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession(["ADMIN"]);

    const parsed = announcementSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { title, body, audience, sendEmail } = parsed.data;
    const activeSemester = await db.semester.findFirst({
      where: { isActive: true },
    });

    const announcement = await db.announcement.create({
      data: {
        title: sanitizeText(title),
        body: sanitizeMultiline(body),
        audience,
        semesterId: activeSemester?.id,
        createdById: session.user.id,
        emailSent: sendEmail,
      },
    });

    if (sendEmail) {
      const recipients = await db.user.findMany({
        where: { status: "APPROVED", role: { in: audienceRoles(audience) } },
        select: { email: true },
      });
      const mail = announcementEmail(announcement.title, announcement.body);
      await sendBulkMail(
        recipients.map((r) => r.email),
        mail.subject,
        mail.html
      );
    }

    return Response.json({ announcement }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
