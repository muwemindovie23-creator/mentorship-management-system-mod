 "use client";

import { Quote } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: "amara",
    name: "Amara",
    role: "Year 1 · Civil Engineering",
    quote:
      "Before Menty I had no idea how to prepare for internship interviews. My mentor walked me through everything, and now I'm choosing between two offers.",
    mentor: "Mentored by a Year 4 Civil student",
  },
  {
    id: "thoko",
    name: "Thoko",
    role: "Year 1 · Electrical & Electronics Engineering",
    quote:
      "University felt overwhelming until Menty paired me with someone who'd been exactly where I was. The weekly check-ins alone were worth signing up.",
    mentor: "Mentored by a Year 3 Electrical student",
  },
  {
    id: "chikondi",
    name: "Chikondi",
    role: "Year 1 · Mechanical Engineering",
    quote:
      "My mentor helped me pick modules strategically and pointed me toward research opportunities I never knew existed in our department.",
    mentor: "Mentored by a Year 4 Mechanical student",
  },
];

export function Testimonials() {
  return (
    <Tabs defaultValue={testimonials[0].id} className="mx-auto max-w-3xl">
      <TabsList className="mx-auto flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
        {testimonials.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium data-[state=active]:border-teal data-[state=active]:bg-teal/10 data-[state=active]:text-teal data-[state=active]:shadow-none"
          >
            {t.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {testimonials.map((t) => (
        <TabsContent key={t.id} value={t.id} className="mt-8 focus-visible:outline-none">
          <div className="glass rounded-2xl p-8 shadow-glass sm:p-10">
            <Quote className="h-8 w-8 text-teal/60" />
            <p className="mt-4 text-balance font-display text-lg leading-relaxed text-navy dark:text-foreground sm:text-xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-navy/10 font-display font-semibold text-navy dark:bg-white/10 dark:text-foreground">
                  {t.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-navy dark:text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.role} · {t.mentor}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
