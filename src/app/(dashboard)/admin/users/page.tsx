import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersTable } from "@/components/admin/users-table";

export const metadata = { title: "User management" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="User management"
        description="Approve, reject, filter and manage every account."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <UsersTable />
      </Suspense>
    </>
  );
}
