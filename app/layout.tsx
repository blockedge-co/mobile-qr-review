import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Carbon Credits - Sustainable Impact',
  description: 'Offset your carbon footprint with verified carbon credits from forest restoration, mangrove protection, and renewable energy projects.',
  keywords: ['carbon credits', 'carbon offset', 'sustainability', 'climate action', 'environmental impact'],
  authors: [{ name: 'BlockEdge' }],
  creator: 'BlockEdge',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Carbon Credits - Sustainable Impact',
    description: 'Offset your carbon footprint with verified carbon credits',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carbon Credits - Sustainable Impact',
    description: 'Offset your carbon footprint with verified carbon credits',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
