import { db } from "@/lib/db";
import { PREDEFINED_INTERESTS } from "@/lib/constants";

/** Public list of interests for the registration forms. */
export async function GET(): Promise<Response> {
  const stored = await db.interest.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, isCustom: true },
  });

  const names = new Set(stored.map((i) => i.name.toLowerCase()));
  const merged = [
    ...stored,
    ...PREDEFINED_INTERESTS.filter((n) => !names.has(n.toLowerCase())).map(
      (name) => ({ id: null, name, isCustom: false })
    ),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return Response.json({ interests: merged });
}
