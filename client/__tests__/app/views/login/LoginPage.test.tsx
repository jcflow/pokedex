import { render, screen } from '@testing-library/react'
import LoginPage from '@/app/views/login/index'

// Mock dependencies
jest.mock('@/app/views/login/LoginForm', () => () => <div data-testid="login-form">Login Form</div>)

describe('LoginPage', () => {
    it('renders layout and login form correctly', async () => {
        const jsx = await LoginPage()
        render(jsx)

        expect(screen.getByRole('heading', { name: 'Pokédex' })).toBeInTheDocument()
        expect(screen.getByTestId('login-form')).toBeInTheDocument()
    })
})
