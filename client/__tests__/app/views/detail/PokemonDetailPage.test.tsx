import { render, screen } from '@testing-library/react'
import PokemonDetailPage from '@/app/views/detail/index'
import { fetchPokemonDetail } from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api')

// Mock Next.js Link to avoid routing issues in tests
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>
    }
})

// Mock Image to prevent optimized image issues
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { priority, ...rest } = props
        return <img {...rest} alt={props.alt} />
    },
}))

// Mock Subcomponents not crucial for this test
jest.mock('@/app/views/detail/BackButton', () => () => <div data-testid="back-button">Back</div>)

const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    number: 1,
    height: 7,
    weight: 69,
    sprite: 'bulbasaur-url',
    description: 'A strange seed was planted on its back at birth.',
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    moves: [{ move: { name: 'razor-wind' } }],
    stats: [
        { stat: { name: 'hp' }, base_stat: 45 },
        { stat: { name: 'attack' }, base_stat: 49 },
    ],
    sprites: { other: { 'official-artwork': { front_default: 'bulbasaur-url' } } }
}

describe('PokemonDetailPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders pokemon details correctly', async () => {
        (fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

        const jsx = await PokemonDetailPage({ params: Promise.resolve({ id: '1' }) })
        render(jsx)

        // Title and Number
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bulbasaur')
        expect(screen.getByText('#001')).toBeInTheDocument()

        // Types
        expect(screen.getByText('grass')).toBeInTheDocument()
        expect(screen.getByText('poison')).toBeInTheDocument()

        // Description
        expect(screen.getByText('A strange seed was planted on its back at birth.')).toBeInTheDocument()

        // Stats
        expect(screen.getByText('HP')).toBeInTheDocument()
        expect(screen.getByText('045')).toBeInTheDocument()
    })

    it('renders navigation links', async () => {
        (fetchPokemonDetail as jest.Mock).mockResolvedValue(mockPokemon)

        const jsx = await PokemonDetailPage({ params: Promise.resolve({ id: '1' }) })
        render(jsx)

        // Next link (2)
        const links = screen.getAllByRole('link')
        expect(links.some(link => link.getAttribute('href') === '/pokemon/2')).toBeTruthy()

        // Prev link should not exist for #1
        expect(links.some(link => link.getAttribute('href') === '/pokemon/0')).toBeFalsy()
    })

    it('handles next/prev logic correctly', async () => {
        (fetchPokemonDetail as jest.Mock).mockResolvedValue({
            ...mockPokemon,
            id: 25,
            number: 25
        })

        const jsx = await PokemonDetailPage({ params: Promise.resolve({ id: '25' }) })
        render(jsx)

        const links = screen.getAllByRole('link')
        expect(links.some(link => link.getAttribute('href') === '/pokemon/24')).toBeTruthy()
        expect(links.some(link => link.getAttribute('href') === '/pokemon/26')).toBeTruthy()
    })
})
