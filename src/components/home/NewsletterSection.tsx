'use client'

import React, { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

const BRANDS = [
  'MORINAGA', 'RELLIABLE', 'WYETH', 'LACTACYD', 'SENSI', 'LUSTY BUNNY', 'CHERIS', 'YUPI',
]

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Brand Logos Bar */}
        <div className="rounded-sm border border-[#E4E7E9] bg-white px-6 py-5">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#77878F] mb-4">
            Brand Terpercaya di Karisma Store
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {BRANDS.map((brand) => (
              <div
                key={brand}
                className="flex h-10 items-center rounded-sm border border-[#E4E7E9] bg-[#F2F4F5] px-4 text-xs font-black tracking-wide text-[#475156] hover:border-[#FA8232] hover:text-[#FA8232] hover:bg-white transition-all duration-200 cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div
          className="relative overflow-hidden rounded-sm flex flex-col sm:flex-row items-center gap-6 px-8 py-8"
          style={{ background: 'linear-gradient(135deg, #1B6392 0%, #124b70 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-white/5 pointer-events-none" />

          {/* Text */}
          <div className="relative flex-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FA8232] mb-1">Newsletter</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Dapatkan Penawaran Eksklusif
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Daftarkan email Anda dan nikmati promo spesial, tips belanja, serta info produk terbaru.
            </p>
          </div>

          {/* Form */}
          <div className="relative w-full sm:w-auto sm:min-w-[320px]">
            {submitted ? (
              <div className="flex items-center gap-3 rounded-sm bg-white/10 px-5 py-3 text-white">
                <CheckCircle className="h-5 w-5 text-[#2DB224] shrink-0" />
                <div>
                  <p className="text-sm font-bold">Terima kasih!</p>
                  <p className="text-xs text-white/70">Anda sudah terdaftar ke newsletter kami.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex overflow-hidden rounded-sm shadow-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda..."
                  required
                  className="flex-1 bg-white px-4 py-3 text-sm text-[#191C1F] placeholder-[#77878F] outline-none border-0"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#FA8232] hover:bg-[#de732d] text-white px-5 py-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Daftar Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
