'use client'

import { useUIStore, type SortBy } from '@/store/useUIStore'

/**
 * SortDropdown component
 *
 * Toggle buttons for sorting Pokemon by name or number.
 * Updates Zustand store with selected sort option.
 *
 * @returns Sort toggle buttons
 *
 * @example
 * ```tsx
 * <SortDropdown />
 * ```
 */
export default function SortDropdown() {
  const { sortBy, setSortBy } = useUIStore()

  const handleSort = (sort: SortBy) => {
    setSortBy(sort)
  }

  return (
    <div role="group" aria-label="Sort options" className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => handleSort('name')}
          aria-pressed={sortBy === 'name'}
          className={`px-4 py-2 text-sm font-medium rounded-l-md border transition-colors ${
            sortBy === 'name'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Name
        </button>
        <button
          type="button"
          onClick={() => handleSort('number')}
          aria-pressed={sortBy === 'number'}
          className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b transition-colors ${
            sortBy === 'number'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Number
        </button>
      </div>
    </div>
  )
}
