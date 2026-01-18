import Link from 'next/link'

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
function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    // Show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // Always show first page, last page, current page, and 2 pages around current
  const pages: (number | string)[] = [1]

  if (current > 3) {
    pages.push('...')
  }

  // Pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
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
  const pages = getPageNumbers(currentPage, totalPages)
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav role="navigation" aria-label="Pagination navigation" className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={hasPrevious ? `${basePath}?page=${currentPage - 1}` : '#'}
        aria-label="Previous page"
        aria-disabled={!hasPrevious}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          hasPrevious
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
        }`}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
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
              href={`${basePath}?page=${pageNum}`}
              aria-label={`Page ${pageNum}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isCurrentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* Next Button */}
      <Link
        href={hasNext ? `${basePath}?page=${currentPage + 1}` : '#'}
        aria-label="Next page"
        aria-disabled={!hasNext}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          hasNext
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
        }`}
      >
        Next
      </Link>
    </nav>
  )
}
