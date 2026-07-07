import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_SECURE ?? "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email via Gmail SMTP. Failures are logged but never thrown —
 * email delivery must not break registration, approval or pairing flows.
 */
export async function sendMail({
  to,
  subject,
  html,
  text,
}: MailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn(`[mailer] SMTP not configured — skipping "${subject}"`);
    return false;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text ?? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    });
    return true;
  } catch (error) {
    console.error(`[mailer] Failed to send "${subject}"`, error);
    return false;
  }
}

/** Send the same email to many recipients individually (BCC-free). */
export async function sendBulkMail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  // Small batches to stay within Gmail rate limits.
  const BATCH = 20;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map((to) => sendMail({ to, subject, html }))
    );
    for (const ok of results) {
      if (ok) sent += 1;
      else failed += 1;
    }
  }
  return { sent, failed };
}
