import { render, screen, fireEvent, act } from '@testing-library/react'
import SearchBar from '@/app/views/index/SearchBar'

// Mock the store
const mockSetSearchTerm = jest.fn()
const mockClearSearch = jest.fn()

jest.mock('@/store/useUIStore', () => ({
    useUIStore: () => ({
        searchTerm: '',
        setSearchTerm: mockSetSearchTerm,
        clearSearch: mockClearSearch,
    }),
}))

describe('SearchBar', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('renders search input', () => {
        render(<SearchBar />)
        expect(screen.getByRole('searchbox')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })

    it('updates store after debounce', () => {
        render(<SearchBar />)
        const input = screen.getByRole('searchbox')

        fireEvent.change(input, { target: { value: 'pika' } })

        // Should not have called yet
        expect(mockSetSearchTerm).not.toHaveBeenCalled()

        // Fast forward time
        act(() => {
            jest.advanceTimersByTime(300)
        })

        expect(mockSetSearchTerm).toHaveBeenCalledWith('pika')
    })
})
