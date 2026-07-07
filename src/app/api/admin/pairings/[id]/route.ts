import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { reassignSchema } from "@/lib/validators";
import { retryWaitlist } from "@/lib/pairing";
import { sendMail } from "@/lib/email/mailer";
import {
  pairingEmailForMentee,
  pairingEmailForMentor,
} from "@/lib/email/templates";

/** PATCH /api/admin/pairings/:id — reassign the mentee to a new mentor. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);
    const { id } = await params;

    const parsed = reassignSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid payload" }, { status: 422 });
    }

    const pairing = await db.pairing.findUnique({
      where: { id },
      include: { menteeProfile: { include: { user: true } } },
    });
    if (!pairing || pairing.status !== "ACTIVE") {
      return Response.json({ error: "Active pairing not found" }, { status: 404 });
    }

    const newMentor = await db.mentorProfile.findUnique({
      where: { id: parsed.data.mentorProfileId },
      include: { user: true, pairings: { where: { status: "ACTIVE" } } },
    });
    if (!newMentor) {
      return Response.json({ error: "Mentor not found" }, { status: 404 });
    }
    if (newMentor.id === pairing.mentorProfileId) {
      return Response.json(
        { error: "Mentee is already assigned to this mentor" },
        { status: 409 }
      );
    }
    if (newMentor.pairings.length >= newMentor.maxMentees) {
      return Response.json({ error: "Mentor is at full capacity" }, { status: 409 });
    }

    const newPairing = await db.$transaction(async (tx) => {
      const activeCount = await tx.pairing.count({
        where: { mentorProfileId: newMentor.id, status: "ACTIVE" },
      });
      if (activeCount >= newMentor.maxMentees) return null;
      await tx.pairing.update({
        where: { id },
        data: { status: "ENDED", endedAt: new Date() },
      });
      return tx.pairing.create({
        data: {
          mentorProfileId: newMentor.id,
          menteeProfileId: pairing.menteeProfileId,
          semesterId: pairing.semesterId,
        },
      });
    });

    if (!newPairing) {
      return Response.json(
        { error: "Mentor reached capacity concurrently" },
        { status: 409 }
      );
    }

    const mentee = pairing.menteeProfile.user;
    const menteeMail = pairingEmailForMentee(
      mentee.name,
      newMentor.user.name,
      newMentor.user.email
    );
    const mentorMail = pairingEmailForMentor(
      newMentor.user.name,
      mentee.name,
      mentee.email
    );
    await Promise.all([
      sendMail({ to: mentee.email, ...menteeMail }),
      sendMail({ to: newMentor.user.email, ...mentorMail }),
    ]);

    // The old mentor now has a free slot — retry the waitlist.
    await retryWaitlist(pairing.semesterId);

    return Response.json({ pairing: newPairing });
  } catch (error) {
    return errorResponse(error);
  }
}

/** DELETE /api/admin/pairings/:id — end a pairing (mentee returns to waitlist). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);
    const { id } = await params;

    const pairing = await db.pairing.findUnique({ where: { id } });
    if (!pairing || pairing.status !== "ACTIVE") {
      return Response.json({ error: "Active pairing not found" }, { status: 404 });
    }

    await db.$transaction([
      db.pairing.update({
        where: { id },
        data: { status: "ENDED", endedAt: new Date() },
      }),
      db.menteeProfile.update({
        where: { id: pairing.menteeProfileId },
        data: { waitlisted: true, waitlistedAt: new Date() },
      }),
    ]);

    return Response.json({ message: "Pairing ended; mentee waitlisted" });
  } catch (error) {
    return errorResponse(error);
  }
}
