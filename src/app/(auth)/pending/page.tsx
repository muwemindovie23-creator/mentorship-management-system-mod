import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Pending approval",
  robots: { index: false, follow: false },
};

export default function PendingPage() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <Clock className="mx-auto mb-2 h-12 w-12 text-warning" />
        <CardTitle>Almost there</CardTitle>
        <CardDescription>
          First, check your email and click the verification link we sent
          you. Once verified, an administrator still needs to approve your
          registration before you can log in — you&apos;ll get another email
          as soon as that happens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
