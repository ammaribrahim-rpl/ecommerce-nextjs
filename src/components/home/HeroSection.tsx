'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    badge: 'Promo Spesial',
    title: 'Kebutuhan\nKeluarga\nLengkap',
    subtitle: 'Temukan ribuan produk pilihan — susu, popok, makanan bayi, dan perlengkapan harian dengan harga terbaik.',
    ctaText: 'Mulai Belanja',
    ctaLink: '/products',
    accentColor: '#FA8232',
    bgFrom: '#EEF7FF',
    bgTo: '#DAEEFF',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80',
    tagline: 'Gratis Ongkir • Hari Ini',
  },
  {
    id: 2,
    badge: 'Best Seller',
    title: 'Susu & Nutrisi\nTerbaik\nUntuk Buah Hati',
    subtitle: 'Morinaga, Wyeth, Frisian Flag dan pilihan susu formula berkualitas tersedia di Karisma Store.',
    ctaText: 'Lihat Produk',
    ctaLink: '/products?jenis=MNM',
    accentColor: '#2DA5F3',
    bgFrom: '#FFF5EE',
    bgTo: '#FFE9D6',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&auto=format&fit=crop&q=80',
    tagline: 'Harga Grosir • Kualitas Premium',
  },
  {
    id: 3,
    badge: 'Flash Sale',
    title: 'Diskon Besar\nPopok &\nPerlengkapan Bayi',
    subtitle: 'Hemat lebih banyak untuk popok, botol MPASI, stroller, dan semua perlengkapan si kecil.',
    ctaText: 'Ambil Diskon',
    ctaLink: '/products?jenis=POPOK',
    accentColor: '#2DB224',
    bgFrom: '#F0FFF4',
    bgTo: '#DCF7E3',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
    tagline: 'Stok Terbatas • Buruan Order',
  },
]

const PROMO_CARDS = [
  {
    id: 1,
    label: 'Promo Eksklusif',
    title: 'Susu Morinaga Chil*Go Vanilla 800g',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=350&auto=format&fit=crop&q=80',
    href: '/products?jenis=MNM',
    bg: '#EEF7FF',
  },
  {
    id: 2,
    label: 'Pilihan Terbaik',
    title: 'Popok Sensi Pants M isi 20 pcs',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350&auto=format&fit=crop&q=80',
    href: '/products?jenis=POPOK',
    bg: '#FFF5EE',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(idx)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo])

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const slide = SLIDES[current]

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
          {/* ── Main Hero Slider ── */}
          <div
            className="relative rounded-sm overflow-hidden min-h-[340px] sm:min-h-[400px] flex items-center transition-all duration-500"
            style={{ background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)` }}
          >
            {/* Slide content */}
            <div className={`relative z-10 flex flex-col sm:flex-row items-center w-full gap-6 px-8 py-8 sm:py-10 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {/* Text */}
              <div className="flex-1 space-y-4 text-left">
                {/* Badge */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm"
                  style={{ background: `${slide.accentColor}20`, color: slide.accentColor }}
                >
                  {slide.badge}
                </span>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191C1F] leading-tight whitespace-pre-line">
                  {slide.title}
                </h1>

                <p className="text-sm text-[#5F6C72] leading-relaxed max-w-xs">
                  {slide.subtitle}
                </p>

                {/* Tagline */}
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: slide.accentColor }}>
                  {slide.tagline}
                </p>

                {/* CTA */}
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md"
                  style={{ background: slide.accentColor }}
                >
                  {slide.ctaText}
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>

              {/* Hero Image */}
              <div className="flex-shrink-0 w-48 sm:w-64 h-48 sm:h-64 flex items-center justify-center">
                <img
                  src={slide.imageUrl}
                  alt={slide.badge}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#191C1F] shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 hover:bg-white text-[#191C1F] shadow-md transition-all hover:scale-105 cursor-pointer"
              aria-label="Next slide"
            >
              <ArrowRightIcon className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? 'w-5 h-2 bg-[#FA8232]' : 'w-2 h-2 bg-[#191C1F]/20 hover:bg-[#FA8232]/50'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right Promo Cards ── */}
          <div className="hidden lg:flex flex-col gap-3">
            {PROMO_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="group relative flex-1 flex flex-col justify-between rounded-sm overflow-hidden min-h-[140px] p-4 transition-all duration-300 hover:shadow-md"
                style={{ background: card.bg }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FA8232] mb-1">
                    {card.label}
                  </p>
                  <h3 className="text-sm font-semibold text-[#191C1F] leading-snug max-w-[140px]">
                    {card.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 mt-2 text-[#FA8232] text-xs font-bold group-hover:gap-2 transition-all">
                  <span>Shop Now</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>

                {/* Card image */}
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="absolute right-0 bottom-0 h-24 w-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
