'use client'

import { memo } from 'react'
import Image from 'next/image'
import type { PokemonMove, PokemonMoveWrapper } from '@/types/pokemon'
import { getMoveName } from '@/types/pokemon'
import weightIcon from '@/icons/weight.svg'
import rulerIcon from '@/icons/ruler.svg'

/**
 * Props for PokemonAbout component
 */
interface PokemonAboutProps {
  /** Pokemon weight in hectograms (API format) */
  weight: number
  /** Pokemon height in decimeters (API format) */
  height: number
  /** Array of Pokemon moves (can be wrapped or direct format) */
  moves: Array<PokemonMove | PokemonMoveWrapper>
  /** Primary type color for styling */
  typeColor: string
  /** Optional description text */
  description?: string
}

/**
 * PokemonAbout component
 *
 * Displays Pokemon physical attributes and moves.
 * Converts weight to kg and height to meters for display.
 *
 * @param props - Component props
 * @returns About section with weight, height, and moves
 */
function PokemonAbout({
  weight,
  height,
  moves,
  typeColor,
  description,
}: PokemonAboutProps) {
  return (
    <section aria-labelledby="about-heading">
      <h2
        id="about-heading"
        className="text-2xl font-bold text-center mb-6"
        style={{ color: typeColor }}
      >
        About
      </h2>

      <div className="grid grid-cols-3 divide-x divide-gray-200 mb-8">
        {/* Weight */}
        <div className="flex flex-col items-center gap-2 px-2">
          <div className="flex items-center gap-2 text-gray-900">
            <Image
              src={weightIcon}
              alt="Weight"
              width={16}
              height={16}
              className="w-4 h-4 opacity-70"
            />
            <span>{weight / 10} kg</span>
          </div>
          <span className="text-xs text-gray-500">Weight</span>
        </div>

        {/* Height */}
        <div className="flex flex-col items-center gap-2 px-2">
          <div className="flex items-center gap-2 text-gray-900">
            <Image
              src={rulerIcon}
              alt="Height"
              width={16}
              height={16}
              className="w-4 h-4 opacity-70"
            />
            <span>{height / 10} m</span>
          </div>
          <span className="text-xs text-gray-500">Height</span>
        </div>

        {/* Moves */}
        <div className="flex flex-col items-center gap-2 px-2">
          <div className="flex flex-col items-center text-xs text-gray-900 font-medium">
            {moves.slice(0, 2).map((move) => {
              const moveName = getMoveName(move)
              return (
                <span key={moveName} className="capitalize">
                  {moveName}
                </span>
              )
            })}
          </div>
          <span className="text-xs text-gray-500 mt-1">Moves</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-8 px-4 text-center">
          {description}
        </p>
      )}
    </section>
  )
}

export default memo(PokemonAbout)
