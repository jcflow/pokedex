import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/app/login/LoginForm'
import * as api from '@/lib/api'

// Mock API
jest.mock('@/lib/api')

describe('LoginForm', () => {
  // Mock window.location
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock window.location.href
    delete (window as { location?: Location }).location
    window.location = { ...originalLocation, href: '' } as Location
  })

  afterEach(() => {
    window.location = originalLocation
  })

  it('renders username and password inputs', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /log in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('calls API and redirects on successful login', async () => {
    const user = userEvent.setup()
    const mockLoginResponse = {
      user: {
        id: 1,
        username: 'testuser',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      token: 'mock-token-123',
    }

    ;(api.login as jest.Mock).mockResolvedValue(mockLoginResponse)

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('testuser', 'password123')
      expect(window.location.href).toBe('/')
    })
  })

  it('shows error message on failed login (401)', async () => {
    const user = userEvent.setup()
    const mockError = new Error('Invalid username or password') as Error & { status: number }
    mockError.status = 401

    ;(api.login as jest.Mock).mockRejectedValue(mockError)

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(usernameInput, 'wronguser')
    await user.type(passwordInput, 'wrongpass')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument()
    })
  })

  it('shows connection error on network failure', async () => {
    const user = userEvent.setup()
    const mockError = new Error('Network error')

    ;(api.login as jest.Mock).mockRejectedValue(mockError)

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/connection error/i)).toBeInTheDocument()
    })
  })

  it('disables button during submission', async () => {
    const user = userEvent.setup()
    let resolveLogin: ((value: unknown) => void) | undefined
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve
    })

    ;(api.login as jest.Mock).mockReturnValue(loginPromise)

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /log in/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Button should be disabled while loading
    expect(submitButton).toBeDisabled()

    // Resolve the promise
    resolveLogin({
      user: {
        id: 1,
        username: 'testuser',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      token: 'mock-token-123',
    })

    await waitFor(() => {
      expect(window.location.href).toBe('/')
    })
  })

  it('has proper ARIA labels for accessibility', () => {
    render(<LoginForm />)

    const form = screen.getByRole('form', { name: /login/i })
    expect(form).toBeInTheDocument()

    const usernameInput = screen.getByLabelText(/username/i)
    expect(usernameInput).toHaveAttribute('aria-label')

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('aria-label')

    const submitButton = screen.getByRole('button', { name: /log in/i })
    expect(submitButton).toHaveAttribute('aria-label')
  })
})
