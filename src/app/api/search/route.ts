import { requireSession, errorResponse } from "@/lib/authz";
import { globalSearch } from "@/services/search";
import { rateLimit } from "@/lib/rate-limit";

/** GET /api/search?q= — cross-entity search scoped to the user's role. */
export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireSession();

    const limit = rateLimit(`search:${session.user.id}`, {
      limit: 30,
      windowMs: 60 * 1000,
    });
    if (!limit.success) {
      return Response.json({ error: "Too many searches" }, { status: 429 });
    }

    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";

    const results = await globalSearch(q, session.user.id, session.user.role);
    return Response.json(results);
  } catch (error) {
    return errorResponse(error);
  }
}
