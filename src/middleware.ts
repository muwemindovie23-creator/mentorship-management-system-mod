import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Route protection runs at the edge using the JWT session cookie.
 * Role/status rules live in authConfig.callbacks.authorized.
 * Auth.js also provides CSRF protection for all auth endpoints; state
 * changing API routes additionally verify the session server-side.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    // Everything except static assets, images and the auth API itself.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
