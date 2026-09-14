'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { ProductItem } from '@/services/products.service'

interface FeaturedProductsTabsProps {
  products: ProductItem[]
}

const TABS = [
  { label: 'Semua Produk', jenis: null },
  { label: 'Susu & Minuman', jenis: 'MNM' },
  { label: 'Popok Bayi', jenis: 'POPOK' },
  { label: 'Makanan', jenis: 'MKN' },
  { label: 'Perlengkapan', jenis: 'PLKPN' },
]

export default function FeaturedProductsTabs({ products }: FeaturedProductsTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const filtered = activeTab === 0
    ? products
    : products.filter((p) => p.jenis === TABS[activeTab].jenis)

  const displayed = (filtered.length > 0 ? filtered : products).slice(0, 8)

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header with Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1 flex-wrap">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-sm border transition-all duration-200 cursor-pointer ${
                  i === activeTab
                    ? 'bg-[#FA8232] border-[#FA8232] text-white shadow-sm'
                    : 'bg-white border-[#E4E7E9] text-[#5F6C72] hover:border-[#FA8232] hover:text-[#FA8232]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            href={activeTab > 0 ? `/products?jenis=${TABS[activeTab].jenis}` : '/products'}
            className="flex items-center gap-1 text-sm font-semibold text-[#FA8232] hover:text-[#de732d] transition-colors"
          >
            View All <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Product Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4 animate-fade-in">
            {displayed.map((product, i) => (
              <ProductCard
                key={product.kodeitem}
                product={product}
                showDiscount={i % 3 === 0}
                discountPercent={i % 3 === 0 ? 15 + (i * 5) % 25 : undefined}
                isHot={i === 0 || i === 4}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-[#77878F]">Tidak ada produk dalam kategori ini.</p>
            <Link href="/products" className="mt-3 text-sm font-semibold text-[#FA8232] hover:underline">
              Lihat Semua Produk
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
