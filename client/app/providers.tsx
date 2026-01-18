'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

/**
 * Props for Providers component
 */
interface ProvidersProps {
  children: ReactNode
}

/**
 * Application providers wrapper
 *
 * Sets up TanStack Query for data fetching and caching.
 * Creates a new QueryClient instance per component tree to avoid
 * sharing state between different users (SSR consideration).
 *
 * @param props - Component props
 * @returns Wrapped children with providers
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
