import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Package, CheckCircle, Truck, Clock,
  MapPin, Calendar, ArrowRight, ShoppingBag
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatRupiah, formatDate } from '@/lib/utils/format'

export const metadata = {
  title: 'Lacak Pesanan Saya - Karisma Store',
  description: 'Pantau status dan pengiriman semua pesananmu di Karisma Store.',
}

const STATUS_STEP: Record<string, number> = {
  ordered: 0,
  processing: 1,
  paid: 1,
  shipped: 2,
  on_delivery: 2,
  delivered: 3,
  completed: 3,
}

const ORDER_STEPS = [
  { title: 'Pesanan Dibuat', desc: 'Menunggu verifikasi pembayaran', icon: <Clock className="h-4 w-4" /> },
  { title: 'Sedang Dikemas', desc: 'Produk disiapkan oleh tim gudang', icon: <Package className="h-4 w-4" /> },
  { title: 'Dalam Pengiriman', desc: 'Diserahkan ke kurir ekspedisi', icon: <Truck className="h-4 w-4" /> },
  { title: 'Terkirim', desc: 'Paket telah sampai di tujuan', icon: <CheckCircle className="h-4 w-4" /> },
]

const STATUS_LABEL: Record<string, string> = {
  ordered: 'Dipesan',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
  paid: 'Dibayar',
  unpaid: 'Belum Bayar',
  cash_pending: 'Tunai Menunggu',
}

const STATUS_COLOR: Record<string, string> = {
  ordered: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-amber-100 text-amber-700 border-amber-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

interface OrderItem {
  namaitem: string
  jumlah: number
  harga_satuan: number
  subtotal: number
}

interface UserOrder {
  id: string
  notransaksi: string
  created_at: string
  status_order: string
  status_pengiriman: string | null
  status_pembayaran: string
  total_akhir: number
  metode_pembayaran: string | null
  nama_penerima: string
  alamat_kirim: string
  telepon_penerima: string
  catatan: string | null
  ecommerce_order_items?: OrderItem[]
}

export default async function TrackOrderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/track-order')
  }

  // Fetch semua pesanan milik user + items
  const { data: orders } = await supabase
    .from('ecommerce_orders')
    .select(`
      id,
      notransaksi,
      created_at,
      status_order,
      status_pengiriman,
      status_pembayaran,
      total_akhir,
      metode_pembayaran,
      nama_penerima,
      alamat_kirim,
      telepon_penerima,
      catatan,
      ecommerce_order_items (
        namaitem,
        jumlah,
        harga_satuan,
        subtotal
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allOrders = (orders as unknown as UserOrder[]) || []

  return (
    <div className="min-h-screen bg-[#F2F4F5] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#5F6C72]">
            <Link href="/" className="hover:text-[#FA8232] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#191C1F] font-semibold">Lacak Pesanan Saya</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C1F] tracking-tight">
            Lacak Pesanan Saya
          </h1>
          <p className="text-sm text-[#5F6C72] mt-1.5">
            Pantau status dan pengiriman semua pesananmu secara real-time.
          </p>
        </div>

        {/* Empty State */}
        {allOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3EB] text-[#FA8232] mx-auto mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#191C1F]">Belum Ada Pesanan</h3>
            <p className="text-xs text-[#5F6C72] mt-1.5 max-w-sm mx-auto mb-6 leading-relaxed">
              Kamu belum memiliki pesanan. Mulai belanja sekarang dan pantau status pesananmu di sini!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-6 py-3 text-xs font-bold text-white hover:bg-[#E07328] transition-colors"
            >
              <span>Mulai Belanja</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {allOrders.length > 0 && (
          <div className="space-y-6">
            {allOrders.map((order) => {
              const stepIdx = STATUS_STEP[order.status_pengiriman || order.status_order] ?? 0
              const isCancelled = order.status_order === 'cancelled'
              const items = (order as any).ecommerce_order_items || []

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-[#191C1F] text-base">
                          #{order.notransaksi}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_COLOR[order.status_order] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {STATUS_LABEL[order.status_order] || order.status_order}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          order.status_pembayaran === 'paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          order.status_pembayaran === 'cash_pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {STATUS_LABEL[order.status_pembayaran] || order.status_pembayaran}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#77878F] mt-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Dipesan pada: {formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs text-[#5F6C72]">Total Tagihan</p>
                      <p className="text-xl font-black text-[#2DA5F3]">{formatRupiah(order.total_akhir)}</p>
                      <p className="text-[11px] text-[#77878F] mt-0.5 uppercase">{order.metode_pembayaran?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Tracking Stepper */}
                  {!isCancelled && (
                    <div className="px-5 py-5 border-b border-gray-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#77878F] mb-4">
                        Status Perjalanan Paket
                      </p>
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
                        <div
                          className="absolute top-5 left-5 h-0.5 bg-[#2DB224] transition-all duration-500"
                          style={{ width: `${(stepIdx / (ORDER_STEPS.length - 1)) * (100 - (100 / ORDER_STEPS.length))}%` }}
                        />
                        <div className="relative grid grid-cols-4 gap-2">
                          {ORDER_STEPS.map((step, idx) => {
                            const isDone = idx <= stepIdx
                            const isCurrent = idx === stepIdx
                            return (
                              <div key={idx} className="flex flex-col items-center text-center gap-2">
                                <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-[#2DB224] text-white shadow-md shadow-green-200'
                                    : 'bg-gray-100 text-gray-400'
                                } ${isCurrent ? 'ring-4 ring-[#2DB224]/20 scale-110' : ''}`}>
                                  {isDone ? <CheckCircle className="h-5 w-5" /> : <span>{idx + 1}</span>}
                                </div>
                                <div className="font-bold text-[11px] text-[#191C1F] leading-tight">{step.title}</div>
                                <div className="text-[10px] text-[#77878F] leading-tight hidden sm:block">{step.desc}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="px-5 py-4 border-b border-gray-100 bg-red-50">
                      <p className="text-xs font-semibold text-red-700">⚠️ Pesanan ini telah dibatalkan. Hubungi kami jika membutuhkan bantuan.</p>
                    </div>
                  )}

                  {/* Items & Shipping Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                    {/* Shipping Address */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#191C1F]">
                        <MapPin className="h-3.5 w-3.5 text-[#FA8232]" />
                        <span>Alamat Pengiriman</span>
                      </div>
                      <p className="text-xs font-semibold text-[#475156]">{order.nama_penerima}</p>
                      <p className="text-xs text-[#5F6C72] leading-relaxed">{order.alamat_kirim}</p>
                      {order.telepon_penerima && (
                        <p className="text-xs text-[#5F6C72]">Telp: {order.telepon_penerima}</p>
                      )}
                    </div>

                    {/* Items */}
                    {items.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#191C1F]">
                          <Package className="h-3.5 w-3.5 text-[#2DA5F3]" />
                          <span>Daftar Barang ({items.length} item)</span>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-28 overflow-y-auto rounded-lg bg-gray-50 p-2">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="py-1.5 flex justify-between text-xs">
                              <span className="text-[#475156] truncate max-w-[160px]">
                                {item.jumlah}× {item.namaitem}
                              </span>
                              <span className="font-semibold text-[#191C1F] shrink-0 ml-2">
                                {formatRupiah(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer: link ke detail */}
                  <div className="px-5 pb-4 flex justify-end">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-[#191C1F] hover:border-[#FA8232] hover:text-[#FA8232] transition-colors"
                    >
                      <span>Lihat Detail Lengkap</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
