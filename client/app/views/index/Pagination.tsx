'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import navLeft from '@/icons/nav-left.svg'
import navRight from '@/icons/nav-right.svg'

/**
 * Props for Pagination component
 */
interface PaginationProps {
  /**
   * Current active page (1-indexed)
   */
  currentPage: number

  /**
   * Total number of pages
   */
  totalPages: number

  /**
   * Base path for pagination links (default: '/')
   */
  basePath?: string
}

/**
 * Generate array of page numbers to display with ellipsis for large ranges
 *
 * @param current - Current page number
 * @param total - Total number of pages
 * @returns Array of page numbers and ellipsis markers
 */
function getPageNumbers(current: number, total: number): (number | string | null)[] {
  if (total <= 7) {
    // Show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // Always show first page, last page, current page, and 2 pages around current
  const pages: (number | string | null)[] = [1]

  if (current > 3) {
    pages.push(null)
  }

  // Pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push(null)
  }

  pages.push(total)

  return pages
}

/**
 * Pagination component
 *
 * Renders numbered pagination with Previous/Next buttons.
 * Supports large page ranges with ellipsis.
 *
 * @param props - Component props
 * @returns Pagination navigation
 *
 * @example
 * ```tsx
 * <Pagination currentPage={3} totalPages={10} />
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
}: PaginationProps) {
  const searchParams = useSearchParams()
  const pages = getPageNumbers(currentPage, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  // Helper to create URL with existing params
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${basePath}?${params.toString()}`
  }

  return (
    <nav role="navigation" aria-label="Pagination navigation" className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={hasPrevious ? createPageUrl(currentPage - 1) : '#'}
        aria-label="Previous page"
        aria-disabled={!hasPrevious}
        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${hasPrevious
          ? 'bg-white hover:bg-gray-50'
          : 'bg-white/50 cursor-not-allowed pointer-events-none opacity-50'
          }`}
      >
        <Image
          src={navLeft}
          alt="Previous"
          width={24}
          height={24}
          className="w-6 h-6 primary-text"
        />
      </Link>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pages.map((page, index) => {
          if (!page) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isCurrentPage = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${isCurrentPage
                ? 'bg-white primary-text ring-2 ring-[var(--primary-red)] text-lg'
                : 'bg-white text-gray-600 hover:text-[var(--primary-red)]'
                }`}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      <Link
        href={hasNext ? createPageUrl(currentPage + 1) : '#'}
        aria-label="Next page"
        aria-disabled={!hasNext}
        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${hasNext
          ? 'bg-white hover:bg-gray-50'
          : 'bg-white/50 cursor-not-allowed pointer-events-none opacity-50'
          }`}
      >
        <Image
          src={navRight}
          alt="Next"
          width={24}
          height={24}
          className="w-6 h-6 primary-text"
        />
      </Link>
    </nav>
  )
}
