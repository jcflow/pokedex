import { render, screen } from '@testing-library/react'
import Pagination from '@/components/Pagination'

describe('Pagination', () => {
  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(<Pagination currentPage={3} totalPages={5} />)

    const currentPageButton = screen.getByText('3').closest('a')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('renders previous button', () => {
    render(<Pagination currentPage={2} totalPages={5} />)

    expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument()
  })

  it('renders next button', () => {
    render(<Pagination currentPage={2} totalPages={5} />)

    expect(screen.getByLabelText(/next page/i)).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />)

    const prevButton = screen.getByLabelText(/previous page/i)
    expect(prevButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />)

    const nextButton = screen.getByLabelText(/next page/i)
    expect(nextButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('enables previous button when not on first page', () => {
    render(<Pagination currentPage={3} totalPages={5} />)

    const prevButton = screen.getByLabelText(/previous page/i)
    expect(prevButton).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('enables next button when not on last page', () => {
    render(<Pagination currentPage={3} totalPages={5} />)

    const nextButton = screen.getByLabelText(/next page/i)
    expect(nextButton).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('has proper ARIA navigation role', () => {
    render(<Pagination currentPage={1} totalPages={5} />)

    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  })

  it('limits displayed pages when totalPages is large', () => {
    render(<Pagination currentPage={10} totalPages={100} />)

    // Should not render all 100 pages (test middle pages)
    expect(screen.queryByText('50')).not.toBeInTheDocument()
    expect(screen.queryByText('99')).not.toBeInTheDocument()

    // Should render current page, nearby pages, first and last
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('shows ellipsis when pages are truncated', () => {
    render(<Pagination currentPage={10} totalPages={100} />)

    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThan(0)
  })
})
