import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.status !== "APPROVED") redirect("/pending");

  return (
    <div className="flex min-h-screen">
      <AppSidebar role={session.user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar
          user={{
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            role: session.user.role,
          }}
        />
        <main className="flex-1 space-y-6 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
