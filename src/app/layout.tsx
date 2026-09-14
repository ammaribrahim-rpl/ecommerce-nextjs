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

import { Suspense } from 'react'
import TopAnnouncementBar from '@/components/layout/TopAnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomerChatWidget from '@/components/chat/CustomerChatWidget'

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
        <TopAnnouncementBar />
        <Suspense fallback={<div className="h-20 w-full bg-[#1B6392]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <CustomerChatWidget />
      </body>
    </html>
  )
}
