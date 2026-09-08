'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap, Check, Plus, Minus, ShieldAlert, Crown, Settings } from 'lucide-react'
import { addToCart } from '@/services/cart.service'
import type { ProductItem } from '@/services/products.service'
import { createClient } from '@/lib/supabase/client'

interface ProductDetailActionsProps {
  product: ProductItem
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()
        setUserRole(profile?.role || 'buyer')
      }
    })
  }, [])

  const isInternal = userRole === 'admin' || userRole === 'owner'

  const handleAdd = async () => {
    if (isInternal) return
    setAdding(true)
    try {
      await addToCart(product, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (isInternal) return
    await addToCart(product, quantity)
    router.push('/cart')
  }

  // Tampilan khusus jika user adalah Admin atau Owner
  if (isInternal) {
    return (
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
          <div className="flex items-start gap-3">
            {userRole === 'owner' ? (
              <Crown className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Mode {userRole === 'owner' ? 'Owner / Superadmin' : 'Admin Toko'}
              </h4>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                Akun internal pengelola toko tidak dapat melakukan pemesanan barang. Fitur keranjang dan checkout hanya khusus untuk akun Pembeli.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-6 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-all"
        >
          <Settings className="h-4 w-4" />
          <span>Buka Dashboard Manajemen</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Jumlah:</span>
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-gray-400">Satuan: {product.satuan || 'PCS'}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAdd}
          disabled={adding}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold transition-all shadow-sm ${
            added
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Berhasil Ditambahkan!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Tambah ke Keranjang</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.01]"
        >
          <Zap className="h-4 w-4" />
          <span>Beli Sekarang</span>
        </button>
      </div>
    </div>
  )
}
