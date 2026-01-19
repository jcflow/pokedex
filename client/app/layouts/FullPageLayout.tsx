interface FullPageLayoutProps {
    header: React.ReactNode
    children: React.ReactNode
    maxWidth?: string
    centerContent?: boolean
}

export default function FullPageLayout({
    header,
    children,
    maxWidth = 'max-w-7xl',
    centerContent = false
}: FullPageLayoutProps) {
    return (
        <div className={`min-h-screen bg-[var(--primary-red)] ${centerContent ? 'flex flex-col justify-center' : ''}`}>
            {header}
            <main className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 pb-8 -mt-8 w-full`}>
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
