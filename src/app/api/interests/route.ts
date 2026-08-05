import { db } from "@/lib/db";

/** Public list of active interests for the registration forms. */
export async function GET(): Promise<Response> {
  const interests = await db.interest.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, isCustom: true },
  });

  return Response.json({ interests });
}
