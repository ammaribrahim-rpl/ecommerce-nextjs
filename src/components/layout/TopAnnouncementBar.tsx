'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

export default function TopAnnouncementBar() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('clicon_announcement_dismissed')
    if (isDismissed === 'true') {
      setVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('clicon_announcement_dismissed', 'true')
  }

  if (!visible) return null

  return (
    <div className="relative w-full bg-[#191C1F] text-white px-4 py-3 sm:py-3.5 z-50 border-b border-[#303639]">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left / Center Promo content */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center sm:justify-start lg:justify-center">
          {/* Black Friday badge */}
          <span className="inline-flex items-center justify-center bg-[#F3DE6D] text-[#191C1F] font-black text-xs px-2.5 py-1 rounded-xs uppercase tracking-wider transform -rotate-2 select-none">
            Black Friday
          </span>

          <div className="flex items-center gap-1.5 font-medium text-gray-200">
            <span>Up to</span>
            <span className="text-xl sm:text-2xl font-black text-[#EBC80C] leading-none">
              59%
            </span>
            <span className="font-bold text-white uppercase">OFF</span>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 bg-[#EBC80C] hover:bg-[#d9b80b] text-[#191C1F] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xs transition-colors shadow-xs ml-1"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Right Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-xs bg-[#303639] hover:bg-[#475156] text-white transition-colors cursor-pointer"
          aria-label="Tutup pengumuman"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
