import { escapeHtml } from "@/lib/sanitize";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Engineering Mentorship";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function layout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1d4ed8;padding:20px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:bold;">${escapeHtml(APP_NAME)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;">${escapeHtml(title)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#64748b;">
                  Faculty of Engineering Mentorship Programme ·
                  <a href="${APP_URL}" style="color:#1d4ed8;">Open dashboard</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:24px 0;">
    <a href="${href}" style="background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;display:inline-block;">${escapeHtml(label)}</a>
  </p>`;
}

export function registrationReceivedEmail(name: string) {
  return {
    subject: `${APP_NAME}: Registration received`,
    html: layout(
      "Registration received",
      `<p>Hi ${escapeHtml(name)},</p>
       <p>Thank you for registering for the Faculty of Engineering mentorship programme.</p>
       <p>Your account is now <strong>pending approval</strong> by an administrator. You will receive another email as soon as it has been reviewed.</p>`
    ),
  };
}

export function accountApprovedEmail(name: string) {
  return {
    subject: `${APP_NAME}: Your account has been approved`,
    html: layout(
      "Account approved 🎉",
      `<p>Hi ${escapeHtml(name)},</p>
       <p>Your account has been approved. You can now log in to the mentorship platform.</p>
       ${button(`${APP_URL}/login`, "Log in")}`
    ),
  };
}

export function accountRejectedEmail(name: string) {
  return {
    subject: `${APP_NAME}: Registration update`,
    html: layout(
      "Registration not approved",
      `<p>Hi ${escapeHtml(name)},</p>
       <p>Unfortunately your registration for the mentorship programme was not approved at this time. If you believe this is a mistake, please contact the programme coordinator.</p>`
    ),
  };
}

export function pairingEmailForMentee(
  menteeName: string,
  mentorName: string,
  mentorEmail: string
) {
  return {
    subject: `${APP_NAME}: You have been matched with a mentor`,
    html: layout(
      "You have a mentor!",
      `<p>Hi ${escapeHtml(menteeName)},</p>
       <p>You have been paired with <strong>${escapeHtml(mentorName)}</strong> (${escapeHtml(mentorEmail)}).</p>
       <p>Log in to view their profile, send a message and plan your first meeting.</p>
       ${button(`${APP_URL}/mentee`, "View my mentor")}`
    ),
  };
}

export function pairingEmailForMentor(
  mentorName: string,
  menteeName: string,
  menteeEmail: string
) {
  return {
    subject: `${APP_NAME}: A new mentee has been assigned to you`,
    html: layout(
      "New mentee assigned",
      `<p>Hi ${escapeHtml(mentorName)},</p>
       <p><strong>${escapeHtml(menteeName)}</strong> (${escapeHtml(menteeEmail)}) has been assigned to you as a mentee.</p>
       <p>Please reach out within the next few days to arrange an introductory meeting.</p>
       ${button(`${APP_URL}/mentor`, "View my mentees")}`
    ),
  };
}

export function waitlistAdminEmail(menteeName: string, department: string) {
  return {
    subject: `${APP_NAME}: Mentee waitlisted — no mentor available`,
    html: layout(
      "Mentee added to waitlist",
      `<p><strong>${escapeHtml(menteeName)}</strong> (${escapeHtml(department)}) was approved but no suitable mentor with free capacity was found.</p>
       <p>They have been placed on the waitlist. Pairing will retry automatically when a new mentor becomes available, or you can assign one manually.</p>
       ${button(`${APP_URL}/admin/pairings`, "Manage pairings")}`
    ),
  };
}

export function weeklyReminderEmail(name: string, role: "MENTOR" | "MENTEE") {
  const action =
    role === "MENTOR"
      ? "check in with your mentees and log any meetings you have held"
      : "reach out to your mentor if you have not met recently";
  return {
    subject: `${APP_NAME}: Weekly mentorship reminder`,
    html: layout(
      "Weekly reminder",
      `<p>Hi ${escapeHtml(name)},</p>
       <p>This is your weekly nudge to ${action}.</p>
       ${button(APP_URL, "Open dashboard")}`
    ),
  };
}

export function meetingReminderEmail(
  name: string,
  otherName: string,
  when: string
) {
  return {
    subject: `${APP_NAME}: Upcoming mentorship meeting`,
    html: layout(
      "Meeting reminder",
      `<p>Hi ${escapeHtml(name)},</p>
       <p>You have a mentorship meeting with <strong>${escapeHtml(otherName)}</strong> on <strong>${escapeHtml(when)}</strong>.</p>`
    ),
  };
}

export function announcementEmail(title: string, body: string) {
  const paragraphs = body
    .split(/\n+/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  return {
    subject: `${APP_NAME}: ${title}`,
    html: layout(title, paragraphs),
  };
}

export function bulkEmail(subject: string, body: string) {
  const paragraphs = body
    .split(/\n+/)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  return { subject, html: layout(subject, paragraphs) };
}
