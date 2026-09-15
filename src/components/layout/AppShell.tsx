'use client'

import React, { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import TopAnnouncementBar from '@/components/layout/TopAnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomerChatWidget from '@/components/chat/CustomerChatWidget'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  // If on admin panel, do not show storefront header/footer/chat
  if (isAdmin) {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    )
  }

  // Storefront layout
  return (
    <LanguageProvider>
      <TopAnnouncementBar />
      <Suspense fallback={<div className="h-20 w-full bg-[#1B6392]" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <CustomerChatWidget />
    </LanguageProvider>
  )
}
