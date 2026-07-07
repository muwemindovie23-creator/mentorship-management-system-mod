import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/forms/profile-form";

export const metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  const user = await db.user.findUnique({
    where: { id: session!.user.id },
    include: {
      mentorProfile: { include: { interests: { include: { interest: true } } } },
      menteeProfile: { include: { interests: { include: { interest: true } } } },
    },
  });

  if (!user) return null;

  const interests =
    user.mentorProfile?.interests.map((i) => i.interest.name) ??
    user.menteeProfile?.interests.map((i) => i.interest.name) ??
    [];

  return (
    <>
      <PageHeader
        title="Profile"
        description="Update your contact details, interests and availability."
      />
      <ProfileForm
        initial={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role,
          interests,
          hoursPerWeek: user.mentorProfile?.hoursPerWeek,
          maxMentees: user.mentorProfile?.maxMentees,
          crossDepartment: user.mentorProfile?.crossDepartment,
          strongModules: user.mentorProfile?.strongModules ?? [],
        }}
      />
    </>
  );
}
