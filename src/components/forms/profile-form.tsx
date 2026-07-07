"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { STRONG_MODULES } from "@/lib/constants";
import { useApiAction } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { InterestPicker } from "@/components/forms/interest-picker";

const formSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number")
    .or(z.literal("")),
  interests: z.array(z.string().trim().min(1)).min(1).max(10),
  hoursPerWeek: z.coerce.number().int().min(1).max(20).optional(),
  maxMentees: z.coerce.number().int().min(1).max(10).optional(),
  crossDepartment: z.boolean().optional(),
  strongModules: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  initial: {
    name: string;
    email: string;
    phone: string;
    role: Role;
    interests: string[];
    hoursPerWeek?: number;
    maxMentees?: number;
    crossDepartment?: boolean;
    strongModules: string[];
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const isMentor = initial.role === "MENTOR";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initial.name,
      phone: initial.phone,
      interests: initial.interests,
      hoursPerWeek: initial.hoursPerWeek,
      maxMentees: initial.maxMentees,
      crossDepartment: initial.crossDepartment,
      strongModules: initial.strongModules,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await run("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        ...values,
        phone: values.phone || undefined,
      }),
      successMessage: "Profile updated",
    });
    router.refresh();
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>{initial.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (for WhatsApp)</FormLabel>
                    <FormControl>
                      <Input placeholder="+254 7xx xxx xxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <InterestPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isMentor && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="hoursPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours available / week</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxMentees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum mentees</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="crossDepartment"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Mentor other departments</FormLabel>
                        <FormDescription>
                          Allow pairing with mentees outside your department.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="strongModules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strong modules</FormLabel>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {STRONG_MODULES.map((module) => (
                          <label
                            key={module}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={(field.value ?? []).includes(module)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, module]
                                    : current.filter((m) => m !== module)
                                );
                              }}
                            />
                            {module}
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
