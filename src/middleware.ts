import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware is intentionally a pass-through.
// Route protection is handled client-side via AuthContext + page-level guards.
// Supabase JS v2 stores sessions in localStorage (not cookies), so the Edge
// middleware cannot reliably read the auth token without @supabase/ssr.
// All protected pages (/admin, /dashboard/*) implement their own auth checks.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
