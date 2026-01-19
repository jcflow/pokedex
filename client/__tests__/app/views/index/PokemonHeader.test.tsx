import { render, screen } from '@testing-library/react'
import PokemonHeader from '@/app/views/index/PokemonHeader'
import { useUIStore } from '@/store/useUIStore'

// Mock child components
jest.mock('@/app/views/index/SearchBar', () => {
    return function MockSearchBar() {
        return <div data-testid="search-bar">Search Bar</div>
    }
})

jest.mock('@/app/views/index/SortButton', () => {
    return function MockSortButton() {
        return <div data-testid="sort-button">Sort Button</div>
    }
})

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

jest.mock('@/lib/api', () => ({
    logout: jest.fn(),
}))

describe('PokemonHeader', () => {
    it('renders header elements', () => {
        render(<PokemonHeader />)

        // Assert Title
        expect(screen.getByText('Pokédex')).toBeInTheDocument()

        // Assert Icon (by alt text)
        expect(screen.getByAltText('Pokeball')).toBeInTheDocument()

        // Assert Child Components
        expect(screen.getByTestId('search-bar')).toBeInTheDocument()
        expect(screen.getByTestId('sort-button')).toBeInTheDocument()
    })
})
