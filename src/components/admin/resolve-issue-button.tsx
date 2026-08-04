"use client";

import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useApiAction } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

export function ResolveIssueButton({ id }: { id: string }) {
  const router = useRouter();
  const { run, pending } = useApiAction();

  const resolve = async () => {
    await run(`/api/admin/issues/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "RESOLVED" }),
      successMessage: "Issue marked resolved",
    });
    router.refresh();
  };

  return (
    <Button size="sm" variant="outline" disabled={pending} onClick={resolve}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4 text-success" />
      )}
      Resolve
    </Button>
  );
}
