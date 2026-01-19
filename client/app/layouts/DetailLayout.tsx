import Image from "next/image"
import pokeballIcon from "@/icons/pokeball.svg"

/**
 * Props for DetailLayout component
 */
interface DetailLayoutProps {
  /** Header content (typically BackButton, title, and Pokemon number) */
  header: React.ReactNode
  /** Main content area (Pokemon image, types, stats, etc.) */
  children: React.ReactNode
  /** CSS color value for background (e.g., "var(--color-fire)") */
  mainColor: string
}

/**
 * DetailLayout - Pokemon detail page layout
 *
 * Provides a full-screen colored background with:
 * - Decorative pokeball watermark in top-right corner
 * - Header section with navigation and title
 * - Flexible content area for Pokemon details
 *
 * The background color dynamically matches the Pokemon's primary type.
 *
 * @param props - Component props
 * @returns Layout wrapper for Pokemon detail pages
 *
 * @example
 * ```tsx
 * <DetailLayout
 *   header={<BackButton />}
 *   mainColor="var(--color-fire)"
 * >
 *   <PokemonContent />
 * </DetailLayout>
 * ```
 */
export default function DetailLayout({
    header,
    children,
    mainColor
}: DetailLayoutProps) {
    return (
        <div
            className="min-h-screen relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: mainColor }}
        >
            {/* Watermark Pokeball */}
            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                <Image
                    aria-hidden="true"
                    src={pokeballIcon}
                    alt=""
                    width={250}
                    height={250}
                    className="w-64 h-64 text-white"
                    style={{ filter: 'invert(1)' }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto h-screen flex flex-col">
                {/* Header */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between text-white">
                    {header}
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center">
                    {children}
                </div>
            </div>
        </div>
    )
}