import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Next.js Middleware / Proxy
 *
 * Responsibilities:
 * 1. Refresh Supabase auth session on every request (keep JWT fresh)
 * 2. Protect authenticated routes — redirect unauthenticated users to /auth/login
 * 3. Protect role-gated routes (/admin, /owner)
 */

const BUYER_ROUTES = ['/cart', '/checkout', '/orders', '/profile', '/chat']
const ADMIN_ROUTES = ['/admin']
const OWNER_ROUTES = ['/owner']

function requiresAuth(pathname: string): boolean {
  return (
    BUYER_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) ||
    ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    ) ||
    OWNER_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static files, Next.js internals, and images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required on every request for Supabase SSR
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Helper function: ensure cookies are preserved on redirect
  const redirectWithCookies = (url: URL | string) => {
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // Redirect unauthenticated users away from protected routes
  if (requiresAuth(pathname) && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return redirectWithCookies(loginUrl)
  }

  // Redirect /owner to /admin
  if (pathname === '/owner' || pathname.startsWith('/owner/')) {
    return redirectWithCookies(new URL('/admin', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === '/auth/login' || pathname === '/auth/register')) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/profile'
    return redirectWithCookies(new URL(redirectTo, request.url))
  }

  return supabaseResponse
}

export const defaultExport = proxy
export default proxy

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
