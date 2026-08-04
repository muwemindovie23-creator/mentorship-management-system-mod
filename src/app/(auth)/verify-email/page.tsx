import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";

export const metadata = {
  title: "Verify email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
