import type { LoginResponse, ErrorResponse } from '@/types/auth'
import type { PokemonListResponse, PokemonDetail } from '@/types/pokemon'
import { TOKEN_KEY } from './constants'
import { saveToken, getToken, removeToken } from './actions'

// Use empty string to make relative API calls that go through Next.js rewrites
// This ensures cookies work properly (same-origin requests)
const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3001'

export { TOKEN_KEY, saveToken, getToken, removeToken }

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
 * Get headers with authentication token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  // Fetch Pokemon data during SSR
  const authToken = await getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return headers
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
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })

    const data: LoginResponse | ErrorResponse = await response.json()

    if (!response.ok) {
      const errorMessage =
        'error' in data ? data.error : 'Login failed'
      throw new ApiError(errorMessage, response.status)
    }

    // Save the token to cookie
    const loginData = data as LoginResponse
    await saveToken(loginData.token)

    return loginData
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
      headers: await getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new ApiError('Logout failed', response.status)
    }

    // Remove the token from cookie
    removeToken()
  } catch (error) {
    // Always remove token even if API call fails
    removeToken()

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

/**
 * Fetch Pokemon list from API
 *
 * @param page - Page number (default: 1)
 * @param limit - Number of Pokemon per page (default: 20)
 * @returns Promise resolving to PokemonListResponse
 * @throws {ApiError} When API call fails
 *
 * @example
 * ```ts
 * const pokemons = await fetchPokemons(1, 20)
 * console.log('Found', pokemons.count, 'Pokemon')
 * ```
 */
export async function fetchPokemons(
  page: number = 1,
  limit: number = 20
): Promise<PokemonListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/pokemons?page=${page}&limit=${limit}`,
      {
        headers: await getAuthHeaders(),
        credentials: 'include',
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError('Not authenticated', 401)
      }
      throw new ApiError('Failed to fetch Pokemon', response.status)
    }

    return await response.json()
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
 * Fetch detailed Pokemon data by ID
 *
 * @param id - Pokemon ID or name
 * @returns Promise resolving to PokemonDetail
 * @throws {ApiError} When API call fails or Pokemon not found
 *
 * @example
 * ```ts
 * const pokemon = await fetchPokemonDetail(25) // Pikachu
 * console.log('Name:', pokemon.name)
 * console.log('Abilities:', pokemon.abilities)
 * ```
 */
export async function fetchPokemonDetail(
  id: string | number
): Promise<PokemonDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pokemons/${id}`, {
      headers: await getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError('Not authenticated', 401)
      }
      if (response.status === 404) {
        throw new ApiError('Pokemon not found', 404)
      }
      throw new ApiError('Failed to fetch Pokemon details', response.status)
    }

    return await response.json()
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
