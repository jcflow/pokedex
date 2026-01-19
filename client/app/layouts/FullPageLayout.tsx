/**
 * Props for FullPageLayout component
 */
interface FullPageLayoutProps {
  /** Header content (typically title, navigation, or branding) */
  header: React.ReactNode
  /** Main content rendered inside white card container */
  children: React.ReactNode
  /** Tailwind max-width class (default: 'max-w-7xl') */
  maxWidth?: string
  /** Whether to vertically center the content (default: false) */
  centerContent?: boolean
}

/**
 * FullPageLayout - Main application layout
 *
 * Provides a full-screen red background with:
 * - Customizable header section
 * - White rounded card container for main content
 * - Responsive padding and max-width constraints
 *
 * Used for the main Pokemon list page and login page.
 *
 * @param props - Component props
 * @returns Layout wrapper with header and content card
 *
 * @example
 * ```tsx
 * <FullPageLayout
 *   header={<PokemonHeader />}
 *   maxWidth="max-w-7xl"
 * >
 *   <PokemonList />
 * </FullPageLayout>
 * ```
 */
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
