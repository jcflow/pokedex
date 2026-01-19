import Image from 'next/image'
import Link from 'next/link'
import navLeftIcon from '@/icons/nav-left.svg'
import navRightIcon from '@/icons/nav-right.svg'

/**
 * Props for PokemonNavigation component
 */
interface PokemonNavigationProps {
  /** Previous Pokemon ID, or null if at first Pokemon */
  prevId: number | null
  /** Next Pokemon ID, or null if at last Pokemon */
  nextId: number | null
  /** Main Pokemon image element */
  children: React.ReactNode
}

/**
 * PokemonNavigation component
 *
 * Provides previous/next navigation arrows around the Pokemon image.
 * Disables navigation at bounds (first/last Pokemon).
 *
 * @param props - Component props
 * @returns Navigation wrapper with prev/next links
 */
export default function PokemonNavigation({
  prevId,
  nextId,
  children,
}: PokemonNavigationProps) {
  return (
    <div className="flex items-center justify-between w-full px-6 mb-[-3rem] z-20">
      {/* Previous Button */}
      {prevId !== null ? (
        <Link
          href={`/pokemon/${prevId}`}
          className="text-white hover:scale-110 transition-transform"
          aria-label="Previous Pokemon"
        >
          <Image
            src={navLeftIcon}
            alt="Previous"
            width={24}
            height={24}
            className="w-8 h-8"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>
      ) : (
        <div className="w-8" aria-hidden="true" />
      )}

      {/* Pokemon Image */}
      {children}

      {/* Next Button */}
      {nextId !== null ? (
        <Link
          href={`/pokemon/${nextId}`}
          className="text-white hover:scale-110 transition-transform"
          aria-label="Next Pokemon"
        >
          <Image
            src={navRightIcon}
            alt="Next"
            width={24}
            height={24}
            className="w-8 h-8"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>
      ) : (
        <div className="w-8" aria-hidden="true" />
      )}
    </div>
  )
}
