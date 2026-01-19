
import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import PokemonList from '@/app/views/index/PokemonList'

// Mock PokemonCard to avoid nested rendering issues and make assertions easier
jest.mock('@/app/views/index/PokemonCard', () => {
    return function MockPokemonCard({ pokemon }: { pokemon: { name: string; id: number } }) {
        return <div data-testid="pokemon-card">{pokemon.name} - #{pokemon.id}</div>
    }
})

const mockPokemons = [
    { id: 1, number: 1, name: 'Bulbasaur', sprite: 'url1' },
    { id: 4, number: 4, name: 'Charmander', sprite: 'url2' },
    { id: 25, number: 25, name: 'Pikachu', sprite: 'url3' },
]

describe('PokemonList', () => {
    it('should have no accessibility violations', async () => {
        const { container } = render(
            <div role="list">
                <PokemonList pokemons={mockPokemons} />
            </div>
        )
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('renders all pokemon', () => {
        render(<PokemonList pokemons={mockPokemons} />)
        expect(screen.getAllByTestId('pokemon-card')).toHaveLength(3)
        expect(screen.getByText('Bulbasaur - #1')).toBeInTheDocument()
        expect(screen.getByText('Charmander - #4')).toBeInTheDocument()
        expect(screen.getByText('Pikachu - #25')).toBeInTheDocument()
    })

    it('displays no results message when empty', () => {
        render(<PokemonList pokemons={[]} />)

        expect(screen.getByText('No Pokemon found')).toBeInTheDocument()
        expect(screen.queryByTestId('pokemon-card')).not.toBeInTheDocument()
    })

    it('displays no results message with search term', () => {
        render(<PokemonList pokemons={[]} searchTerm="Digimon" />)

        expect(screen.getByText('No Pokemon found matching "Digimon"')).toBeInTheDocument()
        expect(screen.queryByTestId('pokemon-card')).not.toBeInTheDocument()
    })

    it('renders pokemon in the order provided (server-side sorted)', () => {
        // Server returns sorted by name: Bulbasaur, Charmander, Pikachu
        const sortedByName = [
            { id: 1, number: 1, name: 'Bulbasaur', sprite: 'url1' },
            { id: 4, number: 4, name: 'Charmander', sprite: 'url2' },
            { id: 25, number: 25, name: 'Pikachu', sprite: 'url3' },
        ]

        render(<PokemonList pokemons={sortedByName} />)

        const cards = screen.getAllByTestId('pokemon-card')
        expect(cards[0]).toHaveTextContent('Bulbasaur')
        expect(cards[1]).toHaveTextContent('Charmander')
        expect(cards[2]).toHaveTextContent('Pikachu')
    })

    it('each pokemon card has listitem role', () => {
        render(<PokemonList pokemons={mockPokemons} />)

        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(3)
    })
})
