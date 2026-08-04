import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { IssuesView } from "@/components/issues-view";

export const metadata = { title: "Report an issue" };
export const dynamic = "force-dynamic";

export default async function IssuesPage() {
  const session = await auth();

  const issues = await db.issueReport.findMany({
    where: { reporterId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Report an issue"
        description="Send a problem straight to the administrator and follow up here."
      />
      <IssuesView
        issues={issues.map((issue) => ({
          id: issue.id,
          subject: issue.subject,
          description: issue.description,
          status: issue.status,
          createdAt: issue.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
