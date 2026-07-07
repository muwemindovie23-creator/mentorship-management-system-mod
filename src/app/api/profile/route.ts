import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { profileUpdateSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { resolveInterestIds } from "@/lib/interests";

/** GET /api/profile — current user's profile with interests. */
export async function GET(): Promise<Response> {
  try {
    const session = await requireSession();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        mentorProfile: { include: { interests: { include: { interest: true } } } },
        menteeProfile: { include: { interests: { include: { interest: true } } } },
      },
    });

    return Response.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}

/** PATCH /api/profile — update own profile. */
export async function PATCH(req: Request): Promise<Response> {
  try {
    const session = await requireSession();

    const parsed = profileUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const data = parsed.data;

    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name ? { name: sanitizeText(data.name) } : {}),
        ...(data.phone !== undefined ? { phone: data.phone ?? null } : {}),
      },
    });

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { mentorProfile: true, menteeProfile: true },
    });

    if (user?.mentorProfile) {
      await db.mentorProfile.update({
        where: { id: user.mentorProfile.id },
        data: {
          ...(data.hoursPerWeek ? { hoursPerWeek: data.hoursPerWeek } : {}),
          ...(data.maxMentees ? { maxMentees: data.maxMentees } : {}),
          ...(data.crossDepartment !== undefined
            ? { crossDepartment: data.crossDepartment }
            : {}),
          ...(data.strongModules
            ? { strongModules: data.strongModules.map(sanitizeText) }
            : {}),
        },
      });

      if (data.interests) {
        const interestIds = await resolveInterestIds(data.interests);
        await db.$transaction([
          db.mentorInterest.deleteMany({
            where: { mentorProfileId: user.mentorProfile.id },
          }),
          db.mentorInterest.createMany({
            data: interestIds.map((interestId) => ({
              mentorProfileId: user.mentorProfile!.id,
              interestId,
            })),
          }),
        ]);
      }
    }

    if (user?.menteeProfile && data.interests) {
      const interestIds = await resolveInterestIds(data.interests);
      await db.$transaction([
        db.menteeInterest.deleteMany({
          where: { menteeProfileId: user.menteeProfile.id },
        }),
        db.menteeInterest.createMany({
          data: interestIds.map((interestId) => ({
            menteeProfileId: user.menteeProfile!.id,
            interestId,
          })),
        }),
      ]);
    }

    return Response.json({ message: "Profile updated" });
  } catch (error) {
    return errorResponse(error);
  }
}
