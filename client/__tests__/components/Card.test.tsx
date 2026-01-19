import { render, screen, fireEvent } from '@testing-library/react'
import Card from '@/components/Card'
import pokePlaceholder from '@/icons/poke-placeholder.svg'

// Mock styles since we use Next.js/Tailwind
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { unoptimized, ...rest } = props
        return <img {...rest} />
    },
}))

describe('Card', () => {
    const defaultProps = {
        imageSrc: '/test-image.png',
        imageAlt: 'Test Image',
        topText: '#001'
    }

    it('renders generic content', () => {
        render(<Card {...defaultProps}>Test Content</Card>)
        expect(screen.getByText('Test Content')).toBeInTheDocument()
        expect(screen.getByText('#001')).toBeInTheDocument()
        expect(screen.getByAltText('Test Image')).toBeInTheDocument()
    })

    it('handles interaction correctly', () => {
        const handleClick = jest.fn()
        render(<Card {...defaultProps} interactive onClick={handleClick}>Click Me</Card>)

        const card = screen.getByRole('button')
        fireEvent.click(card)
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('displays error image on error', () => {
        const handleImageError = jest.fn()
        render(<Card {...defaultProps} onImageError={handleImageError}>Content</Card>)

        const img = screen.getByAltText('Test Image')
        fireEvent.error(img)

        expect(handleImageError).toHaveBeenCalled()
    })
})
