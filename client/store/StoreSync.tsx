'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useUIStore, type SortBy } from '@/store/useUIStore'
import { TIMING } from '@/lib/constants'

/** Default sort option - omitted from URL for cleaner URLs */
const DEFAULT_SORT: SortBy = 'number'

/**
 * StoreSync component
 *
 * Bidirectional sync between URL query params and Zustand store.
 * Handles two sync directions:
 * 1. URL → Store: On mount and browser navigation (back/forward)
 * 2. Store → URL: When user interacts with search/sort controls
 *
 * Uses debouncing to prevent excessive URL updates during typing.
 *
 * @returns null (invisible sync component)
 */
export default function StoreSync() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    searchTerm,
    sortBy,
    currentPage,
    setSearchTerm,
    setSortBy,
    setCurrentPage,
  } = useUIStore()

  // Track hydration state to prevent overwriting URL on initial render
  const isHydrated = useRef(false)
  const prevSearch = useRef(searchTerm)
  const prevSort = useRef(sortBy)

  /**
   * Effect 1: Sync URL → Store
   *
   * Runs on mount and when searchParams change (browser back/forward).
   * Updates store to match URL state.
   */
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlSort = (searchParams.get('sort') as SortBy) || DEFAULT_SORT
    const urlPage = Number(searchParams.get('page')) || 1

    // Only update store if values differ to avoid infinite loops
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
  }, [searchParams]) // Depend on searchParams to catch browser navigation

  /**
   * Effect 2: Sync Store → URL
   *
   * Runs when store values change (user interaction).
   * Debounced to prevent history spam during typing.
   */
  useEffect(() => {
    if (!isHydrated.current) return

    const timeoutId = setTimeout(() => {
      // Skip if nothing actually changed
      if (
        searchTerm === prevSearch.current &&
        sortBy === prevSort.current
      ) {
        return
      }

      const params = new URLSearchParams(searchParams.toString())

      // Update search param
      if (searchTerm) {
        params.set('search', searchTerm)
      } else {
        params.delete('search')
      }

      // Update sort param (omit default value to keep URL clean)
      if (sortBy && sortBy !== DEFAULT_SORT) {
        params.set('sort', sortBy)
      } else {
        params.delete('sort')
      }

      // Reset pagination when filters change
      if (
        searchTerm !== prevSearch.current ||
        sortBy !== prevSort.current
      ) {
        params.delete('page')
      }

      prevSearch.current = searchTerm
      prevSort.current = sortBy

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, TIMING.URL_SYNC_DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, pathname, router]) // Intentionally omit searchParams to avoid sync loop

  return null
}
