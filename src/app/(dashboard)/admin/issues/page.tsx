import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResolveIssueButton } from "@/components/admin/resolve-issue-button";

export const metadata = { title: "Issue reports" };
export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  const issues = await db.issueReport.findMany({
    include: { reporter: { select: { name: true, email: true, role: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="Issue reports"
        description="Problems reported by mentors and mentees, straight to you."
      />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No issues have been reported.
                  </TableCell>
                </TableRow>
              )}
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(issue.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{issue.reporter.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {issue.reporter.email}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48">{issue.subject}</TableCell>
                  <TableCell className="hidden max-w-96 whitespace-pre-wrap lg:table-cell">
                    {issue.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.status === "OPEN" ? "warning" : "success"}>
                      {issue.status === "OPEN" ? "Open" : "Resolved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {issue.status === "OPEN" && (
                      <ResolveIssueButton id={issue.id} />
                    )}
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
