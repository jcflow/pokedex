import { render, screen } from '@testing-library/react'
import PokemonDetailPage from '@/app/pokemon/[id]/page'
import { fetchPokemonDetail } from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api', () => ({
  fetchPokemonDetail: jest.fn(),
}))

// Mock data matching PokeAPI response format used by the page
const mockPokemon = {
  id: 25,
  name: 'pikachu',
  order: 35,
  height: 4,
  weight: 60,
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      },
    },
  },
  moves: [
    { move: { name: 'mega-punch' } },
    { move: { name: 'thunder-shock' } },
    { move: { name: 'quick-attack' } },
  ],
  types: [{ type: { name: 'electric' } }],
  stats: [
    { stat: { name: 'hp' }, base_stat: 35 },
    { stat: { name: 'attack' }, base_stat: 55 },
    { stat: { name: 'defense' }, base_stat: 40 },
    { stat: { name: 'special-attack' }, base_stat: 50 },
    { stat: { name: 'special-defense' }, base_stat: 50 },
    { stat: { name: 'speed' }, base_stat: 90 },
  ],
}

describe('Pokemon Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders Pokemon name capitalized', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('renders Pokemon number with # prefix', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    expect(screen.getByText('#035')).toBeInTheDocument()
  })

  it('renders Pokemon image', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    const image = screen.getByAltText('Pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('25.png'))
  })

  it('renders moves in About section', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByText('mega-punch')).toBeInTheDocument()
    expect(screen.getByText('thunder-shock')).toBeInTheDocument()
  })

  it('renders types section', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    // Types are displayed as badges in the header
    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('renders stats section', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    // Stats section has heading "Base Stats"
    expect(screen.getByRole('heading', { name: /base stats/i })).toBeInTheDocument()
    expect(screen.getByText('hp')).toBeInTheDocument()
    expect(screen.getByText('35')).toBeInTheDocument()
    expect(screen.getByText('attack')).toBeInTheDocument()
    expect(screen.getByText('55')).toBeInTheDocument()
  })

  it('renders weight and height', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    expect(screen.getByText('Weight')).toBeInTheDocument()
    expect(screen.getByText('6 kg')).toBeInTheDocument()
    expect(screen.getByText('Height')).toBeInTheDocument()
    expect(screen.getByText('0.4 m')).toBeInTheDocument()
  })

  it('renders back button with correct ARIA label', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    const backButton = screen.getByLabelText(/back to pokemon list/i)
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveAttribute('href', '/')
  })

  it('has proper semantic HTML structure', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

    const page = await PokemonDetailPage({
      params: Promise.resolve({ id: '25' }),
    })
    render(page)

    // Should have main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('shows error when Pokemon not found', async () => {
    ;(fetchPokemonDetail as jest.Mock).mockRejectedValue(
      new Error('Pokemon not found')
    )

    await expect(async () => {
      const page = await PokemonDetailPage({
        params: Promise.resolve({ id: '999999' }),
      })
      render(page)
    }).rejects.toThrow('Pokemon not found')
  })
})
