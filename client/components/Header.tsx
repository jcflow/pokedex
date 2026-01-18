'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/api'

/**
 * Header Component
 *
 * Displays app title and logout button.
 * Client Component because it requires interactivity (logout button).
 *
 * @returns Header element
 */
export default function Header() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /**
   * Handle logout button click
   * Calls logout API and redirects to login page
   */
  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with redirect even if API call fails
      // (cookie will still be cleared client-side via middleware redirect)
    } finally {
      router.push('/login')
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pokédex</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Log out of your account"
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </header>
  )
}
