import PokemonHeader from '@/app/views/index/PokemonHeader'
import PokemonList from '@/app/views/index/PokemonList'
import Pagination from '@/app/views/index/Pagination'
import { fetchPokemons } from '@/lib/api'
import type { Pokemon } from '@/types/pokemon'
import FullPageLayout from '@/app/layouts/FullPageLayout'
import { Metadata } from 'next'

import StoreSync from '@/store/StoreSync'

interface IndexPageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `List of Pokemon - Pokédex`,
    description: `A complete list of Pokemon`,
  }
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
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
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    }
  })

  // Calculate total pages (PokeAPI returns total count)
  const totalPages = Math.ceil(pokemonData.count / limit)

  return (
    <FullPageLayout header={<PokemonHeader />}>
      <StoreSync />
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
    </FullPageLayout>
  )
}
