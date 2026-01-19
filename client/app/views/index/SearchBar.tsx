'use client'

import { useCallback, useEffect, useRef, useState, memo } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { TIMING } from '@/lib/constants'

/**
 * SearchBar component
 *
 * Provides a search input for filtering Pokemon by name.
 * Updates Zustand store with debounced search term.
 * Includes a clear button that appears when text is entered.
 *
 * @returns Search input with clear button
 *
 * @example
 * ```tsx
 * <SearchBar />
 * ```
 */
function SearchBar() {
  const { searchTerm, setSearchTerm, clearSearch } = useUIStore()
  const [localValue, setLocalValue] = useState(searchTerm)
  const prevSearchTerm = useRef(searchTerm)

  // Sync local value with store when store changes externally (e.g., URL navigation)
  // Using ref comparison to avoid triggering on every render
  if (searchTerm !== prevSearchTerm.current) {
    prevSearchTerm.current = searchTerm
    if (searchTerm !== localValue) {
      setLocalValue(searchTerm)
    }
  }

  // Update store when local value changes (debounced to prevent excessive updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localValue)
    }, TIMING.SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [localValue, setSearchTerm])

  /**
   * Clears the search input and resets store state
   */
  const handleClear = useCallback(() => {
    setLocalValue('')
    clearSearch()
  }, [clearSearch])

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 primary-text"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="search"
          role="searchbox"
          aria-label="Search Pokemon by name or number (use # for ID, e.g. #25)"
          placeholder="Search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="block w-full pl-12 pr-10 py-3 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-white/20 focus:border-transparent text-gray-900 shadow-inner"
        />

        {/* Clear Button */}
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(SearchBar)
