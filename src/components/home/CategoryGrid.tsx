import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { code: 'MNM',    name: 'Susu & Minuman',      emoji: '🥛', bg: '#EEF7FF', accent: '#2DA5F3' },
  { code: 'POPOK',  name: 'Popok & Bayi',         emoji: '🍼', bg: '#FFF5EE', accent: '#FA8232' },
  { code: 'PLKPN',  name: 'Perlengkapan Anak',    emoji: '🧸', bg: '#FFF0F5', accent: '#EE5858' },
  { code: 'MKN',    name: 'Makanan & Biskuit',    emoji: '🍪', bg: '#FFFBEB', accent: '#EBC80C' },
  { code: 'HEALTH', name: 'Kesehatan & Obat',     emoji: '💊', bg: '#F0FFF4', accent: '#2DB224' },
  { code: 'SCINCARE', name: 'Perawatan Kulit',    emoji: '✨', bg: '#F5F0FF', accent: '#9B59B6' },
  { code: 'FOOD',   name: 'Kebutuhan Dapur',      emoji: '🏠', bg: '#FFF5EE', accent: '#FA8232' },
  { code: 'DRINK',  name: 'Minuman Kemasan',      emoji: '🧃', bg: '#EEF7FF', accent: '#2DA5F3' },
]

export default function CategoryGrid() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#191C1F]">Shop with Categories</h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#FA8232] hover:text-[#de732d] transition-colors"
          >
            View All <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.code}
              href={`/products?jenis=${cat.code}`}
              className="group flex flex-col items-center gap-2.5 rounded-sm py-4 px-2 border border-[#E4E7E9] bg-white hover:border-transparent hover:shadow-md transition-all duration-200"
              style={{ '--accent': cat.accent } as React.CSSProperties}
            >
              {/* Icon circle */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: cat.bg }}
              >
                {cat.emoji}
              </div>

              {/* Name */}
              <span
                className="text-center text-xs font-semibold text-[#191C1F] group-hover:text-[#FA8232] transition-colors leading-tight"
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
