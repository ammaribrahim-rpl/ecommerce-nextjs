import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, CreditCard, ArrowLeft } from 'lucide-react'
import { getOrderById } from '@/services/orders.service'
import { formatRupiah, formatDate } from '@/lib/utils/format'
import PaymentProofUploader from '@/components/orders/PaymentProofUploader'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Rincian Pesanan - Karisma Store',
  description: 'Informasi lengkap status pesanan dan konfirmasi pembayaran Anda di Karisma Store.',
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">Selesai</span>
      case 'shipped':
        return <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold">Sedang Dikirim</span>
      case 'processing':
        return <span className="rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-bold">Sedang Diproses</span>
      case 'ordered':
      default:
        return <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">Menunggu Konfirmasi</span>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">Lunas / Terverifikasi</span>
      case 'proof_submitted':
        return <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold">Bukti Diunggah (Menunggu Verifikasi)</span>
      case 'cash_pending':
        return <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">Bayar di Tempat (COD)</span>
      case 'unpaid':
      default:
        return <span className="rounded-full bg-red-100 text-red-800 px-3 py-1 text-xs font-bold">Belum Dibayar</span>
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Daftar Pesanan Saya</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950">
            Pesanan #{order.notransaksi}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Waktu Transaksi: {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge(order.status_order)}
          {getPaymentBadge(order.status_pembayaran)}
        </div>
      </div>

      {/* Payment Instruction & Upload Proof (If Unpaid or Proof Submitted) */}
      {order.metode_pembayaran === 'bank_transfer' && (
        <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Rekening Resmi Pembayaran</h2>
              <p className="text-xs text-gray-500">Silakan lakukan transfer sesuai total belanja ke rekening di bawah ini:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase">Bank Central Asia (BCA)</p>
              <p className="text-lg font-mono font-bold text-gray-900 mt-1">882-019-2819</p>
              <p className="text-xs text-gray-600">a.n. PT Karisma Store Indonesia</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
              <p className="text-xs text-gray-400 font-semibold uppercase">Bank Mandiri</p>
              <p className="text-lg font-mono font-bold text-gray-900 mt-1">137-00-1829-2810</p>
              <p className="text-xs text-gray-600">a.n. PT Karisma Store Indonesia</p>
            </div>
          </div>

          {/* Payment Proof Uploader */}
          {order.status_pembayaran === 'unpaid' && (
            <PaymentProofUploader orderId={order.id} />
          )}

          {/* If already submitted */}
          {order.payment_proofs && order.payment_proofs.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
              <p className="text-xs font-bold text-blue-900">Bukti Pembayaran Tersimpan:</p>
              <div className="flex items-center gap-4">
                <a
                  href={order.payment_proofs[0].file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 underline"
                >
                  Lihat File Bukti Pembayaran ↗
                </a>
                <span className="text-xs text-blue-600 font-medium">
                  Status: {order.payment_proofs[0].status_verifikasi}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid: Order Items & Delivery Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Order Items Table */}
        <div className="lg:col-span-8 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
            Daftar Barang Belanja ({order.items.length} Item)
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center gap-4 text-xs">
                <div>
                  <span className="font-mono text-gray-400 text-[11px] block">{item.kodeitem}</span>
                  <span className="font-semibold text-gray-900 text-sm">{item.namaitem}</span>
                  <span className="text-gray-500 block mt-0.5">
                    {item.jumlah} {item.satuan} x {formatRupiah(item.harga_satuan)}
                  </span>
                </div>
                <div className="text-right font-bold text-emerald-700 text-sm shrink-0">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal Belanja</span>
              <span className="font-semibold text-gray-900">{formatRupiah(order.total_belanja)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span className="font-semibold text-gray-900">{formatRupiah(order.ongkir)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-base font-bold text-gray-900">
              <span>Total Akhir</span>
              <span className="text-emerald-700">{formatRupiah(order.total_akhir)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Recipient Info */}
        <div className="lg:col-span-4 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900">Informasi Pengiriman</h3>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div>
              <span className="text-gray-400 block">Penerima:</span>
              <span className="font-semibold text-gray-900">{order.nama_penerima}</span>
            </div>

            <div>
              <span className="text-gray-400 block">Nomor Telepon:</span>
              <span className="font-semibold text-gray-900">{order.telepon_penerima}</span>
            </div>

            <div>
              <span className="text-gray-400 block">Alamat Tujuan:</span>
              <span className="font-medium text-gray-800 leading-relaxed block mt-0.5">
                {order.alamat_kirim}
              </span>
            </div>

            {order.catatan && (
              <div>
                <span className="text-gray-400 block">Catatan:</span>
                <span className="italic text-gray-600">{order.catatan}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
