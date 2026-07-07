import { db } from "@/lib/db";
import { sendMail } from "@/lib/email/mailer";
import { meetingReminderEmail } from "@/lib/email/templates";
import { formatDateTime } from "@/lib/utils";

/**
 * Vercel Cron: daily 07:00 UTC (see vercel.json).
 * Reminds both participants about meetings scheduled in the next 24h.
 */
export async function GET(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const meetings = await db.meeting.findMany({
    where: { date: { gte: now, lte: tomorrow } },
    include: {
      pairing: {
        include: {
          mentorProfile: { include: { user: true } },
          menteeProfile: { include: { user: true } },
        },
      },
    },
  });

  let sent = 0;
  for (const meeting of meetings) {
    const mentor = meeting.pairing.mentorProfile.user;
    const mentee = meeting.pairing.menteeProfile.user;
    const when = formatDateTime(meeting.date);

    const mentorMail = meetingReminderEmail(mentor.name, mentee.name, when);
    const menteeMail = meetingReminderEmail(mentee.name, mentor.name, when);

    if (await sendMail({ to: mentor.email, ...mentorMail })) sent += 1;
    if (await sendMail({ to: mentee.email, ...menteeMail })) sent += 1;
  }

  return Response.json({ message: "Meeting reminders sent", sent });
}
