"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/pairings", label: "Pairings", icon: Handshake },
    { href: "/admin/semesters", label: "Semesters", icon: CalendarDays },
    { href: "/admin/meetings", label: "Meetings", icon: CalendarDays },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/import-export", label: "Import / Export", icon: FileSpreadsheet },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/messages", label: "Messages", icon: MessagesSquare },
    { href: "/search", label: "Search", icon: Search },
  ],
  MENTOR: [
    { href: "/mentor", label: "Overview", icon: LayoutDashboard },
    { href: "/mentor/mentees", label: "My mentees", icon: Users },
    { href: "/mentor/meetings", label: "Meetings", icon: CalendarDays },
    { href: "/messages", label: "Messages", icon: MessagesSquare },
    { href: "/announcements", label: "Announcements", icon: Megaphone },
    { href: "/search", label: "Search", icon: Search },
    { href: "/profile", label: "Profile", icon: Settings },
  ],
  MENTEE: [
    { href: "/mentee", label: "Overview", icon: LayoutDashboard },
    { href: "/mentee/meetings", label: "Meetings", icon: CalendarDays },
    { href: "/messages", label: "Messages", icon: MessagesSquare },
    { href: "/announcements", label: "Announcements", icon: Megaphone },
    { href: "/search", label: "Search", icon: Search },
    { href: "/profile", label: "Profile", icon: Settings },
  ],
};

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-5 font-semibold">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="truncate">{APP_NAME}</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" &&
              item.href !== "/mentor" &&
              item.href !== "/mentee" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
