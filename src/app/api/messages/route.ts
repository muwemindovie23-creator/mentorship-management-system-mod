import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { messageSchema } from "@/lib/validators";
import { sanitizeMultiline } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { canMessage, getConversations } from "@/services/messages";

/**
 * GET /api/messages            — conversation summaries
 * GET /api/messages?with=userId — full thread with one user
 */
export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireSession();
    const url = new URL(req.url);
    const withUserId = url.searchParams.get("with");

    if (!withUserId) {
      const conversations = await getConversations(session.user.id);
      return Response.json({ conversations });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, recipientId: withUserId },
          { senderId: withUserId, recipientId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 500,
    });

    // Opening a thread marks incoming messages as read.
    await db.message.updateMany({
      where: {
        senderId: withUserId,
        recipientId: session.user.id,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    const other = await db.user.findUnique({
      where: { id: withUserId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return Response.json({ messages, other });
  } catch (error) {
    return errorResponse(error);
  }
}

/** POST /api/messages — send a message. */
export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireSession();

    const limit = rateLimit(`messages:${session.user.id}`, {
      limit: 60,
      windowMs: 60 * 1000,
    });
    if (!limit.success) {
      return Response.json({ error: "Slow down a little" }, { status: 429 });
    }

    const parsed = messageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const allowed = await canMessage(session.user.id, parsed.data.recipientId);
    if (!allowed) {
      return Response.json(
        { error: "You can only message your mentor, mentees or admins" },
        { status: 403 }
      );
    }

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        recipientId: parsed.data.recipientId,
        body: sanitizeMultiline(parsed.data.body),
      },
    });

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
