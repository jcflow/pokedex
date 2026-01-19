'use client'

import { memo } from 'react'
import type { PokemonStat, PokemonStatWrapper } from '@/types/pokemon'
import { getStatName, getBaseStat } from '@/types/pokemon'
import { getStatLabel, formatStatValue, getStatPercentage } from '@/app/utils'

/**
 * Props for PokemonStats component
 */
interface PokemonStatsProps {
  /** Array of Pokemon stats (can be wrapped or direct format) */
  stats: Array<PokemonStat | PokemonStatWrapper>
  /** Primary type color for styling */
  typeColor: string
}

/**
 * PokemonStats component
 *
 * Displays Pokemon base stats with progress bars.
 * Handles both wrapped (PokeAPI format) and direct stat formats.
 *
 * @param props - Component props
 * @returns Stats section with progress bars
 */
function PokemonStats({ stats, typeColor }: PokemonStatsProps) {
  return (
    <section aria-labelledby="stats-heading">
      <h2
        id="stats-heading"
        className="text-2xl font-bold text-center mb-6"
        style={{ color: typeColor }}
      >
        Base Stats
      </h2>

      <div className="space-y-4 px-2 sm:px-8">
        {stats.map((stat) => {
          const statName = getStatName(stat)
          const baseStat = getBaseStat(stat)
          const statLabel = getStatLabel(statName)

          return (
            <div key={statName} className="flex items-center text-sm">
              <span
                className="w-12 font-bold text-gray-500"
                style={{ color: typeColor }}
              >
                {statLabel}
              </span>
              <span className="w-12 text-gray-900 font-medium text-right mr-4">
                {formatStatValue(baseStat)}
              </span>
              <div
                className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={baseStat}
                aria-valuemin={0}
                aria-valuemax={255}
                aria-label={`${statLabel} stat`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${getStatPercentage(baseStat)}%`,
                    backgroundColor: typeColor,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default memo(PokemonStats)
