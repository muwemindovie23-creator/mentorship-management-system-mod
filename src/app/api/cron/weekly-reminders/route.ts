import { db } from "@/lib/db";
import { sendMail } from "@/lib/email/mailer";
import { weeklyReminderEmail } from "@/lib/email/templates";

/**
 * Vercel Cron: Mondays 08:00 UTC (see vercel.json).
 * Sends weekly reminder emails to every approved mentor and mentee in
 * the active semester.
 */
export async function GET(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const semester = await db.semester.findFirst({
    where: { isActive: true, isArchived: false },
  });
  if (!semester) {
    return Response.json({ message: "No active semester — nothing to do" });
  }

  const users = await db.user.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { mentorProfile: { semesterId: semester.id } },
        { menteeProfile: { semesterId: semester.id } },
      ],
    },
    select: { name: true, email: true, role: true },
  });

  let sent = 0;
  for (const user of users) {
    if (user.role !== "MENTOR" && user.role !== "MENTEE") continue;
    const mail = weeklyReminderEmail(user.name, user.role);
    if (await sendMail({ to: user.email, ...mail })) sent += 1;
  }

  return Response.json({ message: `Weekly reminders sent`, sent });
}
