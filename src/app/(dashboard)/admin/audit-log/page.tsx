import { PageHeader } from "@/components/layout/page-header";
import { AuditLogTable } from "@/components/admin/audit-log-table";

export const metadata = { title: "Audit log" };

export default function AuditLogPage() {
  return (
    <>
      <PageHeader
        title="Audit log"
        description="A record of admin actions across the platform."
      />
      <AuditLogTable />
    </>
  );
}
