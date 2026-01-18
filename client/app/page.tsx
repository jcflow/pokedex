import Header from '@/components/Header'
import PokemonList from '@/components/PokemonList'
import SearchBar from '@/components/SearchBar'
import SortDropdown from '@/components/SortDropdown'
import Pagination from '@/components/Pagination'
import { fetchPokemons } from '@/lib/api'
import type { Pokemon } from '@/types/pokemon'

/**
 * Props for Home page
 */
interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

/**
 * Home page - Pokemon list with pagination, search, and sort
 *
 * Server-side rendered page that fetches Pokemon data and provides
 * client-side filtering and sorting capabilities.
 *
 * @param props - Page props with search params
 * @returns Pokemon list page
 */
export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 20

  const pokemonData = await fetchPokemons(page, limit)

  // Transform API response to Pokemon array
  const pokemons: Pokemon[] = pokemonData.results.map((result, index) => {
    // Extract Pokemon ID from URL (e.g., "https://pokeapi.co/api/v2/pokemon/1/")
    const idMatch = result.url.match(/\/(\d+)\/$/)
    const id = idMatch ? parseInt(idMatch[1], 10) : (page - 1) * limit + index + 1

    return {
      id,
      name: result.name,
      number: id,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    }
  })

  // Calculate total pages (PokeAPI returns total count)
  const totalPages = Math.ceil(pokemonData.count / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <SearchBar />
          <SortDropdown />
        </div>

        {/* Pokemon Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
          role="list"
          aria-label="Pokemon list"
        >
          <PokemonList pokemons={pokemons} />
        </div>

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={totalPages} />
      </main>
    </div>
  )
}
