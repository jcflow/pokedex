interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="primary min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    )
}
