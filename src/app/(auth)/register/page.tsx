import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterTabs } from "@/components/forms/register-tabs";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full max-w-2xl" />}>
      <RegisterTabs />
    </Suspense>
  );
}
