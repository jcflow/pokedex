'use client'

import { useUIStore } from '@/store/useUIStore'
import PokemonCard from './PokemonCard'
import type { Pokemon } from '@/types/pokemon'
import { useMemo, useEffect, useState } from 'react'
import { fetchPokemonDetail } from '@/lib/api'

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
 * When searching by ID (using #), fetches Pokemon directly from the API.
 *
 * @param props - Component props
 * @returns Filtered and sorted Pokemon grid
 */
export default function PokemonList({ pokemons }: PokemonListProps) {
  const { searchTerm, sortBy } = useUIStore()
  const [idSearchResult, setIdSearchResult] = useState<Pokemon | null>(null)
  const [idSearchLoading, setIdSearchLoading] = useState(false)
  const [idSearchError, setIdSearchError] = useState<string | null>(null)

  // Check if searching by ID
  const idMatch = searchTerm.match(/^#(\d+)$/)
  const isIdSearch = !!idMatch

  // Fetch Pokemon by ID when searching with #
  useEffect(() => {
    const match = searchTerm.match(/^#(\d+)$/)
    if (!match) {
      setIdSearchResult(null)
      setIdSearchError(null)
      return
    }

    const searchId = match[1]
    setIdSearchLoading(true)
    setIdSearchError(null)

    fetchPokemonDetail(searchId)
      .then((detail) => {
        setIdSearchResult({
          id: detail.id,
          name: detail.name,
          number: detail.id,
          sprite: detail.sprites?.other?.['official-artwork']?.front_default || detail.sprite || null,
        })
      })
      .catch(() => {
        setIdSearchResult(null)
        setIdSearchError(`Pokemon #${searchId} not found`)
      })
      .finally(() => {
        setIdSearchLoading(false)
      })
  }, [searchTerm])

  const filteredAndSortedPokemons = useMemo(() => {
    // If searching by ID, don't filter the regular list
    if (isIdSearch) {
      return []
    }

    let result = [...pokemons]

    // Filter by search term (name search)
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
  }, [pokemons, searchTerm, sortBy, isIdSearch])

  // Handle ID search states
  if (isIdSearch) {
    if (idSearchLoading) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">Searching for Pokemon {searchTerm}...</p>
        </div>
      )
    }

    if (idSearchError) {
      return (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-lg">{idSearchError}</p>
        </div>
      )
    }

    if (idSearchResult) {
      return (
        <div key={idSearchResult.id} role="listitem">
          <PokemonCard pokemon={idSearchResult} />
        </div>
      )
    }

    return null
  }

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
