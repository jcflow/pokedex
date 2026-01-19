import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
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

    it('should have no accessibility violations', async () => {
        const { container } = render(<PokemonCard pokemon={mockPokemon} />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('renders pokemon name and number correctly', () => {
        render(<PokemonCard pokemon={mockPokemon} />)

        expect(screen.getByText('Pikachu')).toBeInTheDocument() // Capitalized name
        expect(screen.getByText('#025')).toBeInTheDocument() // Formatted number
        expect(screen.getByAltText('Pikachu sprite')).toHaveAttribute('src', 'pikachu.png')
    })
})
