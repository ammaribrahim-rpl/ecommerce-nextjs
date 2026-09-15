import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Toko Online'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Belanja produk berkualitas dengan harga terbaik.',
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    locale: 'id_ID',
  },
  robots: {
    index: true,
    follow: true,
  },
}

import AppShell from '@/components/layout/AppShell'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#191C1F]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

