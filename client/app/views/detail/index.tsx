import Image from 'next/image'
import { notFound } from 'next/navigation'
import { fetchPokemonDetail, ApiError } from '@/lib/api'
import type { Metadata } from 'next'
import { getTypeName } from '@/types/pokemon'
import {
  formatPokemonName,
  formatPokemonNumber,
  getPreviousPokemonId,
  getNextPokemonId,
} from '@/app/utils'
import BackButton from '@/app/views/detail/BackButton'
import PokemonNavigation from '@/app/views/detail/PokemonNavigation'
import PokemonTypes from '@/app/views/detail/PokemonTypes'
import PokemonAbout from '@/app/views/detail/PokemonAbout'
import PokemonStats from '@/app/views/detail/PokemonStats'
import DetailLayout from '@/app/layouts/DetailLayout'
import pokePlaceholder from '@/icons/poke-placeholder.svg'

/**
 * Props for PokemonDetailPage
 */
interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const pokemon = await fetchPokemonDetail(id)
    const displayName = formatPokemonName(pokemon.name)
    return {
      title: `${displayName} - Pokédex`,
      description: `View detailed information about ${displayName}.`,
    }
  } catch {
    return {
      title: 'Pokemon Not Found - Pokédex',
      description: 'The requested Pokemon could not be found.',
    }
  }
}

/**
 * Get the primary Pokemon image URL with fallbacks
 */
function getPokemonImageUrl(pokemon: {
  sprites: { other?: { 'official-artwork'?: { front_default?: string } } }
  sprite?: string
}): string {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprite ||
    pokePlaceholder
  )
}

/**
 * PokemonDetailPage - Server Component
 *
 * Fetches and displays detailed Pokemon information.
 * Uses SSR for SEO optimization.
 *
 * @param props - Page props with route params
 * @returns Pokemon detail page
 */
export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { id } = await params

  let pokemon
  try {
    pokemon = await fetchPokemonDetail(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const displayName = formatPokemonName(pokemon.name)
  const formattedNumber = formatPokemonNumber(pokemon.id)

  // Get primary type for color theming
  const firstType = pokemon.types[0]
  const mainType = firstType ? getTypeName(firstType) : 'normal'
  const typeColor = `var(--color-${mainType})`

  // Calculate navigation IDs with bounds checking
  const numericId = Number(pokemon.id)
  const prevId = getPreviousPokemonId(numericId)
  const nextId = getNextPokemonId(numericId)

  return (
    <DetailLayout
      header={
        <>
          <BackButton />
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{displayName}</h1>
          </div>
          <span className="text-xl font-bold">{formattedNumber}</span>
        </>
      }
      mainColor={typeColor}
    >
      {/* Image with Navigation */}
      <PokemonNavigation prevId={prevId} nextId={nextId}>
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
          <Image
            src={getPokemonImageUrl(pokemon)}
            alt={displayName}
            className="object-contain drop-shadow-xl"
            width={400}
            height={400}
            priority
          />
        </div>
      </PokemonNavigation>

      {/* White Content Card */}
      <div className="bg-white rounded-[2rem] px-6 pt-16 pb-8 w-[95%] sm:w-full flex-1 shadow-2xl mx-4 mb-4">
        {/* Types */}
        <PokemonTypes types={pokemon.types} />

        {/* About Section */}
        <PokemonAbout
          weight={pokemon.weight}
          height={pokemon.height}
          moves={pokemon.moves || []}
          typeColor={typeColor}
          description={pokemon.description}
        />

        {/* Stats Section */}
        <PokemonStats stats={pokemon.stats} typeColor={typeColor} />
      </div>
    </DetailLayout>
  )
}
