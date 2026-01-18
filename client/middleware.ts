import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Authentication middleware
 *
 * Protects all routes except /login by checking for auth token cookie.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users away from /login to /.
 */
export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('_pokedex_token')
  const { pathname } = request.nextUrl

  // Public route: /login
  if (pathname === '/login') {
    // If user is authenticated, redirect to dashboard
    if (tokenCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to login page
    return NextResponse.next()
  }

  // Protected routes: all other routes
  // If user is not authenticated, redirect to login
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow access to protected route
  return NextResponse.next()
}

/**
 * Middleware configuration
 *
 * Matches all routes except:
 * - Next.js internals (_next/static, _next/image)
 * - Static files (favicon.ico)
 * - API routes (/api/*)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
