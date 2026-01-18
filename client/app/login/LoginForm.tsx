'use client'

import { useState, FormEvent } from 'react'
import { login, ApiError } from '@/lib/api'

/**
 * LoginForm component - Client Component
 *
 * Handles user authentication with client-side validation and error handling.
 * Includes accessibility features (ARIA labels) and loading states.
 */
export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    username?: string
    password?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Validates form inputs
   * @returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login(username, password)
      // Successful login - use window.location for full page reload
      // This ensures the middleware processes the new auth cookie
      window.location.href = '/'
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setErrors({ general: 'Invalid username or password' })
        } else if (error.status === 400) {
          setErrors({ general: error.message })
        } else if (error.status === 0) {
          setErrors({ general: 'Connection error. Please try again.' })
        } else {
          setErrors({ general: 'An error occurred. Please try again.' })
        }
      } else if (error instanceof Error) {
        // Check if it's a 401 error from the message
        if (error.message.toLowerCase().includes('invalid username or password')) {
          setErrors({ general: 'Invalid username or password' })
        } else {
          setErrors({ general: 'Connection error. Please try again.' })
        }
      } else {
        setErrors({ general: 'Connection error. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Login form"
      className="space-y-6"
      role="form"
    >
      {/* General error message */}
      {errors.general && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
          role="alert"
          aria-live="polite"
        >
          {errors.general}
        </div>
      )}

      {/* Username field */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Username"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.username
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white'
            }`}
          placeholder="Enter your username"
          disabled={isLoading}
        />
        {errors.username && (
          <p
            id="username-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.username}
          </p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-white'
            }`}
          placeholder="Enter your password"
          disabled={isLoading}
        />
        {errors.password && (
          <p
            id="password-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        aria-label="Log in to your account"
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}
