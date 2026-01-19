'use client'

import { memo } from 'react'
import type { PokemonType, PokemonTypeWrapper } from '@/types/pokemon'
import { getTypeName } from '@/types/pokemon'

/**
 * Props for PokemonTypes component
 */
interface PokemonTypesProps {
  /** Array of Pokemon types (can be wrapped or direct format) */
  types: Array<PokemonType | PokemonTypeWrapper>
}

/**
 * PokemonTypes component
 *
 * Displays Pokemon type badges with color-coded styling.
 * Handles both wrapped (PokeAPI format) and direct type formats.
 *
 * @param props - Component props
 * @returns Type badges list
 */
function PokemonTypes({ types }: PokemonTypesProps) {
  return (
    <ul className="flex justify-center gap-4 mb-8" aria-label="Pokemon Types">
      {types.map((typeObj) => {
        const typeName = getTypeName(typeObj)
        return (
          <li
            key={typeName}
            className="px-5 py-1 rounded-full text-white font-bold text-sm capitalize shadow-sm"
            style={{ backgroundColor: `var(--color-${typeName})` }}
          >
            {typeName}
          </li>
        )
      })}
    </ul>
  )
}

export default memo(PokemonTypes)
