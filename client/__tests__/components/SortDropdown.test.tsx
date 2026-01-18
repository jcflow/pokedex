import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortDropdown from '@/components/SortDropdown'

describe('SortDropdown', () => {
  it('renders sort label', () => {
    render(<SortDropdown />)

    expect(screen.getByText(/sort by/i)).toBeInTheDocument()
  })

  it('renders name option', () => {
    render(<SortDropdown />)

    expect(screen.getByText(/name/i)).toBeInTheDocument()
  })

  it('renders number option', () => {
    render(<SortDropdown />)

    expect(screen.getByText(/number/i)).toBeInTheDocument()
  })

  it('highlights active sort option', () => {
    render(<SortDropdown />)

    // Default should be name or number
    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find(
      (btn) => btn.getAttribute('aria-pressed') === 'true'
    )
    expect(activeButton).toBeInTheDocument()
  })

  it('changes active option when clicked', async () => {
    const user = userEvent.setup()
    render(<SortDropdown />)

    const nameButton = screen.getByRole('button', { name: /name/i })
    const numberButton = screen.getByRole('button', { name: /number/i })

    // Click on number
    await user.click(numberButton)

    expect(numberButton).toHaveAttribute('aria-pressed', 'true')
    expect(nameButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('has proper ARIA attributes', () => {
    render(<SortDropdown />)

    const nameButton = screen.getByRole('button', { name: /name/i })
    const numberButton = screen.getByRole('button', { name: /number/i })

    expect(nameButton).toHaveAttribute('aria-pressed')
    expect(numberButton).toHaveAttribute('aria-pressed')
  })

  it('renders as a group', () => {
    render(<SortDropdown />)

    expect(screen.getByRole('group', { name: /sort options/i })).toBeInTheDocument()
  })
})
