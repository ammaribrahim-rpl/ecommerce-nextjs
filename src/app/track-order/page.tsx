'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  ArrowRight,
  Info,
  MapPin,
  Calendar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah, formatDate } from '@/lib/utils/format'

interface OrderResult {
  id: string
  notransaksi: string
  created_at: string
  status: string
  total: number
  nama_penerima?: string
  alamat_kirim?: string
  telepon_penerima?: string
  items?: {
    namabarang: string
    qty: number
    hargasatuan: number
    subtotal: number
  }[]
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OrderResult | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    const cleanId = orderId.trim()
    if (!cleanId) {
      setError('Harap masukkan No. Pesanan / Order ID.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Cari berdasarkan id (uuid) atau notransaksi
      let query = supabase
        .from('ecommerce_orders')
        .select(`
          id,
          notransaksi,
          created_at,
          status,
          total,
          nama_penerima,
          alamat_kirim,
          telepon_penerima,
          ecommerce_order_items (
            namabarang,
            qty,
            hargasatuan,
            subtotal
          )
        `)

      // Check if cleanId matches UUID or notransaksi
      if (cleanId.includes('-') && cleanId.length > 20) {
        query = query.eq('id', cleanId)
      } else {
        query = query.ilike('notransaksi', `%${cleanId}%`)
      }

      const { data, error: dbError } = await query.maybeSingle()

      if (dbError || !data) {
        // Jika tidak ditemukan di database, cek apakah demo input
        if (cleanId.toLowerCase().includes('demo') || cleanId.toLowerCase().includes('test')) {
          setResult({
            id: 'demo-order-12345',
            notransaksi: 'ORD-DEMO-2026',
            created_at: new Date().toISOString(),
            status: 'processing',
            total: 185000,
            nama_penerima: 'Budi Santoso',
            alamat_kirim: 'Jl. Merdeka No. 45, Jakarta Selatan',
            telepon_penerima: '081298765432',
            items: [
              {
                namabarang: 'Morinaga Chil Kid Gold 800g',
                qty: 1,
                hargasatuan: 185000,
                subtotal: 185000,
              },
            ],
          })
        } else {
          setError(
            `Pesanan dengan No. "${cleanId}" tidak ditemukan. Pastikan nomor pesanan yang Anda masukkan sudah sesuai.`
          )
        }
      } else {
        setResult({
          id: data.id,
          notransaksi: data.notransaksi || data.id.slice(0, 8).toUpperCase(),
          created_at: data.created_at,
          status: data.status,
          total: data.total || 0,
          nama_penerima: data.nama_penerima,
          alamat_kirim: data.alamat_kirim,
          telepon_penerima: data.telepon_penerima,
          items: data.ecommerce_order_items as any,
        })
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memeriksa status pesanan.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate step index from status
  const getStepIndex = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 0
      case 'processing':
      case 'paid':
        return 1
      case 'shipped':
      case 'on_delivery':
        return 2
      case 'delivered':
      case 'completed':
        return 3
      default:
        return 1
    }
  }

  const steps = [
    { title: 'Pesanan Dibuat', desc: 'Menunggu verifikasi pembayaran' },
    { title: 'Sedang Dikemas', desc: 'Produk disiapkan oleh tim gudang' },
    { title: 'Dalam Pengiriman', desc: 'Diserahkan ke kurir ekspedisi' },
    { title: 'Terkirim', desc: 'Paket telah sampai di alamat tujuan' },
  ]

  const currentStep = result ? getStepIndex(result.status) : 0

  return (
    <div className="min-h-screen bg-[#F2F4F5] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#5F6C72]">
            <Link href="/" className="hover:text-[#FA8232] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#191C1F] font-semibold">Track Order</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10 shadow-xs mb-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1F] tracking-tight mb-2">
              Lacak Pesanan (Track Order)
            </h1>
            <p className="text-xs sm:text-sm text-[#5F6C72] leading-relaxed mb-8">
              Untuk melacak status pesanan Anda, silakan masukkan <strong>Nomor Pesanan (Order ID)</strong> dan <strong>Email Pemesanan</strong> pada formulir di bawah ini, lalu klik tombol &quot;Lacak Pesanan&quot;.
            </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#191C1F] mb-2">
                  Nomor Pesanan / Order ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Contoh: ORD-2026-001 atau ORD-DEMO"
                  className="w-full rounded-md border border-gray-300 px-3.5 py-3 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                />
                <p className="mt-1.5 text-[11px] text-[#77878F]">
                  Dapat ditemukan pada invoice atau riwayat transaksi pesanan Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191C1F] mb-2">
                  Email Pemesanan (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full rounded-md border border-gray-300 px-3.5 py-3 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                />
                <p className="mt-1.5 text-[11px] text-[#77878F]">
                  Email yang Anda daftarkan saat melakukan pemesanan.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-8 py-3.5 text-xs font-bold text-white hover:bg-[#E07328] transition-colors shadow-sm disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Sedang Memeriksa...' : 'Lacak Pesanan Sekarang'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8 animate-fade-in">
            {/* Header Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs text-[#5F6C72]">No. Transaksi:</span>
                <h3 className="text-xl font-black text-[#191C1F] mt-0.5">
                  #{result.notransaksi}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#5F6C72] mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Dipesan pada: {formatDate(result.created_at)}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5F6C72]">Total Tagihan:</span>
                <div className="text-xl font-black text-[#2DA5F3]">
                  {formatRupiah(result.total)}
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  {result.status}
                </span>
              </div>
            </div>

            {/* Tracking Progress Stepper */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#77878F] mb-6">
                Status Perjalanan Paket
              </h4>

              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStep
                  const isCurrent = idx === currentStep

                  return (
                    <div key={idx} className="relative z-10 text-center sm:text-left space-y-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#2DB224] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#2DB224]/20' : ''}`}
                      >
                        {isDone ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                      </div>
                      <div className="font-bold text-xs text-[#191C1F]">{step.title}</div>
                      <div className="text-[11px] text-[#5F6C72] leading-normal">{step.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recipient & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg bg-[#F2F4F5]/60 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-[#191C1F] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#FA8232]" />
                  <span>Alamat Pengiriman:</span>
                </div>
                <div className="text-[#475156] font-medium">{result.nama_penerima || 'Pembeli'}</div>
                <div className="text-[#5F6C72]">{result.alamat_kirim || 'Alamat sesuai saat checkout'}</div>
                {result.telepon_penerima && (
                  <div className="text-[#5F6C72]">Telp: {result.telepon_penerima}</div>
                )}
              </div>

              {result.items && result.items.length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-[#191C1F] flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-[#2DA5F3]" />
                    <span>Daftar Barang:</span>
                  </div>
                  <div className="divide-y divide-gray-200/60 max-h-32 overflow-y-auto">
                    {result.items.map((item, i) => (
                      <div key={i} className="py-1 flex justify-between">
                        <span className="text-[#475156] truncate max-w-[200px]">
                          {item.qty}x {item.namabarang}
                        </span>
                        <span className="font-semibold text-[#191C1F]">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
