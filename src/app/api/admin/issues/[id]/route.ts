import { db } from "@/lib/db";
import { requireSession, errorResponse } from "@/lib/authz";
import { issueDecisionSchema } from "@/lib/validators";

/** PATCH /api/admin/issues/:id — mark an issue report resolved. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);
    const { id } = await params;

    const parsed = issueDecisionSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid action" }, { status: 422 });
    }

    const report = await db.issueReport.findUnique({ where: { id } });
    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    await db.issueReport.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });

    return Response.json({ message: "Issue marked resolved" });
  } catch (error) {
    return errorResponse(error);
  }
}
