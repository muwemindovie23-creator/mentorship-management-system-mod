import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { MAX_CUSTOM_INTEREST_LENGTH, PREDEFINED_INTERESTS } from "@/lib/constants";

/**
 * Resolve a list of interest names (predefined or custom) to Interest
 * ids, creating custom interests on the fly. Names are normalised so
 * "chess " and "Chess" map to the same record.
 */
export async function resolveInterestIds(names: string[]): Promise<string[]> {
  const predefined = new Set(
    PREDEFINED_INTERESTS.map((n) => n.toLowerCase())
  );

  const ids: string[] = [];
  const seen = new Set<string>();

  for (const raw of names) {
    const cleaned = sanitizeText(raw).slice(0, MAX_CUSTOM_INTEREST_LENGTH);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const existing = await db.interest.findFirst({
      where: { name: { equals: cleaned, mode: "insensitive" } },
    });

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const created = await db.interest.create({
      data: { name: cleaned, isCustom: !predefined.has(key) },
    });
    ids.push(created.id);
  }

  return ids;
}
