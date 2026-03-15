import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const protectedRoutes: Record<string, string[]> = {
  "/dashboard/buyer": ["buyer", "admin"],
  "/dashboard/agent": ["agent", "admin"],
  "/admin": ["admin"],
};

function getAccessToken(request: NextRequest): string | null {
  // Try direct access token cookie (old Supabase format)
  const directToken = request.cookies.get("sb-access-token")?.value;
  if (directToken) return directToken;

  const cookies = request.cookies.getAll();

  // Find the auth token cookie (format: sb-[project-ref]-auth-token)
  const authCookie = cookies.find(c => c.name.match(/^sb-.+-auth-token$/));
  if (!authCookie) return null;

  // Check for chunked cookies (sb-*-auth-token.0, sb-*-auth-token.1, ...)
  const chunks: string[] = [];
  let i = 0;
  while (true) {
    const chunk = request.cookies.get(`${authCookie.name}.${i}`)?.value;
    if (!chunk) break;
    chunks.push(chunk);
    i++;
  }

  const rawValue = chunks.length > 0 ? chunks.join("") : authCookie.value;
  if (!rawValue) return null;

  try {
    const session = JSON.parse(decodeURIComponent(rawValue));
    return session.access_token ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  if (!matchedRoute) return NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) return NextResponse.redirect(new URL("/", request.url));

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) return NextResponse.redirect(new URL("/", request.url));

    const allowedRoles = protectedRoutes[matchedRoute];
    if (!allowedRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // On error, deny access (fail-closed)
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
