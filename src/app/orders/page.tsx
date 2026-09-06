import React from 'react'
import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import { getUserOrders } from '@/services/orders.service'
import { formatRupiah, formatDate } from '@/lib/utils/format'

export const metadata = {
  title: 'Riwayat Pesanan - Karisma Store',
  description: 'Daftar riwayat pesanan Anda di Karisma Store.',
}

export default async function OrdersPage() {
  const orders = await getUserOrders()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2">
        Pesanan Saya
      </h1>
      <p className="text-xs text-gray-500 mb-8">
        Pantau status pesanan, pembayaran, dan pengiriman barang belanja Anda
      </p>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Belum Ada Pesanan</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Anda belum pernah membuat transaksi pesanan di Karisma Store.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
          >
            <span>Mulai Belanja</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-xs transition-all hover:border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">
                    #{order.notransaksi}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {order.status_order.toUpperCase()}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    {order.status_pembayaran.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {formatDate(order.created_at)} · Penerima: {order.nama_penerima}
                </p>
                <p className="text-xs font-bold text-emerald-700 pt-1">
                  Total: {formatRupiah(order.total_akhir)}
                </p>
              </div>

              <Link
                href={`/orders/${order.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all shrink-0"
              >
                <span>Lihat Detail & Bukti</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
