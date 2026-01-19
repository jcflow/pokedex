'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import backIcon from '@/icons/back.svg'
import { useUIStore } from '@/store/useUIStore'

/**
 * BackButton - Navigation button to return to Pokemon list
 *
 * Navigates back to the main Pokemon list while preserving the user's
 * previous search, sort, and pagination state. This ensures a seamless
 * browsing experience when returning from a detail page.
 *
 * State preserved:
 * - Search term (if any)
 * - Sort preference (name/number)
 * - Current page number
 *
 * @returns Back navigation button with arrow icon
 *
 * @example
 * ```tsx
 * <BackButton />
 * ```
 */
export default function BackButton() {
    const router = useRouter()
    const { searchTerm, sortBy, currentPage } = useUIStore()

    /**
     * Navigates back to main list with preserved filter state.
     * Constructs URL params from current store values.
     */
    const handleBack = useCallback(() => {
        const params = new URLSearchParams()
        if (searchTerm) params.set('search', searchTerm)
        if (sortBy && sortBy !== 'number') params.set('sort', sortBy)
        if (currentPage > 1) params.set('page', currentPage.toString())

        router.push(`/?${params.toString()}`)
    }, [router, searchTerm, sortBy, currentPage])

    return (
        <button
            onClick={handleBack}
            className="flex items-center hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
            aria-label="Go back"
        >
            <Image
                src={backIcon}
                alt="Back"
                width={32}
                height={32}
                className="w-8 h-8"
                style={{ filter: 'brightness(0) invert(1)' }}
            />
        </button>
    )
}
