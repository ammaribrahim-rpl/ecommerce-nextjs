import 'server-only'

import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Middleware Supabase client — used only in middleware.ts.
 * Does NOT use `cookies()` from next/headers (not available in middleware).
 * Cookie access is handled via the RequestResponse pattern.
 */
export function createMiddlewareClient(
  request: Request,
  response: Response
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookies(request.headers.get('cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieStr = serializeCookie(name, value, options)
            response.headers.append('Set-Cookie', cookieStr)
          })
        },
      },
    }
  )
}

function parseCookies(cookieHeader: string) {
  return cookieHeader.split(';').flatMap((part) => {
    const [rawName, ...rest] = part.trim().split('=')
    const name = rawName?.trim()
    const value = rest.join('=').trim()
    if (!name) return []
    return [{ name, value }]
  })
}

function serializeCookie(
  name: string,
  value: string,
  options: Record<string, unknown>
) {
  let str = `${name}=${value}`
  if (options.path) str += `; Path=${options.path}`
  if (options.maxAge) str += `; Max-Age=${options.maxAge}`
  if (options.httpOnly) str += '; HttpOnly'
  if (options.secure) str += '; Secure'
  if (options.sameSite) str += `; SameSite=${options.sameSite}`
  return str
}
