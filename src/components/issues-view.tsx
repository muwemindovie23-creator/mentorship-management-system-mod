"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReportIssueDialog } from "@/components/report-issue-dialog";
import { formatDateTime } from "@/lib/utils";

export interface IssueRow {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
}

export function IssuesView({ issues }: { issues: IssueRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Flag className="h-4 w-4" /> Report an issue
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          {issues.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t reported anything yet.
            </p>
          )}
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-lg border p-4">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{issue.subject}</h3>
                <Badge variant={issue.status === "OPEN" ? "warning" : "success"}>
                  {issue.status === "OPEN" ? "Open" : "Resolved"}
                </Badge>
              </div>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {issue.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Reported {formatDateTime(issue.createdAt)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <ReportIssueDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
