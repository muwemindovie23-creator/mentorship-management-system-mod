"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2 } from "lucide-react";
import { z } from "zod";
import { useApiAction } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  pairingId: z.string().min(1, "Select a mentee"),
  date: z.string().min(1, "Required"),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  topics: z.string().trim().min(3, "Describe the topics discussed").max(500),
  notes: z.string().trim().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MeetingLogFormProps {
  pairings: { id: string; menteeName: string }[];
}

export function MeetingLogForm({ pairings }: MeetingLogFormProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pairingId: "",
      date: "",
      durationMinutes: 30,
      topics: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await run("/api/meetings", {
      method: "POST",
      body: JSON.stringify(values),
      successMessage: "Meeting logged",
    });
    form.reset({
      pairingId: "",
      date: "",
      durationMinutes: 30,
      topics: "",
      notes: "",
    });
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarPlus className="h-5 w-5" /> Log a meeting
        </CardTitle>
        <CardDescription>
          Record what you covered — admins can review all meeting logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pairingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentee</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mentee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pairings.map((pairing) => (
                        <SelectItem key={pairing.id} value={pairing.id}>
                          {pairing.menteeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min={5} max={480} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics discussed</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Exam prep, project planning…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending || pairings.length === 0}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save meeting
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
