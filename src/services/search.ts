import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

export interface SearchResults {
  mentors: { id: string; name: string; email: string; department: string }[];
  mentees: { id: string; name: string; email: string; department: string }[];
  meetings: { id: string; topics: string; date: Date; mentor: string; mentee: string }[];
  messages: { id: string; body: string; createdAt: Date; from: string; to: string }[];
  semesters: { id: string; name: string; isActive: boolean }[];
}

/**
 * Cross-entity search. Admins search everything; mentors/mentees only
 * search their own meetings and messages plus public directory info.
 */
export async function globalSearch(
  query: string,
  userId: string,
  role: Role
): Promise<SearchResults> {
  const q = query.trim();
  const empty: SearchResults = {
    mentors: [],
    mentees: [],
    meetings: [],
    messages: [],
    semesters: [],
  };
  if (q.length < 2) return empty;

  const contains = { contains: q, mode: "insensitive" as const };
  const isAdmin = role === "ADMIN";

  const [mentors, mentees, meetings, messages, semesters] = await Promise.all([
    db.mentorProfile.findMany({
      where: {
        user: {
          status: "APPROVED",
          OR: [{ name: contains }, { email: contains }],
        },
      },
      include: { user: { select: { name: true, email: true } } },
      take: 10,
    }),
    db.menteeProfile.findMany({
      where: {
        user: {
          status: "APPROVED",
          OR: [{ name: contains }, { email: contains }],
        },
      },
      include: { user: { select: { name: true, email: true } } },
      take: 10,
    }),
    db.meeting.findMany({
      where: {
        OR: [{ topics: contains }, { notes: contains }],
        ...(isAdmin
          ? {}
          : {
              pairing: {
                OR: [
                  { mentorProfile: { userId } },
                  { menteeProfile: { userId } },
                ],
              },
            }),
      },
      include: {
        pairing: {
          include: {
            mentorProfile: { include: { user: { select: { name: true } } } },
            menteeProfile: { include: { user: { select: { name: true } } } },
          },
        },
      },
      take: 10,
      orderBy: { date: "desc" },
    }),
    db.message.findMany({
      where: {
        body: contains,
        // Messages are always private to their participants.
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: { select: { name: true } },
        recipient: { select: { name: true } },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    isAdmin
      ? db.semester.findMany({ where: { name: contains }, take: 5 })
      : Promise.resolve([]),
  ]);

  return {
    mentors: mentors.map((m) => ({
      id: m.id,
      name: m.user.name,
      email: m.user.email,
      department: m.department,
    })),
    mentees: mentees.map((m) => ({
      id: m.id,
      name: m.user.name,
      email: m.user.email,
      department: m.department,
    })),
    meetings: meetings.map((m) => ({
      id: m.id,
      topics: m.topics,
      date: m.date,
      mentor: m.pairing.mentorProfile.user.name,
      mentee: m.pairing.menteeProfile.user.name,
    })),
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body.slice(0, 120),
      createdAt: m.createdAt,
      from: m.sender.name,
      to: m.recipient.name,
    })),
    semesters: semesters.map((s) => ({
      id: s.id,
      name: s.name,
      isActive: s.isActive,
    })),
  };
}
