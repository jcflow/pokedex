import LoginForm from '@/app/views/login/LoginForm'
import FullPageLayout from '@/app/layouts/FullPageLayout'

/**
 * LoginPage - User authentication page
 *
 * Server component that renders the login interface with:
 * - Centered Pokédex branding/title
 * - Login form with username/password fields
 * - Narrow max-width for focused user experience
 *
 * Uses FullPageLayout with centered content mode.
 * Redirects to main page on successful authentication.
 *
 * @returns Login page with form
 */
export default async function LoginPage() {
    return (
        <FullPageLayout
            header={
                <div className="pt-12 pb-24 text-center">
                    <h1 className="text-5xl font-bold text-white tracking-tight">Pokédex</h1>
                </div>
            }
            maxWidth="max-w-md"
            centerContent={true}
        >
            <LoginForm />
        </FullPageLayout>
    )
}

