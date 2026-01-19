import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '@/app/views/index/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}))

describe('Pagination', () => {
    const mockPush = jest.fn()
    const mockSearchParams = new URLSearchParams()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
            ; (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
    })

    it('renders correct page numbers', () => {
        render(<Pagination currentPage={1} totalPages={10} />)
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('highlights current page', () => {
        render(<Pagination currentPage={1} totalPages={10} />)
        const activePage = screen.getByRole('link', { name: /^Page 1$/i })
        // Check for active styles based on received output: ring-2 ring-[var(--primary-red)]
        expect(activePage).toHaveClass('ring-2', 'ring-[var(--primary-red)]')
    })

    it('disables prev button on first page', () => {
        render(<Pagination currentPage={1} totalPages={10} />)
        const prevLink = screen.getByRole('link', { name: /Previous page/i })

        expect(prevLink).toHaveAttribute('aria-disabled', 'true')
        expect(prevLink).toHaveClass('pointer-events-none')
    })

    it('navigates correctly', () => {
        render(<Pagination currentPage={1} totalPages={10} />)
        const page2 = screen.getByRole('link', { name: /^Page 2$/i })
        expect(page2).toHaveAttribute('href', '/?page=2')
    })
})
