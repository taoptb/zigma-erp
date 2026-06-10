import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'ZigmaERP',
  description: 'ระบบจัดการอู่กระจกรถยนต์',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${ibmPlexSansThai.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
