import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import LoginForm from '@/app/views/login/LoginForm'
import { login, ApiError } from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api', () => {
    const actual = jest.requireActual('@/lib/api')
    return {
        ...actual,
        login: jest.fn(),
    }
})

describe('LoginForm', () => {
    // Mock window.location
    const originalLocation = window.location

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        })
    })

    afterAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        })
    })

    it('should have no accessibility violations', async () => {
        const { container } = render(<LoginForm />)
        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('renders login form correctly', () => {
        render(<LoginForm />)

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
        render(<LoginForm />)

        const submitButton = screen.getByRole('button', { name: /log in/i })
        fireEvent.click(submitButton)

        expect(await screen.findByText('Username is required')).toBeInTheDocument()
        expect(await screen.findByText('Password is required')).toBeInTheDocument()
        expect(login).not.toHaveBeenCalled()
    })

    it('handles successful login', async () => {
        (login as jest.Mock).mockResolvedValue({ success: true })

        render(<LoginForm />)

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ash' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pikachu' } })

        fireEvent.click(screen.getByRole('button', { name: /log in/i }))

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith('ash', 'pikachu')
        })

        await waitFor(() => {
            expect(window.location.href).toBe('/')
        })
    })

    it('handles invalid credentials (401)', async () => {
        const error = new ApiError('Unauthorized', 401)
            ; (login as jest.Mock).mockRejectedValue(error)

        render(<LoginForm />)

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ash' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } })

        fireEvent.click(screen.getByRole('button', { name: /log in/i }))

        expect(await screen.findByText('Invalid username or password')).toBeInTheDocument()
    })

    it('handles client-side network errors', async () => {
        const error = new Error('Network Error')
            ; (login as jest.Mock).mockRejectedValue(error)

        render(<LoginForm />)

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ash' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pikachu' } })

        fireEvent.click(screen.getByRole('button', { name: /log in/i }))

        expect(await screen.findByText('Connection error. Please try again.')).toBeInTheDocument()
    })

    it('displays loading state during submission', async () => {
        // Create a promise that doesn't resolve immediately
        let resolveLogin: (value: unknown) => void
        const loginPromise = new Promise(resolve => {
            resolveLogin = resolve
        })
            ; (login as jest.Mock).mockReturnValue(loginPromise)

        render(<LoginForm />)

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ash' } })
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pikachu' } })

        const submitButton = screen.getByRole('button', { name: /log in/i })
        fireEvent.click(submitButton)

        expect(submitButton).toBeDisabled()
        expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/username/i)).toBeDisabled()

        // Resolve to clean up
        resolveLogin!({})
        await waitFor(() => expect(submitButton).not.toBeDisabled())
    })
})
