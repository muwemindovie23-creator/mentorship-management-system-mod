import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  MessagesSquare,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    icon: Zap,
    title: "Automatic pairing",
    description:
      "Mentees are matched to mentors the moment they are approved — by department, shared interests and availability.",
  },
  {
    icon: Users,
    title: "Semester cohorts",
    description:
      "One cohort per semester with controlled registration windows and full archives of past programmes.",
  },
  {
    icon: MessagesSquare,
    title: "Built-in messaging",
    description:
      "Chat inside the platform, or jump straight to email and WhatsApp with one click.",
  },
  {
    icon: CalendarCheck,
    title: "Meeting logs",
    description:
      "Mentors log every session — dates, duration, topics and notes — visible to programme admins.",
  },
  {
    icon: UserCheck,
    title: "Admin approval",
    description:
      "Every account is reviewed before it can log in, keeping the cohort authentic and safe.",
  },
  {
    icon: GraduationCap,
    title: "Faculty-wide analytics",
    description:
      "Pairing statistics, meeting activity and interest trends at a glance, with CSV import/export.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            {APP_NAME}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center gap-6 py-24 text-center">
          <span className="rounded-full border px-4 py-1 text-sm text-muted-foreground">
            Menty - Peer Mentorship Programme
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Every first year student deserves a{" "}
            <span className="text-primary">great mentor</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Register as a mentor or mentee, get matched automatically, keep in
            touch, and track every meeting — all in one modern platform built
            for first year mentees.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register?role=mentee">Join as a mentee</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register?role=mentor">Become a mentor</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/40 py-20">
          <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="animate-fade-in">
                <CardHeader>
                  <feature.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Menty - Peer Mentorship Program Platform
      
        </div>
      </footer>
    </div>
  );
}
