import { create } from 'zustand'

/**
 * Sort options for Pokemon list
 */
export type SortBy = 'name' | 'number'

/**
 * UI state interface
 */
interface UIState {
  /**
   * Current search term for filtering Pokemon
   */
  searchTerm: string

  /**
   * Current sort criteria
   */
  sortBy: SortBy

  /**
   * Update the search term
   * @param term - The new search term
   */
  setSearchTerm: (term: string) => void

  /**
   * Update the sort criteria
   * @param sort - The new sort criteria
   */
  setSortBy: (sort: SortBy) => void

  /**
   * Clear the search term
   */
  clearSearch: () => void
}

/**
 * Zustand store for UI state management
 *
 * Manages client-side UI state including:
 * - Search term for filtering Pokemon
 * - Sort criteria (name or number)
 *
 * @example
 * ```tsx
 * const { searchTerm, setSearchTerm } = useUIStore()
 * ```
 */
export const useUIStore = create<UIState>((set) => ({
  searchTerm: '',
  sortBy: 'number',

  setSearchTerm: (term: string) => set({ searchTerm: term }),

  setSortBy: (sort: SortBy) => set({ sortBy: sort }),

  clearSearch: () => set({ searchTerm: '' }),
}))
