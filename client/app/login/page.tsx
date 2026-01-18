import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

/**
 * Login page - Server Component
 *
 * Checks for existing authentication session. If user is already logged in,
 * redirects to the main page. Otherwise, renders the login form.
 */
export default async function LoginPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('_pokedex_session')

  // If session cookie exists, user might be authenticated
  // Redirect to main page and let middleware/client handle auth check
  if (sessionCookie) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pokédex
            </h1>
            <p className="text-gray-600">
              Sign in to access your Pokédex
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Demo credentials: admin / admin
        </p>
      </div>
    </div>
  )
}
