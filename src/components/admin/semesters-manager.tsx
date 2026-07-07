"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, ArchiveRestore, CalendarPlus, Lock, LockOpen, Power } from "lucide-react";
import { z } from "zod";
import { useApiAction } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate } from "@/lib/utils";

const formSchema = z
  .object({
    name: z.string().trim().min(3).max(60),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

interface SemesterRow {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  registrationOpen: boolean;
  isArchived: boolean;
  mentors: number;
  mentees: number;
  pairings: number;
}

export function SemestersManager({ semesters }: { semesters: SemesterRow[] }) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const [createOpen, setCreateOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", startDate: "", endDate: "" },
  });

  const create = async (values: FormValues) => {
    await run("/api/admin/semesters", {
      method: "POST",
      body: JSON.stringify(values),
      successMessage: "Semester created",
    });
    setCreateOpen(false);
    form.reset();
    router.refresh();
  };

  const action = async (id: string, actionName: string) => {
    await run(`/api/admin/semesters/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: actionName }),
      successMessage: "Semester updated",
    });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button>
            <CalendarPlus className="h-4 w-4" /> New semester
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create semester</DialogTitle>
            <DialogDescription>
              A new cohort. Activate it to make it the current semester.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(create)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="2026 Semester 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 lg:grid-cols-2">
        {semesters.map((semester) => (
          <Card
            key={semester.id}
            className={semester.isActive ? "border-primary" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{semester.name}</CardTitle>
                <div className="flex gap-1">
                  {semester.isActive && <Badge>Active</Badge>}
                  {semester.registrationOpen && (
                    <Badge variant="success">Registration open</Badge>
                  )}
                  {semester.isArchived && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {formatDate(semester.startDate)} – {formatDate(semester.endDate)} ·{" "}
                {semester.mentors} mentors · {semester.mentees} mentees ·{" "}
                {semester.pairings} pairings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {!semester.isActive && !semester.isArchived && (
                <ConfirmDialog
                  trigger={
                    <Button size="sm" variant="outline" disabled={pending}>
                      <Power className="h-4 w-4" /> Activate
                    </Button>
                  }
                  title={`Activate ${semester.name}?`}
                  description="The currently active semester will be deactivated. All new registrations will join this cohort."
                  confirmLabel="Activate"
                  onConfirm={() => action(semester.id, "activate")}
                />
              )}
              {!semester.isArchived &&
                (semester.registrationOpen ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => action(semester.id, "closeRegistration")}
                  >
                    <Lock className="h-4 w-4" /> Close registration
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => action(semester.id, "openRegistration")}
                  >
                    <LockOpen className="h-4 w-4" /> Open registration
                  </Button>
                ))}
              {semester.isArchived ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => action(semester.id, "unarchive")}
                >
                  <ArchiveRestore className="h-4 w-4" /> Unarchive
                </Button>
              ) : (
                <ConfirmDialog
                  trigger={
                    <Button size="sm" variant="outline" disabled={pending}>
                      <Archive className="h-4 w-4" /> Archive
                    </Button>
                  }
                  title={`Archive ${semester.name}?`}
                  description="The semester is deactivated, registration closes and it becomes read-only history."
                  confirmLabel="Archive"
                  destructive
                  onConfirm={() => action(semester.id, "archive")}
                />
              )}
            </CardContent>
          </Card>
        ))}
        {semesters.length === 0 && (
          <p className="text-muted-foreground">
            No semesters yet — create the first cohort above.
          </p>
        )}
      </div>
    </div>
  );
}
