'use client'

import { useState, FormEvent } from 'react'
import { login, ApiError } from '@/lib/api'
import { LoadingSpinner } from '@/components/UIComponents'

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
          className="sr-only"
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
          className={`w-full px-6 py-4 rounded-full text-gray-900 border-none shadow-inner focus:ring-4 focus:ring-black/10 transition-all placeholder:text-gray-500 ${errors.username
            ? 'bg-red-50'
            : 'bg-white'
            }`}
          placeholder="Username"
          disabled={isLoading}
        />
        {errors.username && (
          <p
            id="username-error"
            className="mt-2 text-sm text-white font-medium pl-4"
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
          className="sr-only"
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
          className={`w-full px-6 py-4 rounded-full text-gray-900 border-none shadow-inner focus:ring-4 focus:ring-black/10 transition-all placeholder:text-gray-500 ${errors.password
            ? 'bg-red-50'
            : 'bg-white'
            }`}
          placeholder="Password"
          disabled={isLoading}
        />
        {errors.password && (
          <p
            id="password-error"
            className="mt-2 text-sm text-white font-medium pl-4"
            role="alert"
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          aria-label="Log in to your account"
          className="bg-[var(--primary-red)] text-white w-full hover:bg-gray-50 active:scale-[0.98] disabled:bg-gray-200 disabled:text-white font-bold py-4 px-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 shadow-inner text-lg uppercase tracking-wide"
        >
          {isLoading ? <LoadingSpinner className="w-6 h-6 border-white" /> : 'LOGIN'}
        </button>
      </div>
    </form>
  )
}
