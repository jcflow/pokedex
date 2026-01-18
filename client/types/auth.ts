/**
 * Authentication type definitions
 */

/**
 * User object returned from authentication
 */
export interface User {
  id: number
  username: string
  created_at: string
  updated_at: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User
  token: string
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  error: string
}
