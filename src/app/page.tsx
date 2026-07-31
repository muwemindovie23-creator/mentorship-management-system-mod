import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  MapPin,
  MessagesSquare,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { APP_NAME } from "@/lib/constants";
import { MobileNav } from "@/components/landing/mobile-nav";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { Testimonials } from "@/components/landing/testimonials";

const features = [
  {
    icon: Zap,
    tint: "teal" as const,
    title: "Automatic pairing",
    description:
      "Mentees are matched to mentors the moment they are approved — by department, shared interests and availability.",
  },
  {
    icon: Users,
    tint: "navy" as const,
    title: "Semester cohorts",
    description:
      "One cohort per semester with controlled registration windows and full archives of past programmes.",
  },
  {
    icon: MessagesSquare,
    tint: "sky" as const,
    title: "Built-in messaging",
    description:
      "Chat inside the platform, or jump straight to email and WhatsApp with one click.",
  },
  {
    icon: CalendarCheck,
    tint: "sky" as const,
    title: "Meeting logs",
    description:
      "Mentors log every session — dates, duration, topics and notes — visible to programme admins.",
  },
  {
    icon: UserCheck,
    tint: "navy" as const,
    title: "Admin approval",
    description:
      "Every account is reviewed before it can log in, keeping the cohort authentic and safe.",
  },
  {
    icon: GraduationCap,
    tint: "teal" as const,
    title: "Faculty-wide analytics",
    description:
      "Pairing statistics, meeting activity and interest trends at a glance, with CSV import/export.",
  },
];

const tintClasses: Record<"teal" | "navy" | "sky", string> = {
  teal: "bg-teal/10 text-teal dark:bg-teal/15",
  navy: "bg-navy/10 text-navy dark:bg-white/10 dark:text-foreground",
  sky: "bg-sky/15 text-sky-600 dark:bg-sky/20 dark:text-sky",
};

const steps = [
  {
    icon: ClipboardList,
    title: "Apply in minutes",
    description:
      "Tell us your department, year of study and what you're hoping to figure out this semester.",
  },
  {
    icon: Users,
    title: "Get matched",
    description:
      "We pair you with a senior mentor by department, shared interests and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Meet, weekly",
    description:
      "Regular check-ins for the full cohort, logged and visible to programme admins.",
  },
];

const events = [
  {
    badge: "Workshop",
    title: "Resume & LinkedIn Masterclass",
    when: "Aug 12 · 4:00–6:00 PM",
    where: "Engineering Block, Room 204",
  },
  {
    badge: "Webinar",
    title: "Navigating Your First Internship",
    when: "Aug 19 · 3:00–5:00 PM",
    where: "Online",
  },
  {
    badge: "Networking",
    title: "Menty Open House",
    when: "Sep 3 · 2:00–4:30 PM",
    where: "Student Union",
  },
];

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
      "Menty is recognised by partners like the Malawi Engineering Institute MUBAS Chapter as a platform for excellence and skills-building. Contributing here gives you standing with those partners — a real boost for career growth.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ---------- Sticky glass header ---------- */}
      <header className="sticky top-0 z-50 border-b border-border/50">
        <div className="glass relative">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="shrink-0">
              <Logo size={26} />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <a href="#how">How it works</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#events">Events</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#features">Features</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#testimonials">Stories</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#faq">FAQ</a>
              </Button>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-mesh-brand">
          {/* soft arch accents echoing the Menty mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full border-[56px] border-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 right-24 h-[340px] w-[340px] rounded-full border border-white/15"
          />

          <div className="container relative flex flex-col items-center gap-7 py-24 text-center sm:py-28">
            <span className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              Est. 2026 · Malawi
            </span>

            <h1 className="max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Find your guide on campus
            </h1>
            <p className="max-w-xl text-balance text-lg text-white/80">
              Menty pairs you with a fellow student who&apos;s already walked
              your road — for guidance that fits around your week, not the
              other way around.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="glass" className="text-white" asChild>
                <Link href="/register?role=mentee">Join as a mentee</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                asChild
              >
                <Link href="/register?role=mentor">Become a mentor</Link>
              </Button>
            </div>

            <div className="glass-strong relative mt-6 h-64 w-full max-w-4xl overflow-hidden rounded-2xl p-2 shadow-glass-lg sm:h-80">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/Hero.jpg"
                  alt="Menty mentorship group"
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- How it Works ---------- */}
        <section id="how" className="py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
                Three steps to your first session
              </h2>
              <p className="mt-3 text-muted-foreground">
                No lengthy onboarding — just apply, get matched, and start meeting.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, i) => (
                <Card
                  key={step.title}
                  className="animate-fade-in-up hover:shadow-glass-lg"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/10 text-teal dark:bg-teal/15">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Why I Created Menty ---------- */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="glass rounded-2xl p-6 shadow-glass sm:p-10">
              <h2 className="text-center font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
                Why I Created <span className="text-teal">{APP_NAME}</span>
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-[220px_1fr] sm:items-center">
                <div className="relative h-56 w-full overflow-hidden rounded-xl shadow-glass sm:h-full">
                  <Image
                    src="/images/founder.jpg"
                    alt="Muwe, founder of Menty"
                    fill
                    sizes="(min-width: 640px) 220px, 100vw"
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

        {/* ---------- Mentor CTA row ---------- */}
        <section className="py-20">
          <div className="container grid items-center gap-10 sm:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                For senior students
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
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
            <div className="glass relative aspect-[4/3] overflow-hidden rounded-2xl p-2 shadow-glass">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/mentor.jpeg"
                  alt="Mentor sharing experience with students"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Mentee CTA row ---------- */}
        <section className="py-20">
          <div className="container grid items-center gap-10 sm:grid-cols-2">
            <div className="glass relative order-2 aspect-[4/3] overflow-hidden rounded-2xl p-2 shadow-glass sm:order-1">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/Mentees.jpg"
                  alt="Mentees learning from senior students"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 sm:order-2">
              <span className="mb-3 inline-block rounded-full bg-sky/15 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky">
                For first years
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
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

        {/* ---------- Events ---------- */}
        <section id="events" className="py-20">
          <div className="container">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
                  Upcoming events
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Workshops and meetups, on top of your weekly mentor sessions.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {events.map((event, i) => (
                <Card
                  key={event.title}
                  className="animate-fade-in-up hover:shadow-glass-lg"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardHeader>
                    <Badge variant="secondary" className="mb-3 w-fit">
                      {event.badge}
                    </Badge>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1">
                      <CalendarCheck className="h-3.5 w-3.5 shrink-0" />
                      {event.when}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {event.where}
                    </CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Feature grid ---------- */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
                Everything a mentorship programme needs
              </h2>
              <p className="mt-3 text-muted-foreground">
                Built for institutions, designed for the students who use it
                every day.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Card
                  key={feature.title}
                  className="animate-fade-in-up hover:shadow-glass-lg"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <CardHeader>
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${tintClasses[feature.tint]}`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section id="testimonials" className="py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
                What mentees say
              </h2>
              <p className="mt-3 text-muted-foreground">
                A few voices from students who&apos;ve been through a cohort.
              </p>
            </div>
            <Testimonials />
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section id="faq" className="py-20">
          <div className="container">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-navy dark:text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-navy py-10 text-white/70">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo variant="markWhite" size={22} wordmarkClassName="text-white" />
          <p className="text-sm">
            © {new Date().getFullYear()} {APP_NAME} · Peer Mentorship
            Program Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
