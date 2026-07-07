import { db } from "@/lib/db";
import type { DashboardStats } from "@/types";

export async function getActiveSemester() {
  return db.semester.findFirst({ where: { isActive: true, isArchived: false } });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const activeSemester = await getActiveSemester();
  const semesterFilter = activeSemester ? { semesterId: activeSemester.id } : {};

  const [
    mentors,
    mentees,
    pendingApprovals,
    waitlisted,
    activePairings,
    meetingAgg,
  ] = await Promise.all([
    db.mentorProfile.count({
      where: { ...semesterFilter, user: { status: "APPROVED" } },
    }),
    db.menteeProfile.count({
      where: { ...semesterFilter, user: { status: "APPROVED" } },
    }),
    db.user.count({ where: { status: "PENDING" } }),
    db.menteeProfile.count({
      where: { ...semesterFilter, waitlisted: true, user: { status: "APPROVED" } },
    }),
    db.pairing.count({ where: { ...semesterFilter, status: "ACTIVE" } }),
    db.meeting.aggregate({
      where: activeSemester
        ? { pairing: { semesterId: activeSemester.id } }
        : {},
      _count: { id: true },
      _sum: { durationMinutes: true },
    }),
  ]);

  return {
    mentors,
    mentees,
    pendingApprovals,
    waitlisted,
    activePairings,
    meetingsLogged: meetingAgg._count.id,
    totalMeetingMinutes: meetingAgg._sum.durationMinutes ?? 0,
    activeSemester,
  };
}

export interface AnalyticsData {
  pairingsByDepartment: { department: string; count: number }[];
  meetingsPerWeek: { week: string; count: number }[];
  interestPopularity: { name: string; count: number }[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const activeSemester = await getActiveSemester();
  const semesterId = activeSemester?.id;

  const pairings = await db.pairing.findMany({
    where: semesterId ? { semesterId, status: "ACTIVE" } : { status: "ACTIVE" },
    include: { menteeProfile: { select: { department: true } } },
  });

  const byDept = new Map<string, number>();
  for (const p of pairings) {
    const d = p.menteeProfile.department;
    byDept.set(d, (byDept.get(d) ?? 0) + 1);
  }

  const meetings = await db.meeting.findMany({
    where: semesterId ? { pairing: { semesterId } } : {},
    select: { date: true },
    orderBy: { date: "asc" },
  });

  const byWeek = new Map<string, number>();
  for (const m of meetings) {
    const date = new Date(m.date);
    const year = date.getFullYear();
    const firstDay = new Date(year, 0, 1);
    const week = Math.ceil(
      ((date.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7
    );
    const key = `${year}-W${String(week).padStart(2, "0")}`;
    byWeek.set(key, (byWeek.get(key) ?? 0) + 1);
  }

  const interestCounts = await db.interest.findMany({
    include: { _count: { select: { mentors: true, mentees: true } } },
  });

  return {
    pairingsByDepartment: [...byDept.entries()]
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count),
    meetingsPerWeek: [...byWeek.entries()].map(([week, count]) => ({
      week,
      count,
    })),
    interestPopularity: interestCounts
      .map((i) => ({
        name: i.name,
        count: i._count.mentors + i._count.mentees,
      }))
      .filter((i) => i.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
