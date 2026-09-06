import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShieldCheck, Truck, RotateCcw, MapPin, Tag } from 'lucide-react'
import { getProductByCode } from '@/services/products.service'
import { formatRupiah } from '@/lib/utils/format'
import ProductDetailActions from '@/components/products/ProductDetailActions'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params
  const { product } = await getProductByCode(decodeURIComponent(id))

  if (!product) {
    return { title: 'Produk Tidak Ditemukan - Karisma Store' }
  }

  return {
    title: `${product.namaitem} - Karisma Store`,
    description: `Beli ${product.namaitem} di Karisma Store dengan harga ${formatRupiah(product.hargajual1)}. Produk 100% original.`,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const { product, stockLocations } = await getProductByCode(decodedId)

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-600">Beranda</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-600">Produk</Link>
        <span>/</span>
        {product.jenis_nama && (
          <>
            <Link href={`/products?jenis=${product.jenis}`} className="hover:text-emerald-600">
              {product.jenis_nama}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-medium truncate max-w-xs sm:max-w-md">{product.namaitem}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs">
        {/* Left: Product Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
            <img
              src={product.imageUrl}
              alt={product.namaitem}
              className="h-full w-full object-cover object-center"
            />
            {product.merek_nama && (
              <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                {product.merek_nama}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {product.jenis_nama && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <Tag className="h-3 w-3" />
                  {product.jenis_nama}
                </span>
              )}
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono text-gray-600">
                Kode: {product.kodeitem}
              </span>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Satuan: {product.satuan || 'PCS'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 leading-tight">
              {product.namaitem}
            </h1>

            {/* Price */}
            <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100/60">
              <span className="text-xs font-medium text-emerald-800">Harga Satuan</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-0.5">
                {formatRupiah(product.hargajual1)}
              </p>
            </div>

            {/* Stock per Warehouse */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Ketersediaan Stok di Cabang:</span>
              </div>
              {stockLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stockLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700"
                    >
                      <span className="font-semibold text-gray-900">
                        {loc.kantor === 'UTM' ? 'Gudang Utama' : loc.kantor === 'GD' ? 'Gudang Cabang' : loc.kantor}:
                      </span>
                      <span className="font-bold text-emerald-700">
                        {loc.stok || 0} {product.satuan || 'PCS'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">
                  ✓ Siap dipesan langsung melalui toko online
                </p>
              )}
            </div>

            {/* Description */}
            {product.keterangan && (
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.keterangan}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Actions (Quantity & Cart) */}
          <ProductDetailActions product={product} />

          {/* Feature Assurances */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Produk Original</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-emerald-600" />
              <span>Pengiriman Cepat</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-4 w-4 text-emerald-600" />
              <span>Jaminan Kualitas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
