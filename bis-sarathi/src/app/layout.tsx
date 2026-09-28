import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppContextProvider } from '@/context/AppContext'
import { DemoBanner } from '@/components/layout/DemoBanner'
import { NavBar } from '@/components/layout/NavBar'
import { Footer } from '@/components/layout/Footer'

// Inter font — used for clean, professional appearance across the UI
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BIS Sarathi',
  description:
    'AI-assisted BIS standards navigation — SIH 2026 concept demonstrator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col bg-white antialiased ${inter.className}`}
      >
        <AppContextProvider>
          <DemoBanner />
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  )
}
