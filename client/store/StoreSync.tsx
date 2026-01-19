'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useUIStore, type SortBy } from '@/store/useUIStore'

export default function StoreSync() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { searchTerm, sortBy, currentPage, setSearchTerm, setSortBy, setCurrentPage } = useUIStore()

    // Track initial hydration to avoid overwriting URL on first render
    const isHydrated = useRef(false)
    const prevSearch = useRef(searchTerm)
    const prevSort = useRef(sortBy)
    const prevPage = useRef(currentPage)

    // 1. Sync URL -> Store (On Mount/Popstate)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || ''
        const urlSort = (searchParams.get('sort') as SortBy) || 'number'
        const urlPage = Number(searchParams.get('page')) || 1

        // Only update store if values differ, to avoid infinite loops if store updates trigger URL updates
        if (urlSearch !== searchTerm) {
            setSearchTerm(urlSearch)
        }

        if (urlSort !== sortBy) {
            setSortBy(urlSort)
        }

        if (urlPage !== currentPage) {
            setCurrentPage(urlPage)
        }

        prevSearch.current = urlSearch
        prevSort.current = urlSort
        isHydrated.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]) // Depend on searchParams to catch browser nav (back/forward)

    // 2. Sync Store -> URL (On Change)
    useEffect(() => {
        if (!isHydrated.current) return

        // Debounce search update to avoid massive history spam
        const timeoutId = setTimeout(() => {
            // Check if actually changed to prevent redundant pushes
            if (searchTerm === prevSearch.current && sortBy === prevSort.current) {
                return
            }

            const params = new URLSearchParams(searchParams.toString())

            // Update Search
            if (searchTerm) {
                params.set('search', searchTerm)
            } else {
                params.delete('search')
            }

            // Update Sort
            if (sortBy && sortBy !== 'number') { // Default is number, keep URL clean? Or persistent? User said persist.
                params.set('sort', sortBy)
            } else {
                // Optionally keep 'sort=number' explicitly or remove if default. 
                // Let's set it if it's explicitly 'number' to be safe, or remove if we consider it default.
                // Given requirements, let's keep it explicit if it was set, or just set it.
                if (sortBy === 'number') params.delete('sort')
                // Edit: If user wants "persist", maybe explicit is better. 
                // But usually default is omitted. I'll omit default "number" to keep URL clean.
            }

            // Reset Pagination on filter change
            if (searchTerm !== prevSearch.current || sortBy !== prevSort.current) {
                params.delete('page') // Resets to page 1
            }

            prevSearch.current = searchTerm
            prevSort.current = sortBy

            router.replace(`${pathname}?${params.toString()}`, { scroll: false })

        }, 300) // 300ms debounce for search

        return () => clearTimeout(timeoutId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, sortBy, pathname, router]) // Intentionally omit searchParams to avoid loop, we build FROM current params but triggers on store change

    return null
}
