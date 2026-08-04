"use client";

import { useState } from "react";
import { GraduationCap, Menu } from "lucide-react";
import type { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNavLinks } from "@/components/layout/app-sidebar";
import { APP_NAME } from "@/lib/constants";

export function MobileNavDrawer({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex h-16 items-center gap-2 border-b px-5 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="truncate">{APP_NAME}</span>
        </div>
        <SidebarNavLinks role={role} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
