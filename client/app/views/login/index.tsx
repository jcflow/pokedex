import LoginForm from '@/app/views/login/LoginForm'
import FullPageLayout from '@/app/layouts/FullPageLayout'

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

