import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildWhatsAppLink, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export const metadata = { title: "My mentees" };
export const dynamic = "force-dynamic";

export default async function MentorMenteesPage() {
  const session = await auth();

  const pairings = await db.pairing.findMany({
    where: {
      status: "ACTIVE",
      mentorProfile: { userId: session!.user.id },
    },
    include: {
      menteeProfile: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
          interests: { include: { interest: true } },
        },
      },
      meetings: { orderBy: { date: "desc" } },
    },
  });

  return (
    <>
      <PageHeader
        title="My mentees"
        description="Full profiles and meeting history for each of your mentees."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {pairings.length === 0 && (
          <p className="text-muted-foreground">No mentees assigned yet.</p>
        )}
        {pairings.map((pairing) => {
          const mentee = pairing.menteeProfile;
          const whatsapp = buildWhatsAppLink(mentee.user.phone);
          return (
            <Card key={pairing.id}>
              <CardHeader>
                <CardTitle>{mentee.user.name}</CardTitle>
                <CardDescription>
                  {mentee.programme} · {mentee.department} ·{" "}
                  {mentee.registrationNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${mentee.user.email}`}>
                      <Mail className="h-4 w-4" /> {mentee.user.email}
                    </a>
                  </Button>
                  {whatsapp && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {mentee.interests.map((i) => (
                    <Badge key={i.interestId} variant="secondary">
                      {i.interest.name}
                    </Badge>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Meeting history ({pairing.meetings.length})
                  </p>
                  <div className="space-y-2">
                    {pairing.meetings.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No meetings logged yet.
                      </p>
                    )}
                    {pairing.meetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="rounded-md border p-3 text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {formatDate(meeting.date)}
                          </span>
                          <span className="text-muted-foreground">
                            {meeting.durationMinutes} min
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {meeting.topics}
                        </p>
                        {meeting.notes && (
                          <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground">
                            {meeting.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
