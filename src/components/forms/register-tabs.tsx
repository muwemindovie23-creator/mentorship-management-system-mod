"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorRegistrationForm } from "@/components/forms/mentor-registration-form";
import { MenteeRegistrationForm } from "@/components/forms/mentee-registration-form";

export function RegisterTabs() {
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "mentor" ? "mentor" : "mentee";

  return (
    <div className="w-full max-w-2xl">
      <Tabs defaultValue={initialRole}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mentee">I need a mentor</TabsTrigger>
          <TabsTrigger value="mentor">I want to mentor</TabsTrigger>
        </TabsList>
        <TabsContent value="mentee">
          <MenteeRegistrationForm />
        </TabsContent>
        <TabsContent value="mentor">
          <MentorRegistrationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
