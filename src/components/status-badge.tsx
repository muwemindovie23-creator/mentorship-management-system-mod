import type { UserStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: UserStatus }) {
  switch (status) {
    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="warning">Pending</Badge>;
  }
}
