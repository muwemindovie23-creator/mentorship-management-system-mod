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

export const metadata = { title: "Pending approval" };

export default function PendingPage() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <Clock className="mx-auto mb-2 h-12 w-12 text-warning" />
        <CardTitle>Your account is pending approval</CardTitle>
        <CardDescription>
          An administrator needs to approve your registration before you can
          log in. You will receive an email as soon as your account has been
          reviewed.
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
