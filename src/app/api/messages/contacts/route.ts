import { requireSession, errorResponse } from "@/lib/authz";
import { getMessagingContacts } from "@/services/messages";

/** GET /api/messages/contacts — who the current user may message. */
export async function GET(): Promise<Response> {
  try {
    const session = await requireSession();
    const contacts = await getMessagingContacts(session.user.id);
    return Response.json({ contacts });
  } catch (error) {
    return errorResponse(error);
  }
}
