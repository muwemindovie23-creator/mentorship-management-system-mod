"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { bulkEmailSchema, type BulkEmailInput } from "@/lib/validators";
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

export function BulkEmailForm() {
  const { run, pending } = useApiAction();

  const form = useForm<BulkEmailInput>({
    resolver: zodResolver(bulkEmailSchema),
    defaultValues: { subject: "", body: "", audience: "ALL" },
  });

  const onSubmit = async (values: BulkEmailInput) => {
    await run("/api/admin/bulk-email", {
      method: "POST",
      body: JSON.stringify(values),
    });
    form.reset({ subject: "", body: "", audience: "ALL" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" /> Bulk email
        </CardTitle>
        <CardDescription>
          One-off email blast to approved mentors and/or mentees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">Everyone</SelectItem>
                      <SelectItem value="MENTORS">Mentors only</SelectItem>
                      <SelectItem value="MENTEES">Mentees only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send email
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
