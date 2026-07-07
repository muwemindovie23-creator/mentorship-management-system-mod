import type {
  Announcement,
  Interest,
  Meeting,
  MenteeProfile,
  MentorProfile,
  Message,
  Pairing,
  Semester,
  User,
} from "@prisma/client";

export type SafeUser = Omit<User, "passwordHash">;

export type MentorWithRelations = MentorProfile & {
  user: SafeUser;
  interests: { interest: Interest }[];
  pairings: Pairing[];
  semester: Semester;
};

export type MenteeWithRelations = MenteeProfile & {
  user: SafeUser;
  interests: { interest: Interest }[];
  pairings: Pairing[];
  semester: Semester;
};

export type PairingWithRelations = Pairing & {
  mentorProfile: MentorProfile & { user: SafeUser };
  menteeProfile: MenteeProfile & { user: SafeUser };
  meetings: Meeting[];
};

export type MeetingWithRelations = Meeting & {
  pairing: PairingWithRelations;
};

export type ConversationSummary = {
  otherUser: Pick<SafeUser, "id" | "name" | "email" | "phone" | "role">;
  lastMessage: Message;
  unreadCount: number;
};

export type AnnouncementWithAuthor = Announcement & {
  createdBy: Pick<User, "id" | "name">;
};

export type DashboardStats = {
  mentors: number;
  mentees: number;
  pendingApprovals: number;
  waitlisted: number;
  activePairings: number;
  meetingsLogged: number;
  totalMeetingMinutes: number;
  activeSemester: Semester | null;
};
