'use server'

import { cookies } from 'next/headers'
import { TOKEN_KEY } from './constants'

/**
 * Save authentication token to cookie
 */
export async function saveToken(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(TOKEN_KEY, token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
    })
}

/**
 * Get authentication token from cookie
 */
export async function getToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const authToken = cookieStore.get(TOKEN_KEY)?.value || null
    return authToken
}

/**
 * Remove authentication token from cookie
 */
export async function removeToken() {
    const cookieStore = await cookies()
    cookieStore.delete(TOKEN_KEY)
}
