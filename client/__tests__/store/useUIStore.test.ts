import { renderHook, act } from '@testing-library/react'
import { useUIStore } from '@/store/useUIStore'

describe('useUIStore', () => {
    const initialState = useUIStore.getState()

    beforeEach(() => {
        useUIStore.setState(initialState, true)
    })

    it('should have correct initial state', () => {
        const { result } = renderHook(() => useUIStore())
        expect(result.current.searchTerm).toBe('')
        expect(result.current.sortBy).toBe('number')
        expect(result.current.currentPage).toBe(1)
    })

    it('should set search term', () => {
        const { result } = renderHook(() => useUIStore())
        act(() => {
            result.current.setSearchTerm('pikachu')
        })
        expect(result.current.searchTerm).toBe('pikachu')
    })

    it('should set sort by', () => {
        const { result } = renderHook(() => useUIStore())
        act(() => {
            result.current.setSortBy('name')
        })
        expect(result.current.sortBy).toBe('name')
    })

    it('should set current page', () => {
        const { result } = renderHook(() => useUIStore())
        act(() => {
            result.current.setCurrentPage(5)
        })
        expect(result.current.currentPage).toBe(5)
    })
})
