import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import type { Audience } from "@prisma/client";

/** GET /api/announcements — announcements visible to the current user. */
export async function GET(): Promise<Response> {
  try {
    const session = await requireSession();

    const audiences: Audience[] =
      session.user.role === "MENTOR"
        ? ["ALL", "MENTORS"]
        : session.user.role === "MENTEE"
          ? ["ALL", "MENTEES"]
          : ["ALL", "MENTORS", "MENTEES"];

    const announcements = await db.announcement.findMany({
      where: { audience: { in: audiences } },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json({ announcements });
  } catch (error) {
    return errorResponse(error);
  }
}
