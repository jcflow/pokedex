'use client'

import { memo } from 'react'
import PokemonCard from './PokemonCard'
import type { Pokemon } from '@/types/pokemon'

/**
 * Props for PokemonList component
 */
interface PokemonListProps {
  /**
   * Array of Pokemon to display (already filtered/sorted by server)
   */
  pokemons: Pokemon[]

  /**
   * Current search term (for empty state message)
   */
  searchTerm?: string

  /**
   * Total count of results (for display purposes)
   */
  totalCount?: number
}

/**
 * PokemonList component
 *
 * Displays a list of Pokemon cards. Filtering and sorting is handled
 * server-side via the API - this component simply renders the results.
 *
 * Memoized to prevent unnecessary re-renders when parent component updates
 * with same props.
 *
 * @param props - Component props
 * @returns Pokemon grid
 */
function PokemonList({ pokemons, searchTerm }: PokemonListProps) {
  if (pokemons.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchTerm
            ? `No Pokemon found matching "${searchTerm}"`
            : 'No Pokemon found'}
        </p>
      </div>
    )
  }

  return (
    <>
      {pokemons.map((pokemon) => (
        <div key={pokemon.id} role="listitem">
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </>
  )
}

export default memo(PokemonList)
