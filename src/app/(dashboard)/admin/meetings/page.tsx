import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = { title: "Meeting logs" };
export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage() {
  const meetings = await db.meeting.findMany({
    include: {
      pairing: {
        include: {
          mentorProfile: { include: { user: { select: { name: true } } } },
          menteeProfile: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { date: "desc" },
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="Meeting logs"
        description="Every meeting logged by mentors across the programme."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden lg:table-cell">Topics</TableHead>
                <TableHead className="hidden xl:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No meetings have been logged yet.
                  </TableCell>
                </TableRow>
              )}
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{formatDate(meeting.date)}</TableCell>
                  <TableCell>
                    {meeting.pairing.mentorProfile.user.name}
                  </TableCell>
                  <TableCell>
                    {meeting.pairing.menteeProfile.user.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {meeting.durationMinutes} min
                  </TableCell>
                  <TableCell className="hidden max-w-64 truncate lg:table-cell">
                    {meeting.topics}
                  </TableCell>
                  <TableCell className="hidden max-w-64 truncate xl:table-cell">
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
