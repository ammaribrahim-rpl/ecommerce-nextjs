import React from 'react'
import ProductCard from './ProductCard'
import type { ProductItem } from '@/services/products.service'

interface ProductGridProps {
  products: ProductItem[]
  emptyMessage?: string
}

export default function ProductGrid({
  products,
  emptyMessage = 'Belum ada produk yang ditemukan untuk kriteria ini.',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 px-4 text-center">
        <div className="rounded-full bg-gray-100 p-4 text-gray-400">
          🔍
        </div>
        <h3 className="mt-3 text-base font-semibold text-gray-800">Tidak ada produk</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.kodeitem} product={product} />
      ))}
    </div>
  )
}
