import { render, screen } from '@testing-library/react'
import PokemonCard from '@/components/PokemonCard'
import type { Pokemon } from '@/types/pokemon'

describe('PokemonCard', () => {
  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    number: 25,
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  }

  it('renders Pokemon name', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('renders Pokemon number', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('renders Pokemon image with correct src', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockPokemon.sprite)
  })

  it('renders Pokemon image with accessible alt text', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Pikachu sprite')
  })

  it('capitalizes Pokemon name properly', () => {
    const lowercasePokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      number: 1,
      sprite: 'https://example.com/bulbasaur.png',
    }
    render(<PokemonCard pokemon={lowercasePokemon} />)
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
  })

  it('formats number with leading zeros', () => {
    const singleDigitPokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      number: 1,
      sprite: 'https://example.com/bulbasaur.png',
    }
    render(<PokemonCard pokemon={singleDigitPokemon} />)
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('handles three-digit numbers correctly', () => {
    const threeDigitPokemon: Pokemon = {
      id: 150,
      name: 'mewtwo',
      number: 150,
      sprite: 'https://example.com/mewtwo.png',
    }
    render(<PokemonCard pokemon={threeDigitPokemon} />)
    expect(screen.getByText('#150')).toBeInTheDocument()
  })

  it('links to Pokemon detail page', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pokemon/25')
  })

  it('has accessible aria-label for detail link', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    const link = screen.getByLabelText('View details for Pikachu')
    expect(link).toBeInTheDocument()
  })

  it('is keyboard accessible with focus styles', () => {
    render(<PokemonCard pokemon={mockPokemon} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('focus:outline-none', 'focus:ring-2')
  })
})
