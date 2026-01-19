import PokemonHeader from '@/app/views/index/PokemonHeader'
import PokemonList from '@/app/views/index/PokemonList'
import Pagination from '@/app/views/index/Pagination'
import { fetchPokemons } from '@/lib/api'
import type { Pokemon } from '@/types/pokemon'
import FullPageLayout from '@/app/layouts/FullPageLayout'
import { Metadata } from 'next'
import { POKEMON_CONFIG } from '@/lib/constants'
import { extractPokemonIdFromUrl } from '@/app/utils'

import StoreSync from '@/store/StoreSync'

/**
 * Props for IndexPage component
 */
interface IndexPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    sort?: 'name' | 'number'
  }>
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `List of Pokemon - Pokédex`,
    description: `A complete list of Pokemon`,
  }
}

/**
 * Transforms API result to Pokemon display data.
 *
 * Handles two API response formats:
 * 1. Search/sort mode: `result.number` contains the Pokemon ID directly
 * 2. Basic pagination: Extract ID from `result.url` using regex
 *
 * @param result - API result item
 * @returns Pokemon object for display
 */
function transformPokemonResult(result: {
  name: string
  url: string
  number?: number
}): Pokemon {
  // Prefer explicit number from API (search/sort mode provides this)
  // Fall back to extracting from URL for basic pagination mode
  const id = result.number ?? extractPokemonIdFromUrl(result.url) ?? 1

  return {
    id,
    name: result.name,
    number: id,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  }
}

/**
 * IndexPage - Server Component
 *
 * Main Pokemon list page with server-side data fetching.
 * Supports search, sort, and pagination via URL query params.
 *
 * @param props - Page props with search params
 * @returns Pokemon list page
 */
export default async function IndexPage({ searchParams }: IndexPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || undefined
  const sort = params.sort || undefined
  const limit = POKEMON_CONFIG.PAGE_SIZE

  // Fetch Pokemon with search/sort params (server-side filtering)
  const pokemonData = await fetchPokemons({ page, limit, search, sort })

  // Transform API response to Pokemon array
  const pokemons: Pokemon[] = pokemonData.results.map(transformPokemonResult)

  // Calculate total pages - use total_pages from API (search/sort mode) or calculate from count
  const totalPages =
    pokemonData.total_pages ?? Math.ceil((pokemonData.count ?? 0) / limit)
  const totalCount = pokemonData.total ?? pokemonData.count ?? 0

  return (
    <FullPageLayout header={<PokemonHeader />}>
      <StoreSync />
      {/* Pokemon Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
        role="list"
        aria-label="Pokemon list"
      >
        <PokemonList
          pokemons={pokemons}
          searchTerm={search}
          totalCount={totalCount}
        />
      </div>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} />
    </FullPageLayout>
  )
}
