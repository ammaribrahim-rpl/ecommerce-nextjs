'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Truck, CreditCard, QrCode, Banknote, AlertCircle, ArrowRight, User } from 'lucide-react'
import { getCartDetails, clearCart, type CartLineItem } from '@/services/cart.service'
import { createOrder } from '@/services/orders.service'
import { formatRupiah } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartLineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; nama?: string; telepon?: string } | null>(null)

  // Form Fields
  const [namaPenerima, setNamaPenerima] = useState('')
  const [teleponPenerima, setTeleponPenerima] = useState('')
  const [alamatKirim, setAlamatKirim] = useState('')
  const [catatan, setCatatan] = useState('')
  const [metodePembayaran, setMetodePembayaran] = useState<'bank_transfer' | 'qris' | 'cash'>('bank_transfer')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()

        setUser({
          id: authUser.id,
          email: authUser.email,
          nama: profile?.nama || '',
          telepon: profile?.telepon || '',
        })

        if (profile?.nama) setNamaPenerima(profile.nama)
        if (profile?.telepon) setTeleponPenerima(profile.telepon)
      }

      const cartItems = await getCartDetails()
      setItems(cartItems)
      setLoading(false)
    }

    init()
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const ongkir = items.length > 0 ? 15000 : 0
  const total = subtotal + ongkir

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Silakan masuk (login) terlebih dahulu untuk melanjutkan checkout.')
      return
    }

    if (items.length === 0) {
      setError('Keranjang belanja Anda kosong.')
      return
    }

    if (!namaPenerima.trim() || !teleponPenerima.trim() || !alamatKirim.trim()) {
      setError('Harap lengkapi nama penerima, nomor telepon, dan alamat pengiriman.')
      return
    }

    setSubmitting(true)

    try {
      const res = await createOrder({
        nama_penerima: namaPenerima.trim(),
        telepon_penerima: teleponPenerima.trim(),
        alamat_kirim: alamatKirim.trim(),
        metode_pembayaran: metodePembayaran,
        catatan: catatan.trim() || undefined,
        ongkir,
        items,
      })

      if (!res.success || !res.orderId) {
        setError(res.error || 'Gagal memproses pesanan. Silakan coba lagi.')
        return
      }

      // Clear cart
      await clearCart()

      // Redirect to Order Detail / Confirmation page
      router.push(`/orders/${res.orderId}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat membuat pesanan.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Menyiapkan halaman checkout...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Keranjang Belanja Masih Kosong</h2>
        <p className="mt-1 text-sm text-gray-500">Tambahkan barang terlebih dahulu sebelum checkout.</p>
        <Link href="/products" className="mt-4 inline-block text-sm font-semibold text-emerald-600">
          ← Kembali ke Katalog Produk
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-6">
        Checkout Pesanan
      </h1>

      {/* Guest Warning Banner if not logged in */}
      {!user && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Anda belum masuk (login)</p>
              <p className="text-xs text-emerald-700">Masuk untuk menyimpan pesanan ke akun Anda dan melacak status pengiriman.</p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
          >
            Masuk / Daftar Sekarang
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Alamat Pengiriman */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Truck className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Alamat & Data Penerima</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  value={namaPenerima}
                  onChange={(e) => setNamaPenerima(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={teleponPenerima}
                  onChange={(e) => setTeleponPenerima(e.target.value)}
                  placeholder="081234567890"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alamat Lengkap Pengiriman *
              </label>
              <textarea
                required
                rows={3}
                value={alamatKirim}
                onChange={(e) => setAlamatKirim(e.target.value)}
                placeholder="Jl. Mawar No. 12, RT 02/05, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Catatan Pesanan (Opsional)
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Titipkan di satpam jika tidak ada orang di rumah"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-2.5 text-xs text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Metode Pembayaran */}
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Pilih Metode Pembayaran</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setMetodePembayaran('bank_transfer')}
                className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodePembayaran === 'bank_transfer'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-900">Transfer Bank</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  BCA, Mandiri, BRI. Verifikasi melalui upload bukti transfer.
                </p>
              </label>

              <label
                onClick={() => setMetodePembayaran('qris')}
                className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodePembayaran === 'qris'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <QrCode className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-900">QRIS Instan</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Scan kode QRIS menggunakan GoPay, OVO, Dana, BCA Mobile, dll.
                </p>
              </label>

              <label
                onClick={() => setMetodePembayaran('cash')}
                className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                  metodePembayaran === 'cash'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Banknote className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-900">COD (Tunai)</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Bayar secara tunai saat barang diterima di tempat Anda.
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Items & Submit */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Rincian Belanja ({items.length} Barang)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.kodeitem} className="flex justify-between items-start gap-2 text-xs">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 line-clamp-1">{item.product.namaitem}</p>
                    <p className="text-gray-400">
                      {item.quantity} x {formatRupiah(item.product.hargajual1)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal Barang</span>
                <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkir Flat Rate</span>
                <span className="font-semibold text-gray-900">{formatRupiah(ongkir)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-gray-900">
                <span>Total Akhir</span>
                <span className="text-emerald-700 text-base">{formatRupiah(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !user}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Konfirmasi & Buat Pesanan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Jaminan Transaksi Resmi Karisma Store</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
