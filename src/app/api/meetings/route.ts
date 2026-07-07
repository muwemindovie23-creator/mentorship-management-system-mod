import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { meetingLogSchema } from "@/lib/validators";
import { sanitizeText, sanitizeMultiline } from "@/lib/sanitize";

/** GET /api/meetings — meetings visible to the current user. */
export async function GET(): Promise<Response> {
  try {
    const session = await requireSession();
    const { id: userId, role } = session.user;

    const meetings = await db.meeting.findMany({
      where:
        role === "ADMIN"
          ? {}
          : {
              pairing: {
                OR: [
                  { mentorProfile: { userId } },
                  { menteeProfile: { userId } },
                ],
              },
            },
      include: {
        pairing: {
          include: {
            mentorProfile: { include: { user: { select: { name: true } } } },
            menteeProfile: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { date: "desc" },
      take: 200,
    });

    return Response.json({ meetings });
  } catch (error) {
    return errorResponse(error);
  }
}

/** POST /api/meetings — mentors log a meeting for one of their pairings. */
export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession(["MENTOR", "ADMIN"]);

    const parsed = meetingLogSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const pairing = await db.pairing.findUnique({
      where: { id: parsed.data.pairingId },
      include: { mentorProfile: true },
    });
    if (!pairing) {
      return Response.json({ error: "Pairing not found" }, { status: 404 });
    }

    // Mentors may only log meetings for their own pairings.
    if (
      session.user.role === "MENTOR" &&
      pairing.mentorProfile.userId !== session.user.id
    ) {
      return Response.json({ error: "Not your pairing" }, { status: 403 });
    }

    const meeting = await db.meeting.create({
      data: {
        pairingId: pairing.id,
        date: parsed.data.date,
        durationMinutes: parsed.data.durationMinutes,
        topics: sanitizeText(parsed.data.topics),
        notes: parsed.data.notes ? sanitizeMultiline(parsed.data.notes) : null,
        createdById: session.user.id,
      },
    });

    return Response.json({ meeting }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
