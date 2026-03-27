import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Role helpers ───────────────────────────────────────────────────────────────
const getUserRoles = (request: NextRequest): string[] => {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return [];
  // Role is stored in a separate cookie (set at login) because mock tokens are
  // not real JWTs. Replace this with jwtDecode if you switch to real tokens.
  const role = request.cookies.get("user-role")?.value;
  if (!role) return [];
  return [role];
};

const getPrimaryRole = (roles: string[]) => {
  if (roles.includes("admin")) return "admin";
  return "user";
};

// ── Proxy ──────────────────────────────────────────────────────────────────────
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth-token")?.value;
  const userRoles = getUserRoles(request);
  const primaryRole = getPrimaryRole(userRoles);

  const publicRoutes: string[] = ["/"];
  const authRoutes = ["/login"];

  const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!token || userRoles.length === 0) {
    if (isPublicRoute || isAuthRoute) return NextResponse.next();
    const res = NextResponse.redirect(new URL("/login", request.url));
    if (token) res.cookies.delete("auth-token");
    return res;
  }

  // ── Authenticated ──────────────────────────────────────────────────────────

  // If visiting auth pages, root, or legacy /features → redirect by role
  const isLegacyFeaturesRoute = pathname === "/features" || pathname.startsWith("/features/");
  if (isAuthRoute || pathname === "/" || pathname === "" || isLegacyFeaturesRoute) {
    if (primaryRole === "admin") {
      return NextResponse.redirect(new URL("/admin?tab=dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/employee?tab=calendar", request.url));
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isEmployeeRoute = pathname.startsWith("/employee");

  // ADMIN — full access; block employee-only route
  if (primaryRole === "admin") {
    if (isEmployeeRoute) {
      return NextResponse.redirect(new URL("/admin?tab=dashboard", request.url));
    }
    return NextResponse.next();
  }

  // USER — block admin-only route
  if (isAdminRoute) {
    return NextResponse.redirect(new URL("/employee?tab=calendar", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|json)$).*)",
  ],
};
