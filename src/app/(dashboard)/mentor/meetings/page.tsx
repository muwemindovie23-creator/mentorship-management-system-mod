import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MeetingLogForm } from "@/components/forms/meeting-log-form";

export const metadata = { title: "Meetings" };
export const dynamic = "force-dynamic";

export default async function MentorMeetingsPage() {
  const session = await auth();

  const pairings = await db.pairing.findMany({
    where: { status: "ACTIVE", mentorProfile: { userId: session!.user.id } },
    include: {
      menteeProfile: { include: { user: { select: { name: true } } } },
    },
  });

  const meetings = await db.meeting.findMany({
    where: { pairing: { mentorProfile: { userId: session!.user.id } } },
    include: {
      pairing: {
        include: {
          menteeProfile: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const now = new Date();
  const upcoming = meetings.filter((m) => m.date > now);
  const past = meetings.filter((m) => m.date <= now);

  return (
    <>
      <PageHeader
        title="Meetings"
        description="Log mentorship meetings and review your history."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <MeetingLogForm
          pairings={pairings.map((p) => ({
            id: p.id,
            menteeName: p.menteeProfile.user.name,
          }))}
        />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming meetings</CardTitle>
            <CardDescription>
              Meetings logged with a future date (reminders are emailed a day
              before).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing scheduled. Log a meeting with a future date to plan
                ahead.
              </p>
            )}
            {upcoming.map((meeting) => (
              <div key={meeting.id} className="rounded-md border p-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{meeting.pairing.menteeProfile.user.name}</span>
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <p className="text-muted-foreground">{meeting.topics}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="hidden md:table-cell">Topics</TableHead>
                <TableHead className="hidden lg:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {past.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No meetings logged yet.
                  </TableCell>
                </TableRow>
              )}
              {past.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{formatDate(meeting.date)}</TableCell>
                  <TableCell>
                    {meeting.pairing.menteeProfile.user.name}
                  </TableCell>
                  <TableCell>{meeting.durationMinutes} min</TableCell>
                  <TableCell className="hidden max-w-64 truncate md:table-cell">
                    {meeting.topics}
                  </TableCell>
                  <TableCell className="hidden max-w-64 truncate lg:table-cell">
                    {meeting.notes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
