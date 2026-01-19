import { render, screen, waitFor } from '@testing-library/react'
import PokemonList from '@/app/views/index/PokemonList'
import { fetchPokemonDetail } from '@/lib/api'

// Mock API and Store
jest.mock('@/lib/api')

// Mock PokemonCard to avoid nested rendering issues and make assertions easier
jest.mock('@/app/views/index/PokemonCard', () => {
    return function MockPokemonCard({ pokemon }: { pokemon: any }) {
        return <div data-testid="pokemon-card">{pokemon.name} - #{pokemon.id}</div>
    }
})

// Store Mock Setup
let mockStore = {
    searchTerm: '',
    sortBy: 'number',
}

jest.mock('@/store/useUIStore', () => ({
    useUIStore: () => mockStore,
}))

const mockPokemons = [
    { id: 1, number: 1, name: 'Bulbasaur', sprite: 'url1', types: [], abilities: [], stats: [] },
    { id: 4, number: 4, name: 'Charmander', sprite: 'url2', types: [], abilities: [], stats: [] },
    { id: 25, number: 25, name: 'Pikachu', sprite: 'url3', types: [], abilities: [], stats: [] },
]

describe('PokemonList', () => {
    beforeEach(() => {
        mockStore = { searchTerm: '', sortBy: 'number' }
        jest.clearAllMocks()
    })

    it('renders all pokemon initially', () => {
        render(<PokemonList pokemons={mockPokemons} />)
        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(3)
        expect(screen.getByText('Bulbasaur - #1')).toBeInTheDocument()
    })

    it('filters pokemon by name', () => {
        mockStore.searchTerm = 'saur'
        render(<PokemonList pokemons={mockPokemons} />)

        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1)
        expect(screen.getByText('Bulbasaur - #1')).toBeInTheDocument()
        expect(screen.queryByText('Pikachu - #25')).not.toBeInTheDocument()
    })

    it('displays no results message', () => {
        mockStore.searchTerm = 'Digimon'
        render(<PokemonList pokemons={mockPokemons} />)

        expect(screen.getByText(/No Pokemon found matching "Digimon"/i)).toBeInTheDocument()
        expect(screen.queryByTestId('pokemon-card')).not.toBeInTheDocument()
    })

    it('sorts by name', () => {
        mockStore.sortBy = 'name'
        render(<PokemonList pokemons={mockPokemons} />)

        const cards = screen.getAllByTestId('pokemon-card')
        expect(cards[0]).toHaveTextContent('Bulbasaur')
        expect(cards[1]).toHaveTextContent('Charmander')
        expect(cards[2]).toHaveTextContent('Pikachu')
    })

    it('sorts by number', () => {
        // Reverse order input to test sort
        const reversed = [...mockPokemons].reverse()
        mockStore.sortBy = 'number'

        render(<PokemonList pokemons={reversed} />)

        const cards = screen.getAllByTestId('pokemon-card')
        expect(cards[0]).toHaveTextContent('Bulbasaur') // #1
        expect(cards[1]).toHaveTextContent('Charmander') // #4
        expect(cards[2]).toHaveTextContent('Pikachu') // #25
    })

    it('handles ID search (#id)', async () => {
        mockStore.searchTerm = '#151'
            ; (fetchPokemonDetail as jest.Mock).mockResolvedValue({
                id: 151,
                name: 'Mew',
                sprites: { other: { 'official-artwork': { front_default: 'mew-url' } } }
            })

        render(<PokemonList pokemons={mockPokemons} />)

        expect(screen.getByText(/Searching for Pokemon #151/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Mew - #151')).toBeInTheDocument()
        })
    })

    it('handles ID search not found', async () => {
        mockStore.searchTerm = '#9999'
            ; (fetchPokemonDetail as jest.Mock).mockRejectedValue(new Error('Not Found'))

        render(<PokemonList pokemons={mockPokemons} />)

        await waitFor(() => {
            expect(screen.getByText('Pokemon #9999 not found')).toBeInTheDocument()
        })
    })
})
