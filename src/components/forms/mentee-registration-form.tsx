"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  menteeRegistrationSchema,
  type MenteeRegistrationInput,
} from "@/lib/validators";
import { DEPARTMENTS, PROGRAMMES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InterestPicker } from "@/components/forms/interest-picker";

export function MenteeRegistrationForm() {
  const router = useRouter();
  const form = useForm<MenteeRegistrationInput>({
    resolver: zodResolver(menteeRegistrationSchema),
    defaultValues: {
      role: "MENTEE",
      name: "",
      email: "",
      password: "",
      phone: "",
      registrationNumber: "",
      department: undefined,
      programme: undefined,
      sameDepartmentPreferred: false,
      interests: [],
    },
  });

  async function onSubmit(values: MenteeRegistrationInput) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { error?: string; message?: string };

    if (!res.ok) {
      toast.error(data.error ?? "Registration failed");
      return;
    }

    toast.success(data.message ?? "Registration received");
    router.push("/pending");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentee registration</CardTitle>
        <CardDescription>
          Tell us about yourself so we can find you the best possible mentor.
          Your account will be reviewed by an administrator.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@students.engineering.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
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
                      <Input placeholder="+254 7xx xxx xxx" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration number</FormLabel>
                    <FormControl>
                      <Input placeholder="ENG/S/101/25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select programme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROGRAMMES.map((programme) => (
                          <SelectItem key={programme} value={programme}>
                            {programme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENTS.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sameDepartmentPreferred"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>I want a mentor from my department</FormLabel>
                    <FormDescription>
                      If on, you will only be matched with mentors from your
                      own department.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormDescription>
                    Pick from the list or add your own — shared interests
                    improve your match.
                  </FormDescription>
                  <FormControl>
                    <InterestPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Register as mentee
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
