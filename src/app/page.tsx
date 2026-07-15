import Link from "next/link";
import Image from "next/image";
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

// New: FAQ content from the Figma redesign
const faqs = [
  {
    question: "Is Menty free for mentees?",
    answer:
      "Absolutely! But to keep the platform sustainable, as a mentee you'll be required to register as a mentor once you reach upper years. First come, first served.",
  },
  {
    question: "What is the criteria for volunteering as a mentor?",
    answer:
      "You must be in upper years and passionate about guiding others. Grades aren't the only criteria, though we do encourage students with strong academic standing to register as mentors.",
  },
  {
    question: "What's in it for me if I volunteer as a mentor?",
    answer:
      "Menty is recognised by partners like the Malawi Engineering Institute as a platform for excellence and skills-building. Contributing here gives you standing with those partners — a real boost for career growth.",
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
        {/* ---------- Hero (copy updated to match the Figma redesign) ---------- */}
        <section className="container flex flex-col items-center gap-6 py-24 text-center">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Menty {" "}
            <span className="text-primary">- The Peer Mentorship Program Platform</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Find a mentor who&apos;s been in your shoes not long ago, your
            fellow student!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/register?role=mentee">Join as a mentee</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register?role=mentor">Become a mentor</Link>
            </Button>
          </div>

          <div className="relative mt-4 h-64 w-full max-w-4xl overflow-hidden rounded-2xl sm:h-80">
            <Image
              src="/images/Hero.jpg"
              alt="Menty mentorship group"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* ---------- New: Why I Created Menty ---------- */}
        <section className="border-t py-20">
          <div className="container max-w-4xl">
            <div className="rounded-2xl border bg-card p-6 sm:p-10">
              <h2 className="text-center text-2xl font-bold sm:text-3xl">
                Why I Created <span className="text-primary">{APP_NAME}</span>
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-center">
                <div className="relative h-56 w-full overflow-hidden rounded-xl sm:h-full">
                  <Image
                    src="/images/founder.jpg"
                    alt="Muwe, founder of Menty"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Hi, I&apos;m Muwe! In 2025, I contested to be the Director of
                  Academics at MUBAS with the motto &quot;Resources for Every
                  Student, success for all&quot;. My core belief is that every
                  student has the potential of academic excellence given
                  enough resources and direction. That&apos;s when the idea of
                  pioneering a mentorship program platform began. Through this
                  platform, I hope every first year student never has to feel
                  lost and unguided because they joined {APP_NAME}!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- New: Mentor CTA row ---------- */}
        <section className="border-t bg-muted/40 py-20">
          <div className="container grid items-center gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">
                Share your experience with first year students
              </h3>
              <p className="mt-4 text-muted-foreground">
                Imagine everything you have learned and gone through while
                trying to adapt to uni life. Surely, there must be a greater
                purpose for facing all those trials and tribulations. Share
                with the younger generation and let&apos;s grow together!
              </p>
              <Button size="lg" className="mt-6" asChild>
                <Link href="/register?role=mentor">Volunteer as a mentor</Link>
              </Button>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/mentor.jpeg"
                alt="Mentor sharing experience with students"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ---------- New: Mentee CTA row ---------- */}
        <section className="border-t py-20">
          <div className="container grid items-center gap-8 sm:grid-cols-2">
            <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl sm:order-1">
              <Image
                src="/images/mentees.jpg"
                alt="Mentees learning from senior students"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 sm:order-2">
              <h3 className="text-2xl font-bold sm:text-3xl">
                Learn from senior students
              </h3>
              <p className="mt-4 text-muted-foreground">
                Navigating uni for the first time can be quite the rocky
                road. Who better to learn from than students who&apos;ve
                passed that road and come out victorious?
              </p>
              <Button size="lg" className="mt-6" asChild>
                <Link href="/register?role=mentee">Join as a mentee</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---------- Existing feature grid — unchanged, already covers 3 of the
            Figma redesign's highlighted features (Automatic pairing, Built-in
            messaging, Admin approval) plus 3 more you already had ---------- */}
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

        {/* ---------- New: FAQ ---------- */}
        <section className="border-t py-20">
          <div className="container">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Frequently Asked Questions – FAQs
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                    <CardDescription>{faq.answer}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
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
