import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Meeting schedule" };
export const dynamic = "force-dynamic";

export default async function MenteeMeetingsPage() {
  const session = await auth();

  const meetings = await db.meeting.findMany({
    where: { pairing: { menteeProfile: { userId: session!.user.id } } },
    include: {
      pairing: {
        include: {
          mentorProfile: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const now = new Date();
  const upcoming = meetings.filter((m) => m.date > now).reverse();
  const past = meetings.filter((m) => m.date <= now);

  return (
    <>
      <PageHeader
        title="Meeting schedule"
        description="Upcoming and past meetings with your mentor."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>
              You will get an email reminder the day before.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing scheduled yet.
              </p>
            )}
            {upcoming.map((meeting) => (
              <div key={meeting.id} className="rounded-md border p-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{meeting.pairing.mentorProfile.user.name}</span>
                  <span>{formatDateTime(meeting.date)}</span>
                </div>
                <p className="text-muted-foreground">{meeting.topics}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {past.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No meetings logged yet.
              </p>
            )}
            {past.map((meeting) => (
              <div key={meeting.id} className="rounded-md border p-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{formatDate(meeting.date)}</span>
                  <span className="text-muted-foreground">
                    {meeting.durationMinutes} min
                  </span>
                </div>
                <p className="text-muted-foreground">{meeting.topics}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
