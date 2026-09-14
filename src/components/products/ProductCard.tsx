'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Eye, Check, Star } from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'
import { addToCart } from '@/services/cart.service'
import type { ProductItem } from '@/services/products.service'

interface ProductCardProps {
  product: ProductItem
  showDiscount?: boolean
  discountPercent?: number
  isHot?: boolean
}

export default function ProductCard({ product, showDiscount, discountPercent, isHot }: ProductCardProps) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    try {
      const res = await addToCart(product, 1)
      if (res.requireLogin) {
        router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
        return
      }
      if (res.success) {
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
      } else if (res.error) {
        alert(res.error)
      }
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAdding(false)
    }
  }

  // Compute a fake "original" price for demo if discountPercent is provided
  const hasDiscount = showDiscount && discountPercent && discountPercent > 0
  const originalPrice = hasDiscount
    ? Math.round(product.hargajual1 / (1 - discountPercent! / 100))
    : null

  // Fixed star rating display (4–5 range based on product code hash)
  const ratingVal = ((product.kodeitem.charCodeAt(0) + product.kodeitem.charCodeAt(product.kodeitem.length - 1)) % 15) / 10 + 3.5
  const ratingFixed = Math.min(5, Number(ratingVal.toFixed(1)))
  const fullStars = Math.floor(ratingFixed)

  return (
    <div className="group relative flex flex-col bg-white border border-[#E4E7E9] rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:border-[#FA8232]/30">
      {/* ── Product Image Area ── */}
      <div className="relative block aspect-square overflow-hidden bg-[#F2F4F5]">
        <Link
          href={`/products/${product.kodeitem}`}
          className="block h-full w-full"
        >
          <img
            src={product.imageUrl}
            alt={product.namaitem}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none">
          {isHot && (
            <span className="inline-flex items-center justify-center bg-[#EE5858] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm">
              HOT
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center justify-center bg-[#FA8232] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Unit badge top-right */}
        {product.satuan && (
          <span className="absolute top-2.5 right-2.5 bg-[#191C1F]/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm pointer-events-none">
            {product.satuan}
          </span>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 pb-3 pt-4 bg-gradient-to-t from-black/20 to-transparent">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            title="Tambah ke Keranjang"
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow transition-all duration-200 cursor-pointer ${
              added
                ? 'bg-[#2DB224] text-white scale-110'
                : 'bg-white text-[#191C1F] hover:bg-[#FA8232] hover:text-white'
            }`}
          >
            {added ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <ShoppingCart className="h-3.5 w-3.5" />}
          </button>

          <Link
            href="/wishlist"
            title="Wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#191C1F] shadow hover:bg-[#FA8232] hover:text-white transition-all duration-200"
          >
            <Heart className="h-3.5 w-3.5" />
          </Link>

          <Link
            href={`/products/${product.kodeitem}`}
            title="Quick View"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#191C1F] shadow hover:bg-[#FA8232] hover:text-white transition-all duration-200"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex flex-1 flex-col p-4 gap-2">
        {/* Category label */}
        {product.jenis_nama && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#77878F]">
            {product.jenis_nama}
          </p>
        )}

        {/* Product Title */}
        <Link href={`/products/${product.kodeitem}`} className="flex-1">
          <h3
            className="line-clamp-2 text-sm font-medium text-[#191C1F] group-hover:text-[#FA8232] transition-colors leading-snug"
            title={product.namaitem}
          >
            {product.namaitem}
          </h3>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < fullStars
                    ? 'fill-[#FA8232] text-[#FA8232]'
                    : 'fill-[#E4E7E9] text-[#E4E7E9]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#77878F]">({ratingFixed})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[#F2F4F5]">
          <div>
            {originalPrice && (
              <p className="text-[11px] text-[#77878F] line-through">
                {formatRupiah(originalPrice)}
              </p>
            )}
            <p className="text-sm font-bold text-[#FA8232]">
              {formatRupiah(product.hargajual1)}
            </p>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-all duration-200 cursor-pointer ${
              added
                ? 'bg-[#2DB224] border-[#2DB224] text-white'
                : 'border-[#E4E7E9] text-[#191C1F] hover:bg-[#FA8232] hover:border-[#FA8232] hover:text-white'
            }`}
            title="Tambah ke Keranjang"
          >
            {added ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
