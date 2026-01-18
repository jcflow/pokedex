import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import * as api from '@/lib/api'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock API
jest.mock('@/lib/api')

describe('Header', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  it('renders app title', () => {
    render(<Header />)
    expect(screen.getByText('Pokédex')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })

  it('logout button has proper ARIA label', () => {
    render(<Header />)
    const logoutButton = screen.getByRole('button', { name: /log out/i })
    expect(logoutButton).toHaveAttribute('aria-label')
  })

  it('calls logout API and redirects on logout button click', async () => {
    const user = userEvent.setup()
    ;(api.logout as jest.Mock).mockResolvedValue(undefined)

    render(<Header />)

    const logoutButton = screen.getByRole('button', { name: /log out/i })
    await user.click(logoutButton)

    await waitFor(() => {
      expect(api.logout).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('handles logout errors gracefully', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(api.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'))

    render(<Header />)

    const logoutButton = screen.getByRole('button', { name: /log out/i })
    await user.click(logoutButton)

    await waitFor(() => {
      expect(api.logout).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalled()
      // Should still redirect even if logout fails
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    consoleErrorSpy.mockRestore()
  })

  it('disables logout button during logout process', async () => {
    const user = userEvent.setup()
    let resolveLogout: (() => void) | undefined
    const logoutPromise = new Promise<void>((resolve) => {
      resolveLogout = resolve
    })

    ;(api.logout as jest.Mock).mockReturnValue(logoutPromise)

    render(<Header />)

    const logoutButton = screen.getByRole('button', { name: /log out/i })
    await user.click(logoutButton)

    // Button should be disabled while logging out
    expect(logoutButton).toBeDisabled()

    // Resolve the logout
    resolveLogout!()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
