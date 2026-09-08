'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Zap, Check, Plus, Minus, ShieldAlert, Crown, Settings, LogIn } from 'lucide-react'
import { addToCart } from '@/services/cart.service'
import type { ProductItem, ProductUnitOption } from '@/services/products.service'
import { formatRupiah } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'

interface ProductDetailActionsProps {
  product: ProductItem
  unitOptions?: ProductUnitOption[]
}

export default function ProductDetailActions({ product, unitOptions = [] }: ProductDetailActionsProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Satuan default
  const defaultUnit = unitOptions.length > 0 ? unitOptions[0] : {
    satuan: product.satuan || 'PCS',
    hargajual: product.hargajual1,
    label: product.satuan || 'PCS',
  }

  const [selectedUnit, setSelectedUnit] = useState<ProductUnitOption>(defaultUnit)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [user, setUser] = useState<{ id: string; role: string } | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle()
        setUser({
          id: data.user.id,
          role: profile?.role || 'buyer',
        })
      } else {
        setUser(null)
      }
      setIsAuthChecking(false)
    })
  }, [])

  const isInternal = user?.role === 'admin' || user?.role === 'owner'
  const isGuest = !user && !isAuthChecking

  // Handle redirect login untuk guest
  const handleGuestLoginRedirect = () => {
    const redirectUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`
    router.push(redirectUrl)
  }

  const handleAdd = async () => {
    if (isGuest) {
      handleGuestLoginRedirect()
      return
    }
    if (isInternal) return

    setAdding(true)
    try {
      const res = await addToCart(product, quantity, selectedUnit.satuan, selectedUnit.hargajual)
      if (res.requireLogin) {
        handleGuestLoginRedirect()
        return
      }
      if (res.success) {
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
      } else if (res.error) {
        alert(res.error)
      }
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (isGuest) {
      handleGuestLoginRedirect()
      return
    }
    if (isInternal) return

    const res = await addToCart(product, quantity, selectedUnit.satuan, selectedUnit.hargajual)
    if (res.requireLogin) {
      handleGuestLoginRedirect()
      return
    }
    if (res.success) {
      router.push('/cart')
    } else if (res.error) {
      alert(res.error)
    }
  }

  // Tampilan khusus jika user adalah Admin atau Owner
  if (isInternal) {
    return (
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
          <div className="flex items-start gap-3">
            {user?.role === 'owner' ? (
              <Crown className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Mode {user?.role === 'owner' ? 'Owner / Superadmin' : 'Admin Toko'}
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
    <div className="space-y-5 pt-4 border-t border-gray-100">
      {/* ── PILIH SATUAN JUAL (PCS / KRTN / RENCENG / BALL) ── */}
      {unitOptions.length > 1 && (
        <div className="space-y-2.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Pilih Satuan Jual
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {unitOptions.map((unit) => {
              const isSelected = selectedUnit.satuan === unit.satuan
              return (
                <button
                  key={unit.satuan}
                  type="button"
                  onClick={() => setSelectedUnit(unit)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">
                        {unit.label || unit.satuan}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {unit.satuan === 'KRTN' || unit.satuan === 'DUS'
                          ? 'Karton / Kemasan Dus'
                          : unit.satuan === 'RCG' || unit.satuan === 'RENCENG'
                          ? 'Kemasan Renceng'
                          : unit.satuan === 'BALL'
                          ? 'Kemasan Ball'
                          : 'Satuan Eceran (Pcs)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-emerald-700 block">
                      {formatRupiah(unit.hargajual)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ {unit.satuan}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Harga Total Per Satuan Terpilih */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Harga Terpilih ({selectedUnit.satuan})
          </span>
          <span className="text-xl font-black text-emerald-700">
            {formatRupiah(selectedUnit.hargajual)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Subtotal ({quantity} {selectedUnit.satuan})
          </span>
          <span className="text-lg font-black text-slate-900">
            {formatRupiah(selectedUnit.hargajual * quantity)}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Jumlah Beli:</span>
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-gray-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-xs hover:bg-gray-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs font-bold text-emerald-700">
          {quantity} {selectedUnit.satuan}
        </span>
      </div>

      {/* Action Buttons: Guest Mode vs Buyer Mode */}
      {isGuest ? (
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGuestLoginRedirect}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Masuk untuk Mulai Berbelanja</span>
          </button>
          <p className="text-center text-[11px] text-slate-500">
            Pengunjung tamu hanya dapat melihat katalog barang. Silakan masuk untuk memasukkan barang ke keranjang dan checkout.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold transition-all shadow-sm cursor-pointer ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Berhasil Ditambahkan ({selectedUnit.satuan})!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>+ Keranjang ({selectedUnit.satuan})</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Zap className="h-4 w-4" />
            <span>Beli Sekarang</span>
          </button>
        </div>
      )}
    </div>
  )
}
