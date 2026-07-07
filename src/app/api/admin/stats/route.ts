import { requireSession, errorResponse } from "@/lib/authz";
import { getDashboardStats, getAnalytics } from "@/services/stats";

export async function GET(req: Request): Promise<Response> {
  try {
    await requireSession(["ADMIN"]);
    const url = new URL(req.url);

    if (url.searchParams.get("view") === "analytics") {
      return Response.json(await getAnalytics());
    }
    return Response.json(await getDashboardStats());
  } catch (error) {
    return errorResponse(error);
  }
}
