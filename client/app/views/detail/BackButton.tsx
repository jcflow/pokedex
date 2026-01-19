'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import backIcon from '@/icons/back.svg'
import { useUIStore } from '@/store/useUIStore'
import { useCallback } from 'react'

export default function BackButton() {
    const router = useRouter()
    const { searchTerm, sortBy, currentPage } = useUIStore()

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
