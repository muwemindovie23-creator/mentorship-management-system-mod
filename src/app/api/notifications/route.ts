import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";

/** GET /api/notifications — the current user's notifications. */
export async function GET(): Promise<Response> {
  try {
    const session = await requireSession();

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return Response.json({ notifications });
  } catch (error) {
    return errorResponse(error);
  }
}

/** PATCH /api/notifications — mark all as read. */
export async function PATCH(): Promise<Response> {
  try {
    const session = await requireSession();

    await db.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: new Date() },
    });

    return Response.json({ message: "Notifications marked as read" });
  } catch (error) {
    return errorResponse(error);
  }
}
