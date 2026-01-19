import { useState } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import pokePlaceholder from '@/icons/poke-placeholder.svg'
import type { Pokemon } from '@/types/pokemon'
import { formatPokemonName, formatPokemonNumber } from '@/app/utils'

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
 * Displays individual Pokemon with image, name, and number in a card layout.
 * Features a gray background for the image area, number in top-right corner,
 * and name in a white banner at the bottom.
 *
 * @param props - Component props
 * @returns Pokemon card element
 */
export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const capitalizedName = formatPokemonName(pokemon.name)
  const formattedNumber = formatPokemonNumber(pokemon.number)
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      aria-label={`View details for ${capitalizedName}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl aspect-square"
    >
      <Card
        topText={formattedNumber}
        imageSrc={imgError ? pokePlaceholder : pokemon.sprite}
        imageAlt={`${capitalizedName} sprite`}
        onImageError={() => setImgError(true)}
      >

        <h3 className="text-center text-gray-800 font-medium text-xl">
          {capitalizedName}
        </h3>
      </Card>
    </Link>
  )
}
