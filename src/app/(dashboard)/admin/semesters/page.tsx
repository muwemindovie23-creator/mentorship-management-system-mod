import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { SemestersManager } from "@/components/admin/semesters-manager";

export const metadata = { title: "Semesters" };
export const dynamic = "force-dynamic";

export default async function AdminSemestersPage() {
  const semesters = await db.semester.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: {
        select: { mentorProfiles: true, menteeProfiles: true, pairings: true },
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Semester management"
        description="One cohort per semester. Create, activate, archive and control registration."
      />
      <SemestersManager
        semesters={semesters.map((s) => ({
          id: s.id,
          name: s.name,
          startDate: s.startDate.toISOString(),
          endDate: s.endDate.toISOString(),
          isActive: s.isActive,
          registrationOpen: s.registrationOpen,
          isArchived: s.isArchived,
          mentors: s._count.mentorProfiles,
          mentees: s._count.menteeProfiles,
          pairings: s._count.pairings,
        }))}
      />
    </>
  );
}
