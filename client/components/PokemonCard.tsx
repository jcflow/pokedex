import Image from 'next/image'
import Link from 'next/link'
import type { Pokemon } from '@/types/pokemon'

/**
 * PokemonCard component props
 */
export interface PokemonCardProps {
  /** Pokemon data to display */
  pokemon: Pokemon
}

/**
 * Pokemon Card Component
 *
 * Displays individual Pokemon with image, name, and number.
 * Uses TailwindCSS for styling and includes proper accessibility attributes.
 * Links to the Pokemon detail page when clicked.
 *
 * @param props - Component props
 * @returns Pokemon card element
 */
export default function PokemonCard({ pokemon }: PokemonCardProps) {
  // Capitalize first letter of name
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

  // Format number with leading zeros (e.g., 001, 025, 150)
  const formattedNumber = `#${pokemon.number.toString().padStart(3, '0')}`

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      aria-label={`View details for ${capitalizedName}`}
      className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Image
        src={pokemon.sprite}
        alt={`${capitalizedName} sprite`}
        width={96}
        height={96}
        className="w-full h-32 object-contain mb-2"
        unoptimized
      />
      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium">{formattedNumber}</p>
        <h3 className="text-lg font-bold text-gray-900">{capitalizedName}</h3>
      </div>
    </Link>
  )
}
