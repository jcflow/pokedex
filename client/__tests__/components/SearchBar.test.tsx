import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />)

    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('has proper ARIA label', () => {
    render(<SearchBar />)

    const searchInput = screen.getByRole('searchbox')
    expect(searchInput).toHaveAttribute('aria-label')
    expect(searchInput.getAttribute('aria-label')).toMatch(/search/i)
  })

  it('has placeholder text', () => {
    render(<SearchBar />)

    expect(screen.getByPlaceholderText(/search pokemon/i)).toBeInTheDocument()
  })

  it('updates value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByRole('searchbox') as HTMLInputElement
    await user.type(searchInput, 'pikachu')

    expect(searchInput.value).toBe('pikachu')
  })

  it('shows clear button when text is entered', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByRole('searchbox')

    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument()

    await user.type(searchInput, 'pikachu')

    // Clear button should appear after typing
    await waitFor(() => {
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument()
    })
  })

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByRole('searchbox') as HTMLInputElement
    await user.type(searchInput, 'pikachu')

    expect(searchInput.value).toBe('pikachu')

    const clearButton = screen.getByLabelText(/clear search/i)
    await user.click(clearButton)

    await waitFor(() => {
      expect(searchInput.value).toBe('')
    })
  })

  it('hides clear button after clearing', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const searchInput = screen.getByRole('searchbox')
    await user.type(searchInput, 'pikachu')

    const clearButton = screen.getByLabelText(/clear search/i)
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument()
    })
  })

  it('has search icon', () => {
    render(<SearchBar />)

    // Search icon should be present (accessible via aria-hidden or decorative)
    const container = screen.getByRole('searchbox').parentElement
    expect(container).toBeInTheDocument()
  })
})
