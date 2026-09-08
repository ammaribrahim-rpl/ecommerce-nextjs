'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package, DollarSign, ShoppingCart, Clock, CheckCircle2,
  Truck, XCircle, ChevronRight, Search, MessageSquare,
  Crown, ShieldCheck, RefreshCw, Send, User, AlertTriangle,
  ExternalLink, Filter, Check, Eye
} from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import {
  getAllConversations,
  getConversationMessages,
  sendChatMessage,
  markMessagesAsRead,
  type Conversation,
  type ChatMessage,
} from '@/services/chat.service'

interface AdminDashboardClientProps {
  initialOrders: any[]
  initialProducts: any[]
  stats: {
    totalRevenue: number
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    shippedOrders: number
    deliveredOrders: number
    totalProducts: number
  }
  userProfile: {
    id: string
    email: string
    nama: string | null
    role: string
  }
}

export default function AdminDashboardClient({
  initialOrders,
  initialProducts,
  stats: initialStats,
  userProfile,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'chat'>('overview')
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [products, setProducts] = useState<any[]>(initialProducts)
  const [stats, setStats] = useState(initialStats)

  // Filter & Search Orders
  const [orderFilter, setOrderFilter] = useState<string>('all')
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Filter & Search Products
  const [productSearch, setProductSearch] = useState('')

  // Chat State
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [adminReply, setAdminReply] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  // Load chat conversations when switching to chat tab
  useEffect(() => {
    if (activeTab === 'chat') {
      loadConversations()
    }
  }, [activeTab])

  const loadConversations = async () => {
    setLoadingChat(true)
    try {
      const convs = await getAllConversations()
      setConversations(convs)
      if (convs.length > 0 && !selectedConv) {
        handleSelectConversation(convs[0])
      }
    } finally {
      setLoadingChat(false)
    }
  }

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv)
    const msgs = await getConversationMessages(conv.id)
    setChatMessages(msgs)
    await markMessagesAsRead(conv.id, userProfile.id)
  }

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminReply.trim() || !selectedConv || sendingReply) return

    setSendingReply(true)
    try {
      const msg = await sendChatMessage(selectedConv.id, userProfile.id, adminReply.trim())
      if (msg) {
        setChatMessages((prev) => [...prev, msg])
        setAdminReply('')
      }
    } finally {
      setSendingReply(false)
    }
  }

  // Update order status function
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('ecommerce_orders')
        .update({
          status_order: newStatus,
          status_pengiriman: newStatus === 'shipped' ? 'shipped' : newStatus === 'delivered' ? 'delivered' : 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status_order: newStatus } : o))
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status_order: newStatus }))
        }
      } else {
        alert('Gagal memperbarui status: ' + error.message)
      }
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Update payment status function
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingOrderId(orderId)
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('ecommerce_orders')
        .update({
          status_pembayaran: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (!error) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status_pembayaran: newPaymentStatus } : o))
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev: any) => ({ ...prev, status_pembayaran: newPaymentStatus }))
        }
      } else {
        alert('Gagal memperbarui status pembayaran: ' + error.message)
      }
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderFilter === 'all' || o.status_order === orderFilter
    const matchSearch =
      orderSearch === '' ||
      o.notransaksi?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.nama_penerima?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.telepon_penerima?.includes(orderSearch)
    return matchStatus && matchSearch
  })

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return (
      productSearch === '' ||
      p.namaitem?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.kodeitem?.toLowerCase().includes(productSearch.toLowerCase())
    )
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Dashboard Manajemen Toko
            </h1>
            {userProfile.role === 'owner' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 border border-amber-300">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                Owner / Superadmin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Admin Toko
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola pesanan pelanggan, pantau katalog produk, dan respon pertanyaan pembeli secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
          >
            Profil Akun
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1"
          >
            Buka Toko Depan <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────── */}
      <div className="flex border-b border-gray-200 mb-6 gap-2 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Ringkasan & Metrik
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Kelola Pesanan</span>
          {stats.pendingOrders > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] text-white">
              {stats.pendingOrders}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Katalog Produk ({stats.totalProducts})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Pusat Chat Pelanggan</span>
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendapatan</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{formatRupiah(stats.totalRevenue)}</p>
              <p className="mt-1 text-[11px] text-slate-400">Total akumulasi order selesai & dibayar</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pesanan</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{stats.totalOrders}</p>
              <p className="mt-1 text-[11px] text-slate-400">Semua pesanan yang masuk</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perlu Diproses</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-amber-600">{stats.pendingOrders}</p>
              <p className="mt-1 text-[11px] text-slate-400">Menunggu verifikasi & packing</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sedang Dikirim</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Truck className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-purple-600">{stats.shippedOrders}</p>
              <p className="mt-1 text-[11px] text-slate-400">Dalam perjalanan ekspedisi</p>
            </div>
          </div>

          {/* Quick Recent Orders */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pesanan Masuk Terbaru</h3>
                <p className="text-xs text-slate-500">Daftar transaksi terbaru yang membutuhkan respon toko</p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Lihat Semua Pesanan &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">No. Transaksi</th>
                    <th className="px-4 py-3">Penerima</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status Order</th>
                    <th className="px-4 py-3">Pembayaran</th>
                    <th className="px-4 py-3 rounded-r-xl">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {o.notransaksi}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{o.nama_penerima}</div>
                        <div className="text-[11px] text-slate-400">{o.telepon_penerima}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        {formatRupiah(o.total_akhir)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status_order === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          o.status_order === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          o.status_order === 'processing' ? 'bg-orange-100 text-orange-800' :
                          o.status_order === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {o.status_order}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status_pembayaran === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          o.status_pembayaran === 'cash_pending' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {o.status_pembayaran}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(o.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDERS MANAGEMENT ────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'ordered', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                    orderFilter === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'Semua Status' : status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Cari no. transaksi / nama..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2 pl-9 pr-3 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">No. Transaksi</th>
                    <th className="px-4 py-3">Pelanggan & Alamat</th>
                    <th className="px-4 py-3">Metode & Total</th>
                    <th className="px-4 py-3">Status Order</th>
                    <th className="px-4 py-3">Status Bayar</th>
                    <th className="px-4 py-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        Tidak ada pesanan yang sesuai dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-slate-900 block">{o.notransaksi}</span>
                          <span className="text-[10px] text-slate-400">{formatDate(o.created_at)}</span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="font-bold text-slate-900">{o.nama_penerima}</p>
                          <p className="text-[11px] text-slate-500">{o.telepon_penerima}</p>
                          <p className="text-[10px] text-slate-400 truncate">{o.alamat_kirim}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-black text-emerald-700">{formatRupiah(o.total_akhir)}</p>
                          <span className="text-[10px] uppercase font-semibold text-slate-400">
                            {o.metode_pembayaran}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status_order}
                            disabled={updatingOrderId === o.id}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="ordered">ordered (dipesan)</option>
                            <option value="processing">processing (diproses)</option>
                            <option value="shipped">shipped (dikirim)</option>
                            <option value="delivered">delivered (diterima)</option>
                            <option value="cancelled">cancelled (dibatalkan)</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status_pembayaran}
                            disabled={updatingOrderId === o.id}
                            onChange={(e) => handleUpdatePaymentStatus(o.id, e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="unpaid">Belum Bayar (unpaid)</option>
                            <option value="cash_pending">Tunai Menunggu (cash_pending)</option>
                            <option value="paid">Lunas (paid)</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Detail Pesanan */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-fade-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Detail Pesanan #{selectedOrder.notransaksi}</h3>
                    <p className="text-xs text-slate-400">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Data Pembeli</p>
                    <p className="mt-1 font-bold text-slate-900">{selectedOrder.nama_penerima}</p>
                    <p className="text-slate-600">{selectedOrder.telepon_penerima}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Alamat Pengiriman</p>
                    <p className="mt-1 text-slate-700 leading-relaxed">{selectedOrder.alamat_kirim}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal Belanja:</span>
                    <span className="font-bold text-slate-800">{formatRupiah(selectedOrder.total_belanja)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ongkos Kirim:</span>
                    <span className="font-bold text-slate-800">{formatRupiah(selectedOrder.ongkir)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-sm">
                    <span className="font-bold text-slate-900">Total Akhir:</span>
                    <span className="font-black text-emerald-700">{formatRupiah(selectedOrder.total_akhir)}</span>
                  </div>
                </div>

                {selectedOrder.catatan && (
                  <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                    <span className="font-bold">Catatan Pembeli:</span> {selectedOrder.catatan}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: PRODUCTS CATALOG ─────────────────────────── */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Katalog Stok & Harga</h3>
              <p className="text-xs text-slate-500">Total {products.length} produk terdaftar dalam database</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Cari nama atau kode produk..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2 pl-9 pr-3 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3">Kode Item</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3">Harga Jual</th>
                    <th className="px-4 py-3">Stok Tersedia</th>
                    <th className="px-4 py-3 text-right">Lihat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.slice(0, 50).map((p) => (
                    <tr key={p.kodeitem} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                        {p.namaitem}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{p.kodeitem}</td>
                      <td className="px-4 py-3">{p.satuan || 'PCS'}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        {formatRupiah(p.hargajual1)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          (p.stok ?? 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.stok ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/products/${p.kodeitem}`}
                          target="_blank"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                        >
                          Toko <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CUSTOMER CHAT CENTER ─────────────────────── */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-xs min-h-[560px]">
          {/* Conversation List */}
          <div className="md:col-span-4 border-r border-gray-100 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Percakapan Pembeli</h3>
                <p className="text-[11px] text-slate-400">Pesan dari pelanggan toko</p>
              </div>
              <button
                onClick={loadConversations}
                disabled={loadingChat}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
                title="Refresh Chat"
              >
                <RefreshCw className={`h-4 w-4 ${loadingChat ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada percakapan masuk dari pembeli.
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConversation(c)}
                    className={`w-full text-left p-3.5 transition-colors flex items-center gap-3 ${
                      selectedConv?.id === c.id ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-xs text-slate-700">
                      {c.customer?.nama?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {c.customer?.nama || c.customer?.email || 'Pelanggan'}
                        </span>
                        {c.unread_count && c.unread_count > 0 ? (
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {c.last_message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="md:col-span-8 flex flex-col h-[560px]">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {selectedConv.customer?.nama?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        {selectedConv.customer?.nama || 'Pelanggan'}
                      </h4>
                      <p className="text-[11px] text-slate-400">{selectedConv.customer?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                      Belum ada pesan dalam percakapan ini. Balas sekarang untuk menyapa pelanggan.
                    </div>
                  ) : (
                    chatMessages.map((m) => {
                      const isMe = m.sender_id === userProfile.id
                      return (
                        <div
                          key={m.id}
                          className={`flex gap-2 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                              isMe
                                ? 'rounded-br-xs bg-emerald-600 text-white'
                                : 'rounded-bl-xs bg-white text-slate-800 border border-slate-200'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{m.pesan}</p>
                            <span className={`block text-right text-[9px] mt-1 ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                              {new Date(m.created_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Reply Input */}
                <form onSubmit={handleSendAdminReply} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Balas pesan pelanggan sebagai Karisma Care..."
                    className="flex-1 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!adminReply.trim() || sendingReply}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <MessageSquare className="h-10 w-10 text-slate-300" />
                <p className="text-xs">Pilih salah satu percakapan di sebelah kiri untuk melihat pesan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
