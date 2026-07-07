import { db } from "@/lib/db";
import type { ConversationSummary } from "@/types";

/** Group a user's messages into conversation summaries. */
export async function getConversations(
  userId: string
): Promise<ConversationSummary[]> {
  const messages = await db.message.findMany({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, email: true, phone: true, role: true } },
      recipient: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });

  const byOther = new Map<string, ConversationSummary>();

  for (const message of messages) {
    const other =
      message.senderId === userId ? message.recipient : message.sender;
    const existing = byOther.get(other.id);
    const unread =
      message.recipientId === userId && message.readAt === null ? 1 : 0;

    if (!existing) {
      byOther.set(other.id, {
        otherUser: other,
        lastMessage: message,
        unreadCount: unread,
      });
    } else {
      existing.unreadCount += unread;
    }
  }

  return [...byOther.values()];
}

/** Users the current user is allowed to message. */
export async function getMessagingContacts(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      mentorProfile: {
        include: {
          pairings: {
            where: { status: "ACTIVE" },
            include: { menteeProfile: { include: { user: true } } },
          },
        },
      },
      menteeProfile: {
        include: {
          pairings: {
            where: { status: "ACTIVE" },
            include: { mentorProfile: { include: { user: true } } },
          },
        },
      },
    },
  });
  if (!user) return [];

  const contacts = new Map<
    string,
    { id: string; name: string; email: string; role: string }
  >();

  const admins = await db.user.findMany({
    where: { role: "ADMIN", status: "APPROVED", NOT: { id: userId } },
    select: { id: true, name: true, email: true, role: true },
  });
  for (const admin of admins) contacts.set(admin.id, admin);

  if (user.role === "ADMIN") {
    const everyone = await db.user.findMany({
      where: { status: "APPROVED", NOT: { id: userId } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });
    for (const person of everyone) contacts.set(person.id, person);
  }

  for (const pairing of user.mentorProfile?.pairings ?? []) {
    const mentee = pairing.menteeProfile.user;
    contacts.set(mentee.id, {
      id: mentee.id,
      name: mentee.name,
      email: mentee.email,
      role: mentee.role,
    });
  }
  for (const pairing of user.menteeProfile?.pairings ?? []) {
    const mentor = pairing.mentorProfile.user;
    contacts.set(mentor.id, {
      id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      role: mentor.role,
    });
  }

  return [...contacts.values()];
}

/** Whether sender may message recipient (paired, or either is admin). */
export async function canMessage(
  senderId: string,
  recipientId: string
): Promise<boolean> {
  if (senderId === recipientId) return false;
  const contacts = await getMessagingContacts(senderId);
  return contacts.some((c) => c.id === recipientId);
}
