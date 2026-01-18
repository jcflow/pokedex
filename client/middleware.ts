import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Authentication middleware
 *
 * Protects all routes except /login by checking for session cookie.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users away from /login to /.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('_pokedex_session')
  const { pathname } = request.nextUrl

  // Public route: /login
  if (pathname === '/login') {
    // If user is authenticated, redirect to dashboard
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to login page
    return NextResponse.next()
  }

  // Protected routes: all other routes
  // If user is not authenticated, redirect to login
  if (!sessionCookie) {
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
