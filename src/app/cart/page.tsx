'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import { getCartDetails, updateCartQuantity, removeFromCart, type CartLineItem } from '@/services/cart.service'
import { formatRupiah } from '@/lib/utils/format'

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartLineItem[]>([])
  const [loading, setLoading] = useState(true)

  const refreshItems = React.useCallback(async () => {
    const cartItems = await getCartDetails()
    setItems(cartItems)
  }, [])

  useEffect(() => {
    let isMounted = true
    getCartDetails().then((cartItems) => {
      if (isMounted) {
        setItems(cartItems)
        setLoading(false)
      }
    })

    const handleUpdate = () => {
      refreshItems()
    }
    window.addEventListener('cart-updated', handleUpdate)
    return () => {
      isMounted = false
      window.removeEventListener('cart-updated', handleUpdate)
    }
  }, [refreshItems])

  const handleQuantityChange = async (item: CartLineItem, newQty: number) => {
    await updateCartQuantity(item.kodeitem, newQty, item.id)
    await refreshItems()
  }

  const handleRemove = async (item: CartLineItem) => {
    await removeFromCart(item.kodeitem, item.id)
    await refreshItems()
  }

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const ongkir = items.length > 0 ? 15000 : 0
  const total = subtotal + ongkir

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Memuat keranjang belanja...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Keranjang Belanja Masih Kosong</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Yuk, jelajahi ribuan produk berkualitas di Karisma Store dan temukan kebutuhan favorit Anda.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
        >
          <span>Mulai Belanja</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-6">
        Keranjang Belanja ({items.length} Item)
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.kodeitem}
              className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs"
            >
              {/* Product Thumbnail */}
              <Link href={`/products/${item.kodeitem}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.namaitem}
                  className="h-full w-full object-cover"
                />
              </Link>

              {/* Title & Info */}
              <div className="flex-1 text-center sm:text-left">
                {item.product.merek_nama && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {item.product.merek_nama}
                  </span>
                )}
                <Link href={`/products/${item.kodeitem}`}>
                  <h3 className="text-sm font-semibold text-gray-900 hover:text-emerald-700 line-clamp-2">
                    {item.product.namaitem}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-gray-400">
                  Harga Satuan: {formatRupiah(item.product.hargajual1)} / {item.satuan}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-1">
                <button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100"
                  title="Kurang"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100"
                  title="Tambah"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-center sm:text-right min-w-[120px]">
                <span className="text-[11px] text-gray-400 block sm:hidden">Subtotal:</span>
                <p className="text-sm font-bold text-emerald-700">
                  {formatRupiah(item.subtotal)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Hapus item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/products"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              ← Lanjut Belanja Produk Lainnya
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Belanja Produk</span>
                <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim (Flat Rate)</span>
                <span className="font-semibold text-gray-900">{formatRupiah(ongkir)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-500">Total Pembayaran</span>
                <p className="text-xl font-extrabold text-emerald-700">{formatRupiah(total)}</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.01]"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Transaksi Dijamin Aman & Terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
