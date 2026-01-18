'use client'

import { useUIStore } from '@/store/useUIStore'
import { useEffect, useState } from 'react'

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
export default function SearchBar() {
  const { searchTerm, setSearchTerm, clearSearch } = useUIStore()
  const [localValue, setLocalValue] = useState(searchTerm)

  // Sync local value with store when store changes externally
  useEffect(() => {
    setLocalValue(searchTerm)
  }, [searchTerm])

  // Update store when local value changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, setSearchTerm])

  const handleClear = () => {
    setLocalValue('')
    clearSearch()
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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
          aria-label="Search Pokemon by name"
          placeholder="Search Pokemon..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
