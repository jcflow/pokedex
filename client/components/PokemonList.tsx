'use client'

import { useUIStore } from '@/store/useUIStore'
import PokemonCard from './PokemonCard'
import type { Pokemon } from '@/types/pokemon'
import { useMemo } from 'react'

/**
 * Props for PokemonList component
 */
interface PokemonListProps {
  /**
   * Array of Pokemon to display
   */
  pokemons: Pokemon[]
}

/**
 * PokemonList component
 *
 * Client-side component that filters and sorts Pokemon based on UI state.
 * Uses Zustand store for search term and sort criteria.
 *
 * @param props - Component props
 * @returns Filtered and sorted Pokemon grid
 */
export default function PokemonList({ pokemons }: PokemonListProps) {
  const { searchTerm, sortBy } = useUIStore()

  const filteredAndSortedPokemons = useMemo(() => {
    let result = [...pokemons]

    // Filter by search term
    if (searchTerm) {
      result = result.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by selected criteria
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else {
        return a.number - b.number
      }
    })

    return result
  }, [pokemons, searchTerm, sortBy])

  if (filteredAndSortedPokemons.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">No Pokemon found matching &quot;{searchTerm}&quot;</p>
      </div>
    )
  }

  return (
    <>
      {filteredAndSortedPokemons.map((pokemon) => (
        <div key={pokemon.id} role="listitem">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </>
  )
}
