import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";

/** PATCH /api/messages/:id/read — toggle read/unread on a received message. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireSession();
    const { id } = await params;

    const body = (await req.json().catch(() => ({}))) as { read?: boolean };
    const markRead = body.read !== false;

    const message = await db.message.findUnique({ where: { id } });
    if (!message || message.recipientId !== session.user.id) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    const updated = await db.message.update({
      where: { id },
      data: { readAt: markRead ? new Date() : null },
    });

    return Response.json({ message: updated });
  } catch (error) {
    return errorResponse(error);
  }
}
