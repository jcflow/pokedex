'use client'

import SearchBar from './SearchBar'
import SortDropdown from './SortButton'
import Image from 'next/image'
import pokeballIcon from '@/icons/pokeball.svg'

/**
 * PokemonHeader Component
 * 
 * Implements the red header with Pokeball icon, title, search bar, and sort controls.
 */
export default function PokemonHeader() {
    return (
        <header className="pt-8 pb-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--primary-red)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Title Row */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Pokeball Icon */}
                    <div className="w-8 h-8 relative">
                        <Image
                            src={pokeballIcon}
                            alt="Pokeball"
                            fill
                            className="object-contain brightness-0 invert"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Pokédex</h1>
                </div>

                {/* Controls Row */}
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <SearchBar />
                    </div>
                    <div className="flex-none">
                        <SortDropdown />
                    </div>
                </div>
            </div>
        </header>
    )
}
