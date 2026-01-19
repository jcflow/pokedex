'use client'

import { useCallback, memo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import navLeft from '@/icons/nav-left.svg'
import navRight from '@/icons/nav-right.svg'
import { PAGINATION_CONFIG } from '@/lib/constants'

/**
 * Represents a pagination item - either a page number or an ellipsis
 */
type PaginationItem =
  | { type: 'page'; value: number }
  | { type: 'ellipsis'; key: string }

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
 * Generate array of pagination items with ellipsis for large ranges.
 *
 * Algorithm:
 * - Shows first page, last page, current page, and SIBLING_PAGES around current
 * - Uses ellipsis when there are gaps larger than 1 page
 *
 * @param current - Current page number (1-indexed)
 * @param total - Total number of pages
 * @returns Array of pagination items (page numbers or ellipsis markers)
 *
 * @example
 * getPageItems(5, 10) // [1, '...', 4, 5, 6, '...', 10]
 * getPageItems(1, 5)  // [1, 2, 3, 4, 5]
 */
function getPageItems(current: number, total: number): PaginationItem[] {
  if (total <= PAGINATION_CONFIG.MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => ({
      type: 'page' as const,
      value: i + 1,
    }))
  }

  const items: PaginationItem[] = [{ type: 'page', value: 1 }]

  if (current > PAGINATION_CONFIG.LEFT_ELLIPSIS_THRESHOLD) {
    items.push({ type: 'ellipsis', key: 'left' })
  }

  const start = Math.max(2, current - PAGINATION_CONFIG.SIBLING_PAGES)
  const end = Math.min(total - 1, current + PAGINATION_CONFIG.SIBLING_PAGES)

  for (let i = start; i <= end; i++) {
    items.push({ type: 'page', value: i })
  }

  if (current < total - PAGINATION_CONFIG.RIGHT_ELLIPSIS_THRESHOLD) {
    items.push({ type: 'ellipsis', key: 'right' })
  }

  items.push({ type: 'page', value: total })

  return items
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
function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
}: PaginationProps) {
  const searchParams = useSearchParams()
  const items = getPageItems(currentPage, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  /**
   * Creates a URL for a specific page, preserving existing query params
   */
  const createPageUrl = useCallback(
    (page: number): string => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page.toString())
      return `${basePath}?${params.toString()}`
    },
    [searchParams, basePath]
  )

  return (
    <nav
      role="navigation"
      aria-label="Pagination navigation"
      className="flex justify-center items-center gap-2 mt-8"
    >
      {/* Previous Button */}
      <Link
        href={hasPrevious ? createPageUrl(currentPage - 1) : '#'}
        aria-label="Previous page"
        aria-disabled={!hasPrevious}
        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${
          hasPrevious
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
        {items.map((item) => {
          if (item.type === 'ellipsis') {
            return (
              <span
                key={item.key}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
                role="presentation"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isCurrentPage = item.value === currentPage

          return (
            <Link
              key={item.value}
              href={createPageUrl(item.value)}
              aria-label={`Page ${item.value}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${
                isCurrentPage
                  ? 'bg-white primary-text ring-2 ring-[var(--primary-red)] text-lg'
                  : 'bg-white text-gray-600 hover:text-[var(--primary-red)]'
              }`}
            >
              {item.value}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      <Link
        href={hasNext ? createPageUrl(currentPage + 1) : '#'}
        aria-label="Next page"
        aria-disabled={!hasNext}
        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner transition-colors ${
          hasNext
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

export default memo(Pagination)
