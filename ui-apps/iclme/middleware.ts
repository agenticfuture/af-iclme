// Mock middleware for development - comment out until auth is ready
// export { auth as middleware } from "@/lib/auth"

// Allow all routes in development
export function middleware() {
  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)",
  ],
}
