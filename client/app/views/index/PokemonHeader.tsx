import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import SortDropdown from './SortButton'
import Image from 'next/image'
import pokeballIcon from '@/icons/pokeball.svg'
import { logout } from '@/lib/api'
import exitIcon from '@/icons/arrow_back.svg' // Using arrow_back as placeholder or text if missing

/**
 * PokemonHeader Component
 * 
 * Implements the red header with Pokeball icon, title, search bar, and sort controls.
 */
export default function PokemonHeader() {
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error('Logout failed', error)
            // Force redirect anyway
            router.push('/login')
        }
    }

    return (
        <header className="pt-8 pb-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--primary-red)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Title Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
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

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-white font-bold text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Logout"
                    >
                        {isLoggingOut ? '...' : 'LOGOUT'}
                    </button>
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
