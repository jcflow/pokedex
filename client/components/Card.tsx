import Image from 'next/image'
import { ReactNode } from 'react'

/**
 * Card component props
 */
export interface CardProps {
  /** Card content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
  /** Whether the card is interactive (adds hover effects) */
  interactive?: boolean
  /** Top text */
  topText?: string
  /** Image source */
  imageSrc: string
  /** Image alt text */
  imageAlt: string,
  /** Image error handler */
  onImageError?: () => void
}

/**
 * Reusable Card component
 *
 * A container with rounded corners and shadow that serves as the base
 * for various card-style UI elements throughout the application.
 *
 * @param props - Component props
 * @returns Card container element
 */
export default function Card({
  children,
  className = '',
  onClick,
  interactive = false,
  topText,
  imageSrc,
  imageAlt,
  onImageError = () => { }
}: CardProps) {
  const baseClasses = 'rounded-2xl overflow-hidden relative aspect-square shadow-md'
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    : ''

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive && onClick
          ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick()
            }
          }
          : undefined
      }
    >
      {/* ===== BACKGROUND LAYER ===== */}
      {/* White top portion */}
      <div className="absolute inset-0 bg-white z-0" />
      {/* Gray bottom portion with rounded top */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gray-100 rounded-t-3xl z-[1]" />

      {/* ===== CONTENT LAYER ===== */}
      <div className="relative z-[2] h-full flex flex-col p-4">
        {/* Row 1: Pokemon number - no grow/shrink */}
        {topText && (
          <div className="flex-none text-right">
            <span className="text-gray-500 font-medium text-m">
              {topText}
            </span>
          </div>
        )}

        {/* Row 2: Pokemon image - can grow/shrink */}
        {imageSrc &&
          <div className="flex-1 flex items-center justify-center min-h-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={96}
              height={96}
              className="w-full h-full object-contain"
              unoptimized
              onError={onImageError}
            />
          </div>
        }

        {/* Row 3: Pokemon name - no grow/shrink */}
        {children &&
          <div className="flex-none">
            {children}
          </div>}
      </div>
    </div>
  )
}
