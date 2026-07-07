import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { semesterSchema } from "@/lib/validators";

export async function GET(): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);
    const semesters = await db.semester.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: { select: { mentorProfiles: true, menteeProfiles: true, pairings: true } },
      },
    });
    return Response.json({ semesters });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);

    const parsed = semesterSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const existing = await db.semester.findUnique({
      where: { name: parsed.data.name },
    });
    if (existing) {
      return Response.json(
        { error: "A semester with this name already exists" },
        { status: 409 }
      );
    }

    const semester = await db.semester.create({ data: parsed.data });
    return Response.json({ semester }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
