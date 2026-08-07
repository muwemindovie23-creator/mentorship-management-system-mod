import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";

/**
 * Resolve a list of strong module names submitted with mentor
 * registration, creating any that aren't already in the catalog. Names
 * are normalised so "chess " and "Chess" map to the same record.
 * Returns the cleaned names to store on MentorProfile.strongModules.
 */
export async function resolveStrongModules(names: string[]): Promise<string[]> {
  const resolved: string[] = [];
  const seen = new Set<string>();

  for (const raw of names) {
    const cleaned = sanitizeText(raw).slice(0, 80);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const existing = await db.strongModule.findFirst({
      where: { name: { equals: cleaned, mode: "insensitive" } },
    });

    if (!existing) {
      await db.strongModule.create({ data: { name: cleaned } });
    }

    resolved.push(existing?.name ?? cleaned);
  }

  return resolved;
}
