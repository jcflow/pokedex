import { render, screen } from '@testing-library/react'
import IndexPage from '@/app/views/index/index'
import { fetchPokemons } from '@/lib/api'

// Mock dependencies
jest.mock('@/lib/api')
jest.mock('@/app/views/index/PokemonHeader', () => () => <div data-testid="pokemon-header">Header</div>)
jest.mock('@/app/views/index/PokemonList', () => () => <div data-testid="pokemon-list">List</div>)
jest.mock('@/app/views/index/Pagination', () => () => <div data-testid="pagination">Pagination</div>)
jest.mock('@/store/StoreSync', () => () => null)

describe('IndexPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders page components correctly', async () => {
        (fetchPokemons as jest.Mock).mockResolvedValue({
            count: 100,
            results: Array(20).fill({ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' })
        })

        const jsx = await IndexPage({ searchParams: Promise.resolve({}) })
        render(jsx)

        expect(screen.getByTestId('pokemon-header')).toBeInTheDocument()
        expect(screen.getByTestId('pokemon-list')).toBeInTheDocument()
        expect(screen.getByTestId('pagination')).toBeInTheDocument()
    })

    it('fetches pokemon with default parameters', async () => {
        (fetchPokemons as jest.Mock).mockResolvedValue({ count: 0, results: [] })

        const jsx = await IndexPage({ searchParams: Promise.resolve({}) })
        render(jsx)

        expect(fetchPokemons).toHaveBeenCalledWith(1, 20)
    })

    it('fetches pokemon with page parameter', async () => {
        (fetchPokemons as jest.Mock).mockResolvedValue({ count: 0, results: [] })

        const jsx = await IndexPage({ searchParams: Promise.resolve({ page: '5' }) })
        render(jsx)

        expect(fetchPokemons).toHaveBeenCalledWith(5, 20)
    })
})
