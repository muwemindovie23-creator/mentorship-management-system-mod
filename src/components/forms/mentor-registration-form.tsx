"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  mentorRegistrationSchema,
  type MentorRegistrationInput,
} from "@/lib/validators";
import {
  DEPARTMENTS,
  PROGRAMMES,
  STRONG_MODULES,
  YEARS_OF_STUDY,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InterestPicker } from "@/components/forms/interest-picker";

export function MentorRegistrationForm() {
  const router = useRouter();
  const form = useForm<MentorRegistrationInput>({
    resolver: zodResolver(mentorRegistrationSchema),
    defaultValues: {
      role: "MENTOR",
      name: "",
      email: "",
      password: "",
      phone: "",
      registrationNumber: "",
      department: undefined,
      programme: undefined,
      yearOfStudy: 3,
      strongModules: [],
      interests: [],
      hoursPerWeek: 2,
      maxMentees: 3,
      crossDepartment: true,
    },
  });

  async function onSubmit(values: MentorRegistrationInput) {
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
        <CardTitle>Mentor registration</CardTitle>
        <CardDescription>
          Share your strengths and availability so we can match you with the
          right mentees. Your account will be reviewed by an administrator.
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
                      <Input placeholder="Jane Doe" {...field} />
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
                      <Input type="email" placeholder="jane@students.engineering.edu" {...field} />
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
                      <Input placeholder="ENG/M/001/22" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of study</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YEARS_OF_STUDY.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            Year {year}
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
                name="programme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme of study</FormLabel>
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
              name="strongModules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strong modules</FormLabel>
                  <FormDescription>
                    Pick the modules you feel confident helping with.
                  </FormDescription>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {STRONG_MODULES.map((module) => (
                      <label
                        key={module}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={field.value.includes(module)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, module]
                                : field.value.filter((m) => m !== module)
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

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests outside school</FormLabel>
                  <FormDescription>
                    Shared interests improve mentor–mentee matching.
                  </FormDescription>
                  <FormControl>
                    <InterestPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="hoursPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours available each week</FormLabel>
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
                    <FormLabel>Mentor students from other departments</FormLabel>
                    <FormDescription>
                      Turn off to only be matched within your department.
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
              Register as mentor
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
