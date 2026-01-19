import { render, screen } from '@testing-library/react'
import PokemonCard from '@/app/views/index/PokemonCard'

// Mock Card since we tested it separately
jest.mock('@/components/Card', () => {
    return function MockCard({ children, topText, imageSrc, imageAlt }: any) {
        return (
            <div data-testid="mock-card">
                <span>{topText}</span>
                <img src={imageSrc} alt={imageAlt} />
                {children}
            </div>
        )
    }
})

describe('PokemonCard (View)', () => {
    const mockPokemon = {
        id: 25,
        name: 'pikachu',
        number: 25,
        sprite: 'pikachu.png'
    }

    it('formats data correctly for Card', () => {
        render(<PokemonCard pokemon={mockPokemon} />)

        expect(screen.getByText('Pikachu')).toBeInTheDocument() // Capitalized name
        expect(screen.getByText('#025')).toBeInTheDocument() // Formatted number
        expect(screen.getByAltText('Pikachu sprite')).toHaveAttribute('src', 'pikachu.png')
    })
})
