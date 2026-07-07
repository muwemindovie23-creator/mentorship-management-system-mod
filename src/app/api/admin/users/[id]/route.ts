import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { userDecisionSchema } from "@/lib/validators";
import { attemptPairing, retryWaitlist } from "@/lib/pairing";
import { sendMail } from "@/lib/email/mailer";
import {
  accountApprovedEmail,
  accountRejectedEmail,
} from "@/lib/email/templates";

/** PATCH /api/admin/users/:id — approve or reject a pending account. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireSession(["ADMIN"]);
    const { id } = await params;

    const parsed = userDecisionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid action" }, { status: 422 });
    }

    const user = await db.user.findUnique({
      where: { id },
      include: { mentorProfile: true, menteeProfile: true },
    });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if (user.id === session.user.id) {
      return Response.json(
        { error: "You cannot change your own status" },
        { status: 400 }
      );
    }

    const status = parsed.data.action === "approve" ? "APPROVED" : "REJECTED";
    await db.user.update({ where: { id }, data: { status } });

    let pairing: { status: string } | null = null;

    if (status === "APPROVED") {
      const mail = accountApprovedEmail(user.name);
      await sendMail({ to: user.email, ...mail });

      if (user.role === "MENTEE" && user.menteeProfile) {
        // Automatic pairing immediately after approval.
        pairing = await attemptPairing(user.menteeProfile.id);
      }
      if (user.role === "MENTOR" && user.mentorProfile) {
        // A new mentor is available — retry the waitlist.
        const paired = await retryWaitlist(user.mentorProfile.semesterId);
        pairing = { status: `waitlist-retried:${paired}` };
      }
    } else {
      const mail = accountRejectedEmail(user.name);
      await sendMail({ to: user.email, ...mail });
    }

    return Response.json({ message: `User ${status.toLowerCase()}`, pairing });
  } catch (error) {
    return errorResponse(error);
  }
}

/** DELETE /api/admin/users/:id — remove an account entirely. */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireSession(["ADMIN"]);
    const { id } = await params;

    if (id === session.user.id) {
      return Response.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await db.user.delete({ where: { id } });
    return Response.json({ message: "User deleted" });
  } catch (error) {
    return errorResponse(error);
  }
}
