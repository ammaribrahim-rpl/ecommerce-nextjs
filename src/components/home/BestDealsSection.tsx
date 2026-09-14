'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, ShoppingCart } from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'
import { addToCart } from '@/services/cart.service'
import type { ProductItem } from '@/services/products.service'

interface BestDealsSectionProps {
  products: ProductItem[]
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const diff = Math.max(0, targetDate.getTime() - now)

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#191C1F] text-white text-base font-black tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[#77878F]">{label}</span>
    </div>
  )
}

function Separator() {
  return <span className="text-[#191C1F] font-black text-lg leading-none pb-4">:</span>
}

export default function BestDealsSection({ products }: BestDealsSectionProps) {
  // Target: 16 days from now
  const [target] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 16)
    return d
  })
  const { days, hours, minutes, seconds } = useCountdown(target)

  const featured = products[0]
  const gridProducts = products.slice(1, 9)

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h2 className="text-xl font-bold text-[#191C1F]">Best Deals</h2>

            {/* Countdown */}
            <div className="flex items-end gap-1.5">
              <CountdownBox value={days} label="Hari" />
              <Separator />
              <CountdownBox value={hours} label="Jam" />
              <Separator />
              <CountdownBox value={minutes} label="Menit" />
              <Separator />
              <CountdownBox value={seconds} label="Detik" />
            </div>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-semibold text-[#FA8232] hover:text-[#de732d] transition-colors"
          >
            Browse All Products <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* Featured Product (large card left) */}
          {featured && (
            <FeaturedDealCard product={featured} />
          )}

          {/* 8-product grid right */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {gridProducts.map((product, i) => (
              <DealCard key={product.kodeitem} product={product} discount={10 + (i * 3) % 30} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function getStableNum(str: string, mod: number, min: number) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff
  return min + Math.abs(hash % mod)
}

function FeaturedDealCard({ product }: { product: ProductItem }) {
  const [added, setAdded] = useState(false)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    const res = await addToCart(product, 1)
    if (res.success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const discount = 25
  const original = Math.round(product.hargajual1 / (1 - discount / 100))
  const soldCount = getStableNum(product.kodeitem, 200, 50)
  const stockWidth = Math.min(80, getStableNum(product.kodeitem + 'w', 50, 30))

  return (
    <div className="flex flex-col bg-white border border-[#E4E7E9] rounded-sm overflow-hidden p-4 gap-3">
      {/* Image */}
      <Link href={`/products/${product.kodeitem}`} className="relative block aspect-square rounded-sm overflow-hidden bg-[#F2F4F5]">
        <img
          src={product.imageUrl}
          alt={product.namaitem}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-[#EE5858] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
          -{discount}%
        </span>
      </Link>

      {/* Info */}
      <div className="space-y-2">
        {product.jenis_nama && (
          <p className="text-[10px] uppercase font-bold tracking-wider text-[#77878F]">{product.jenis_nama}</p>
        )}
        <Link href={`/products/${product.kodeitem}`}>
          <h3 className="text-sm font-semibold text-[#191C1F] hover:text-[#FA8232] transition-colors line-clamp-2 leading-snug">
            {product.namaitem}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-3 w-3 fill-[#FA8232] text-[#FA8232]" />
          ))}
          <Star className="h-3 w-3 fill-[#E4E7E9] text-[#E4E7E9]" />
          <span className="text-[11px] text-[#77878F] ml-1">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-black text-[#FA8232]">{formatRupiah(product.hargajual1)}</span>
          <span className="text-xs text-[#77878F] line-through">{formatRupiah(original)}</span>
        </div>

        {/* Stock bar */}
        <div>
          <div className="flex justify-between text-[10px] text-[#77878F] mb-1">
            <span>Available: {product.stok}</span>
            <span>Sold: {soldCount}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#F2F4F5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#FA8232] transition-all"
              style={{ width: `${stockWidth}%` }}
            />
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-bold transition-all duration-200 cursor-pointer ${
            added
              ? 'bg-[#2DB224] text-white'
              : 'bg-[#FA8232] hover:bg-[#de732d] text-white'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  )
}

function DealCard({ product, discount }: { product: ProductItem; discount: number }) {
  const original = Math.round(product.hargajual1 / (1 - discount / 100))

  return (
    <Link
      href={`/products/${product.kodeitem}`}
      className="group flex flex-col bg-white border border-[#E4E7E9] rounded-sm overflow-hidden hover:border-[#FA8232]/40 hover:shadow-sm transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F2F4F5]">
        <img
          src={product.imageUrl}
          alt={product.namaitem}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-[#FA8232] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
          -{discount}%
        </span>
      </div>
      <div className="p-3 space-y-1">
        <h4 className="text-xs font-medium text-[#191C1F] line-clamp-2 group-hover:text-[#FA8232] transition-colors leading-snug">
          {product.namaitem}
        </h4>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-sm font-bold text-[#FA8232]">{formatRupiah(product.hargajual1)}</span>
          <span className="text-[11px] text-[#77878F] line-through">{formatRupiah(original)}</span>
        </div>
      </div>
    </Link>
  )
}
