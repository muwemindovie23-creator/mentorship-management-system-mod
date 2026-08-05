import { db } from "@/lib/db";

/** Public list of active departments & programmes for the registration forms. */
export async function GET(): Promise<Response> {
  const [departments, programmes] = await Promise.all([
    db.department.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { name: true },
    }),
    db.programme.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { name: true },
    }),
  ]);

  return Response.json({
    departments: departments.map((d) => d.name),
    programmes: programmes.map((p) => p.name),
  });
}
