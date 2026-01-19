import type { Metadata } from 'next'
import './assets/css/globals.css'
import { Providers } from '@/store/providers'

export const metadata: Metadata = {
  title: 'Pokedex',
  description: 'A modern Pokedex application',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
