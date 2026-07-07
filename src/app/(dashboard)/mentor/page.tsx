import Link from "next/link";
import { CalendarDays, Mail, MessagesSquare, Phone, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildWhatsAppLink, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Mentor dashboard" };
export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  const session = await auth();

  const profile = await db.mentorProfile.findUnique({
    where: { userId: session!.user.id },
    include: {
      semester: true,
      pairings: {
        where: { status: "ACTIVE" },
        include: {
          menteeProfile: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
              interests: { include: { interest: true } },
            },
          },
          meetings: { orderBy: { date: "desc" }, take: 1 },
        },
      },
    },
  });

  if (!profile) {
    return (
      <PageHeader
        title="No mentor profile"
        description="Your account has no mentor profile for the active semester. Contact an administrator."
      />
    );
  }

  const meetingsCount = await db.meeting.count({
    where: { pairing: { mentorProfileId: profile.id } },
  });

  const announcements = await db.announcement.findMany({
    where: { audience: { in: ["ALL", "MENTORS"] } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session!.user.name?.split(" ")[0]}`}
        description={`${profile.semester.name} · ${profile.department}`}
      >
        <Button asChild>
          <Link href="/mentor/meetings">
            <CalendarDays className="h-4 w-4" /> Log a meeting
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Assigned mentees"
          value={`${profile.pairings.length}/${profile.maxMentees}`}
          icon={Users}
        />
        <StatCard title="Meetings logged" value={meetingsCount} icon={CalendarDays} />
        <StatCard
          title="Weekly availability"
          value={`${profile.hoursPerWeek}h`}
          icon={CalendarDays}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My mentees</CardTitle>
            <CardDescription>
              Contact details and last meeting for each mentee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.pairings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No mentees assigned yet — you will be notified by email when a
                mentee is paired with you.
              </p>
            )}
            {profile.pairings.map((pairing) => {
              const mentee = pairing.menteeProfile;
              const whatsapp = buildWhatsAppLink(mentee.user.phone);
              return (
                <div key={pairing.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{mentee.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mentee.programme} · {mentee.department}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {mentee.interests.map((i) => (
                          <Badge key={i.interestId} variant="secondary">
                            {i.interest.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${mentee.user.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                      {whatsapp && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/messages">
                          <MessagesSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Last meeting:{" "}
                    {pairing.meetings[0]
                      ? `${formatDate(pairing.meetings[0].date)} — ${pairing.meetings[0].topics}`
                      : "none logged yet"}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing new.</p>
            )}
            {announcements.map((a) => (
              <div key={a.id} className="rounded-md border p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {a.body}
                </p>
              </div>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link href="/announcements">View all</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
