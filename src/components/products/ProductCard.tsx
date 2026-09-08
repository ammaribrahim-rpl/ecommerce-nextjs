'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Check } from 'lucide-react'
import { formatRupiah } from '@/lib/utils/format'
import { addToCart } from '@/services/cart.service'
import type { ProductItem } from '@/services/products.service'

interface ProductCardProps {
  product: ProductItem
}

export default function ProductCard({ product }: ProductCardProps) {
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
        setTimeout(() => setAdded(false), 1600)
      } else if (res.error) {
        alert(res.error)
      }
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5">
      {/* Product Image Link */}
      <Link href={`/products/${product.kodeitem}`} className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.namaitem}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Unit Badge (misal PCS / KRTN / DUS / RCG) */}
        {product.satuan && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-gray-900/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
            {product.satuan}
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category (Jenis Barang) */}
        {product.jenis_nama && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            {product.jenis_nama}
          </p>
        )}

        {/* Product Title */}
        <Link href={`/products/${product.kodeitem}`} className="mt-1 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors" title={product.namaitem}>
            {product.namaitem}
          </h3>
        </Link>

        {/* Item Code Subtitle */}
        <p className="mt-1 text-[11px] text-gray-400">
          Kode: {product.kodeitem}
        </p>

        {/* Price & Quick Add */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400">Harga</span>
            <p className="text-base font-bold text-emerald-700">
              {formatRupiah(product.hargajual1)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
            title="Tambah ke Keranjang"
          >
            {added ? <Check className="h-4 w-4 stroke-[3]" /> : <Plus className="h-4 w-4 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  )
}
