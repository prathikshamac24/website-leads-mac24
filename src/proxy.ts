import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Allow localhost during development
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("[::1]")
  ) {
    return NextResponse.next();
  }

  // Redirect any host that is not canonical mac24.in
  if (host !== "mac24.in") {
    url.host = "mac24.in";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. api (API routes)
     * 2. _next/static (static files)
     * 3. _next/image (image optimization files)
     * 4. Static assets with file extensions (e.g., logo.png, favicon.ico, etc.)
     */
    "/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)",
  ],
};
