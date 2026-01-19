import Image from 'next/image'
import Link from 'next/link'
import { fetchPokemonDetail } from '@/lib/api'
import type { Metadata } from 'next'
import BackButton from '@/app/views/detail/BackButton'
import weightIcon from '@/icons/weight.svg'
import rulerIcon from '@/icons/ruler.svg'
import navLeftIcon from '@/icons/nav-left.svg'
import navRightIcon from '@/icons/nav-right.svg'
import pokePlaceholder from '@/icons/poke-placeholder.svg'
import DetailLayout from '@/app/layouts/DetailLayout'
import { useCallback } from 'react'

interface PokemonDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PokemonDetailPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const pokemon = await fetchPokemonDetail(id)
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    return {
      title: `${capitalizedName} - Pokédex`,
      description: `View detailed information about ${capitalizedName}.`,
    }
  } catch {
    return {
      title: 'Pokemon Not Found - Pokédex',
      description: 'The requested Pokemon could not be found.',
    }
  }
}


// Format stats
function getStatLabel(name: string) {
  switch (name) {
    case 'hp': return 'HP';
    case 'attack': return 'ATK';
    case 'defense': return 'DEF';
    case 'special-attack': return 'SATK';
    case 'special-defense': return 'SDEF';
    case 'speed': return 'SPD';
    default: return name.toUpperCase();
  }
}

function formatStatValue(val: number) {
  return String(val).padStart(3, '0')
}

export default async function PokemonDetailPage({
  params,
}: PokemonDetailPageProps) {
  const { id } = await params
  const pokemon = await fetchPokemonDetail(id)

  const capitalizedName = pokemon.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const formattedNumber = `#${String(pokemon.id).padStart(3, '0')}`

  // Handle potential type mismatch where API returns type object wrapper
  const firstType = pokemon.types[0] as any
  const mainType = firstType?.type?.name || firstType?.name || 'normal'

  // Calculate Next/Prev IDs (Simple implementation)
  const numericId = Number(pokemon.id);
  const prevId = numericId > 1 ? numericId - 1 : null;
  const nextId = numericId + 1; // Simplification, max check omitted for now

  return (
    <DetailLayout
      header={
        <>
          <BackButton />
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">{capitalizedName}</h1>
          </div>
          <span className="text-xl font-bold">{formattedNumber}</span>
        </>
      }
      mainColor={`var(--color-${mainType})`}
    >
      {/* Image Navigation */}
      <div className="flex items-center justify-between w-full px-6 mb-[-3rem] z-20">
        {prevId ? (
          <Link href={`/pokemon/${prevId}`} className="text-white hover:scale-110 transition-transform">
            <Image src={navLeftIcon} alt="Previous" width={24} height={24} className="w-8 h-8" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
        ) : <div className="w-8" />}

        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
          <Image
            src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprite || pokePlaceholder}
            alt={capitalizedName}
            className="object-contain drop-shadow-xl"
            width={400}
            height={400}
            priority
          />
        </div>

        <Link href={`/pokemon/${nextId}`} className="text-white hover:scale-110 transition-transform">
          <Image src={navRightIcon} alt="Next" width={24} height={24} className="w-8 h-8" style={{ filter: 'brightness(0) invert(1)' }} />
        </Link>
      </div>

      {/* White Content Card */}
      <div className="bg-white rounded-[2rem] px-6 pt-16 pb-8 w-[95%] sm:w-full flex-1 shadow-2xl mx-4 mb-4">

        {/* Types */}
        <div className="flex justify-center gap-4 mb-8">
          {pokemon.types.map((typeObj: any) => {
            const typeName = typeObj.type?.name || typeObj.name;
            return (
              <span
                key={typeName}
                className="px-5 py-1 rounded-full text-white font-bold text-sm capitalize shadow-sm"
                style={{ backgroundColor: `var(--color-${typeName})` }}
              >
                {typeName}
              </span>
            )
          })}
        </div>

        {/* About Section */}
        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: `var(--color-${mainType})` }}>About</h3>

        <div className="grid grid-cols-3 divide-x divide-gray-200 mb-8">
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="flex items-center gap-2 text-gray-900">
              <Image src={weightIcon} alt="Weight" width={16} height={16} className="w-4 h-4 opacity-70" />
              <span>{pokemon.weight / 10} kg</span>
            </div>
            <span className="text-xs text-gray-500">Weight</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="flex items-center gap-2 text-gray-900">
              <Image src={rulerIcon} alt="Height" width={16} height={16} className="w-4 h-4 opacity-70" />
              <span>{pokemon.height / 10} m</span>
            </div>
            <span className="text-xs text-gray-500">Height</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-2">
            <div className="flex flex-col items-center text-xs text-gray-900 font-medium">
              {pokemon.moves && pokemon.moves.slice(0, 2).map((m: any) => (
                <span key={m.move?.name || m.name} className="capitalize">{m.move?.name || m.name}</span>
              ))}
            </div>
            <span className="text-xs text-gray-500 mt-1">Moves</span>
          </div>
        </div>

        {/* Description */}
        {pokemon.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-8 px-4 text-center">
            {pokemon.description}
          </p>
        )}

        {/* Base Stats */}
        <h3 className="text-2xl font-bold text-center mb-6" style={{ color: `var(--color-${mainType})` }}>Base Stats</h3>

        <div className="space-y-4 px-2 sm:px-8">
          {pokemon.stats.map((stat: any) => {
            const statName = stat.stat?.name || stat.name;
            const statLabel = getStatLabel(statName);
            return (
              <div key={statName} className="flex items-center text-sm">
                <span className="w-12 font-bold text-gray-500" style={{ color: `var(--color-${mainType})` }}>{statLabel}</span>
                <span className="w-12 text-gray-900 font-medium text-right mr-4">{formatStatValue(stat.base_stat)}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                      backgroundColor: `var(--color-${mainType})`
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </DetailLayout>
  )
}
