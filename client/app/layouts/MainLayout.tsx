/**
 * Props for MainLayout component
 */
interface MainLayoutProps {
  /** Content to be centered in the layout */
  children: React.ReactNode
}

/**
 * MainLayout - Centered content layout
 *
 * Provides a full-screen primary-colored background with:
 * - Vertically and horizontally centered content
 * - Max-width constraint for narrow content (max-w-sm)
 * - Responsive horizontal padding
 *
 * Primarily used for simple centered pages like modals or forms.
 *
 * @param props - Component props
 * @returns Centered layout wrapper
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <FormCard />
 * </MainLayout>
 * ```
 */
export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="primary min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
    )
}
