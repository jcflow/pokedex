'use server'

import { cookies } from 'next/headers'
import { TOKEN_KEY, COOKIE_CONFIG } from './constants'

/**
 * Save authentication token to HTTP-only cookie.
 *
 * @param token - JWT authentication token
 */
export async function saveToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_CONFIG.EXPIRY_SECONDS,
  })
}

/**
 * Get authentication token from cookie.
 *
 * @returns Token string if present, null otherwise
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_KEY)?.value || null
}

/**
 * Remove authentication token cookie (logout).
 */
export async function removeToken() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_KEY)
}
