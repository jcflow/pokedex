import Image from 'next/image'
import Link from 'next/link'
import { fetchPokemonDetail } from '@/lib/api'
import type { Metadata } from 'next'

/**
 * Props for Pokemon detail page
 */
interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * Generate metadata for Pokemon detail page
 *
 * @param props - Page props with Pokemon ID
 * @returns Page metadata with Pokemon name and description
 */
export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const pokemon = await fetchPokemonDetail(id)
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

    return {
      title: `${capitalizedName} - Pokédex`,
      description: `View detailed information about ${capitalizedName} including abilities, moves, types, and stats.`,
    }
  } catch {
    return {
      title: 'Pokemon Not Found - Pokédex',
      description: 'The requested Pokemon could not be found.',
    }
  }
}

/**
 * Pokemon detail page component
 *
 * Server-side rendered page that displays comprehensive Pokemon information
 * including abilities, moves, forms, types, and stats.
 *
 * @param props - Page props with Pokemon ID
 * @returns Pokemon detail page
 */
export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { id } = await params
  const pokemon = await fetchPokemonDetail(id)

  // Capitalize Pokemon name
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)

  // Format Pokemon number with leading zeros
  const formattedNumber = `#${String(pokemon.order).padStart(3, '0')}`

  return (
    <div className="min-h-screen bg-gray-50">
      <main role="main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            aria-label="Back to Pokemon list"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to List
          </Link>
        </div>

        {/* Pokemon Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Image
                src={pokemon.sprites.other['official-artwork']['front_default']}
                alt={capitalizedName}
                width={200}
                height={200}
                unoptimized
                className="w-48 h-48"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {capitalizedName}
              </h1>
              <p className="text-2xl text-gray-600">{formattedNumber}</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium capitalize"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Weight</p>
              <p className="text-xl font-semibold">{pokemon.weight / 10} kg</p>
            </div>
            <div>
              <p className="text-gray-600">Height</p>
              <p className="text-xl font-semibold">{pokemon.height / 10} m</p>
            </div>
            <div>
              <p className="text-gray-600">Moves</p>
              {pokemon.moves.map((m) => <p className="text-xl font-semibold">{m.move.name}</p>)}
            </div>
          </div>
        </div>

        {/* Base Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Base Stats</h2>
          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 capitalize">
                    {stat.stat.name}
                  </span>
                  <span className="font-semibold">{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
