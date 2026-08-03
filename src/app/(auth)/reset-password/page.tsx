import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
