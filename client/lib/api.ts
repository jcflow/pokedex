import type { LoginResponse, ErrorResponse } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Login user with username and password
 *
 * @param username - The username for authentication
 * @param password - The password for authentication
 * @returns Promise resolving to LoginResponse with user data
 * @throws {ApiError} When authentication fails or network error occurs
 *
 * @example
 * ```ts
 * try {
 *   const response = await login('admin', 'password')
 *   console.log('Logged in as:', response.user.username)
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 401) {
 *     console.error('Invalid credentials')
 *   }
 * }
 * ```
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include HTTP-only cookies
      body: JSON.stringify({ username, password }),
    })

    const data: LoginResponse | ErrorResponse = await response.json()

    if (!response.ok) {
      const errorMessage =
        'error' in data ? data.error : 'Login failed'
      throw new ApiError(errorMessage, response.status)
    }

    return data as LoginResponse
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Logout current user
 *
 * @returns Promise resolving when logout completes
 * @throws {ApiError} When logout fails
 *
 * @example
 * ```ts
 * await logout()
 * ```
 */
export async function logout(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new ApiError('Logout failed', response.status)
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    )
  }
}

/**
 * Check current session status
 *
 * @returns Promise resolving to LoginResponse if authenticated, null otherwise
 *
 * @example
 * ```ts
 * const session = await checkSession()
 * if (session) {
 *   console.log('User:', session.user.username)
 * }
 * ```
 */
export async function checkSession(): Promise<LoginResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/session`, {
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}
