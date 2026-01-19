import { render, screen, fireEvent } from '@testing-library/react'
import BackButton from '@/app/views/detail/BackButton'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/useUIStore'

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

describe('BackButton', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
        useUIStore.setState({ searchTerm: '', sortBy: 'number', currentPage: 1 }, true)
    })

    it('renders back button', () => {
        render(<BackButton />)
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('navigates home with default state', () => {
        render(<BackButton />)
        fireEvent.click(screen.getByRole('button'))
        expect(mockPush).toHaveBeenCalledWith('/?')
    })

    it('preserves search state in URL', () => {
        useUIStore.setState({ searchTerm: 'char', sortBy: 'number', currentPage: 1 })
        render(<BackButton />)
        fireEvent.click(screen.getByRole('button'))
        expect(mockPush).toHaveBeenCalledWith('/?search=char')
    })

    it('preserves page state in URL', () => {
        useUIStore.setState({ searchTerm: '', sortBy: 'number', currentPage: 5 })
        render(<BackButton />)
        fireEvent.click(screen.getByRole('button'))
        expect(mockPush).toHaveBeenCalledWith('/?page=5')
    })
})
