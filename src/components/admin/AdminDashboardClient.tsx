'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Package, DollarSign, ShoppingCart, Clock,
  CheckCircle2, Truck, XCircle, Search, MessageSquare,
  Crown, ShieldCheck, RefreshCw, Send, User, Users,
  ExternalLink, Eye, LogOut, ChevronRight, TrendingUp,
  AlertTriangle, Bell, Settings, Home, BarChart3, Menu, X,
} from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import AdminCharts from './AdminCharts'
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

type TabKey = 'overview' | 'orders' | 'products' | 'chat' | 'customers'

const STATUS_LABEL: Record<string, string> = {
  ordered: 'Dipesan',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
  all: 'Semua Status',
}

const STATUS_COLORS: Record<string, string> = {
  ordered: 'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const PAY_LABEL: Record<string, string> = {
  paid: 'Lunas',
  unpaid: 'Belum Bayar',
  cash_pending: 'Tunai Menunggu',
}
const PAY_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-red-100 text-red-700',
  cash_pending: 'bg-amber-100 text-amber-700',
}

export default function AdminDashboardClient({
  initialOrders,
  initialProducts,
  stats: initialStats,
  userProfile,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [products] = useState<any[]>(initialProducts)
  const [stats, setStats] = useState(initialStats)

  // Sidebar collapse on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // Customers
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  useEffect(() => {
    if (activeTab === 'chat') loadConversations()
    if (activeTab === 'customers') loadCustomers()
  }, [activeTab])

  const loadConversations = async () => {
    setLoadingChat(true)
    try {
      const convs = await getAllConversations()
      setConversations(convs)
      if (convs.length > 0 && !selectedConv) handleSelectConversation(convs[0])
    } finally {
      setLoadingChat(false)
    }
  }

  const loadCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      setCustomers(data || [])
    } finally {
      setLoadingCustomers(false)
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('ecommerce_orders')
        .update({
          status_order: newStatus,
          status_pengiriman: newStatus === 'shipped' ? 'shipped' : newStatus === 'delivered' ? 'delivered' : 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (!error) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status_order: newStatus } : o)))
        if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status_order: newStatus }))
      } else {
        alert('Gagal memperbarui status: ' + error.message)
      }
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    setUpdatingOrderId(orderId)
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('ecommerce_orders')
        .update({ status_pembayaran: newPaymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
      if (!error) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status_pembayaran: newPaymentStatus } : o)))
        if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status_pembayaran: newPaymentStatus }))
      } else {
        alert('Gagal memperbarui status pembayaran: ' + error.message)
      }
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderFilter === 'all' || o.status_order === orderFilter
    const matchSearch =
      orderSearch === '' ||
      o.notransaksi?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.nama_penerima?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.telepon_penerima?.includes(orderSearch)
    return matchStatus && matchSearch
  })

  const filteredProducts = products.filter(
    (p) =>
      productSearch === '' ||
      p.namaitem?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.kodeitem?.toLowerCase().includes(productSearch.toLowerCase())
  )

  // Nav items
  const NAV_ITEMS: { key: TabKey; icon: React.ReactNode; label: string; badge?: number }[] = [
    { key: 'overview', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Ringkasan' },
    { key: 'orders', icon: <ShoppingCart className="h-5 w-5" />, label: 'Kelola Pesanan', badge: stats.pendingOrders > 0 ? stats.pendingOrders : undefined },
    { key: 'products', icon: <Package className="h-5 w-5" />, label: `Katalog (${stats.totalProducts})` },
    { key: 'customers', icon: <Users className="h-5 w-5" />, label: 'Pelanggan' },
    { key: 'chat', icon: <MessageSquare className="h-5 w-5" />, label: 'Chat Pelanggan' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA] font-sans">
      {/* ── SIDEBAR ── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#1B2559] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Karisma<span className="text-[#FA8232]">Admin</span>
            </span>
            <p className="text-[10px] text-blue-300 mt-0.5">Panel Manajemen Toko</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FA8232] to-orange-600 font-bold text-sm text-white shadow">
              {(userProfile.nama || userProfile.email)?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{userProfile.nama || 'Admin'}</p>
              <p className="text-[10px] text-blue-300 truncate">{userProfile.email}</p>
            </div>
          </div>
          <div className="mt-2">
            {userProfile.role === 'owner' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                <Crown className="h-3 w-3" /> Owner / Superadmin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                <ShieldCheck className="h-3 w-3" /> Admin Toko
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400/60">Menu Utama</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === item.key
                  ? 'bg-[#FA8232] text-white shadow-lg shadow-orange-900/30'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                  {item.badge}
                </span>
              )}
              {activeTab === item.key && <ChevronRight className="h-4 w-4 opacity-70" />}
            </button>
          ))}

          <div className="pt-4">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400/60">Toko</p>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <Home className="h-5 w-5" />
              <span>Buka Toko Depan</span>
              <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-50" />
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <Settings className="h-5 w-5" />
              <span>Pengaturan Akun</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900">
                {activeTab === 'overview' && 'Ringkasan Dashboard'}
                {activeTab === 'orders' && 'Kelola Pesanan'}
                {activeTab === 'products' && 'Katalog Produk'}
                {activeTab === 'customers' && 'Data Pelanggan'}
                {activeTab === 'chat' && 'Pusat Chat Pelanggan'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              {stats.pendingOrders > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Pendapatan',
                    value: formatRupiah(stats.totalRevenue),
                    sub: 'Order selesai & lunas',
                    icon: <DollarSign className="h-5 w-5" />,
                    color: 'from-emerald-500 to-teal-600',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                  },
                  {
                    label: 'Total Pesanan',
                    value: stats.totalOrders,
                    sub: 'Semua pesanan masuk',
                    icon: <ShoppingCart className="h-5 w-5" />,
                    color: 'from-blue-500 to-indigo-600',
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                  },
                  {
                    label: 'Perlu Diproses',
                    value: stats.pendingOrders,
                    sub: 'Menunggu konfirmasi',
                    icon: <Clock className="h-5 w-5" />,
                    color: 'from-amber-500 to-orange-600',
                    bg: 'bg-amber-50',
                    text: 'text-amber-600',
                  },
                  {
                    label: 'Sedang Dikirim',
                    value: stats.shippedOrders,
                    sub: 'Dalam perjalanan',
                    icon: <Truck className="h-5 w-5" />,
                    color: 'from-purple-500 to-violet-600',
                    bg: 'bg-purple-50',
                    text: 'text-purple-600',
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.text}`}>
                        {card.icon}
                      </div>
                      <TrendingUp className="h-4 w-4 text-gray-300" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{card.value}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1">{card.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section: Sales Details Area/Line Chart & Order Status Donut Chart */}
              <AdminCharts orders={orders} stats={stats} />

              {/* Recent Orders Table */}
              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Pesanan Masuk Terbaru</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Transaksi terbaru yang membutuhkan respon toko</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-1 text-xs font-bold text-[#FA8232] hover:text-orange-700"
                  >
                    Lihat Semua <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <tr>
                        <th className="px-5 py-3">No. Transaksi</th>
                        <th className="px-5 py-3">Penerima</th>
                        <th className="px-5 py-3">Total</th>
                        <th className="px-5 py-3">Status Order</th>
                        <th className="px-5 py-3">Pembayaran</th>
                        <th className="px-5 py-3">Waktu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 8).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3 font-mono font-bold text-gray-900">{o.notransaksi}</td>
                          <td className="px-5 py-3">
                            <div className="font-semibold text-gray-800">{o.nama_penerima}</div>
                            <div className="text-[10px] text-gray-400">{o.telepon_penerima}</div>
                          </td>
                          <td className="px-5 py-3 font-bold text-emerald-700">{formatRupiah(o.total_akhir)}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[o.status_order] || 'bg-gray-100 text-gray-700'}`}>
                              {STATUS_LABEL[o.status_order] || o.status_order}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${PAY_COLORS[o.status_pembayaran] || 'bg-gray-100 text-gray-600'}`}>
                              {PAY_LABEL[o.status_pembayaran] || o.status_pembayaran}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-400">{formatDate(o.created_at)}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Belum ada pesanan masuk.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: ORDERS MANAGEMENT ── */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {(['all', 'ordered', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                        orderFilter === status
                          ? 'bg-[#1B2559] text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {STATUS_LABEL[status]}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64 shrink-0 ml-auto">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Cari no. transaksi / nama..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]/20"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <tr>
                        <th className="px-5 py-3">No. Transaksi</th>
                        <th className="px-5 py-3">Pelanggan & Alamat</th>
                        <th className="px-5 py-3">Metode & Total</th>
                        <th className="px-5 py-3">Status Order</th>
                        <th className="px-5 py-3">Status Bayar</th>
                        <th className="px-5 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                            Tidak ada pesanan yang sesuai dengan filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3">
                              <span className="font-mono font-bold text-gray-900 block">{o.notransaksi}</span>
                              <span className="text-[10px] text-gray-400">{formatDate(o.created_at)}</span>
                            </td>
                            <td className="px-5 py-3 max-w-[200px]">
                              <p className="font-bold text-gray-900 truncate">{o.nama_penerima}</p>
                              <p className="text-[10px] text-gray-500">{o.telepon_penerima}</p>
                              <p className="text-[10px] text-gray-400 truncate">{o.alamat_kirim}</p>
                            </td>
                            <td className="px-5 py-3">
                              <p className="font-black text-emerald-700">{formatRupiah(o.total_akhir)}</p>
                              <span className="text-[10px] uppercase font-semibold text-gray-400">{o.metode_pembayaran}</span>
                            </td>
                            <td className="px-5 py-3">
                              <select
                                value={o.status_order}
                                disabled={updatingOrderId === o.id}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-800 focus:border-[#FA8232] focus:outline-none cursor-pointer"
                              >
                                <option value="ordered">Dipesan</option>
                                <option value="processing">Diproses</option>
                                <option value="shipped">Dikirim</option>
                                <option value="delivered">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                              </select>
                            </td>
                            <td className="px-5 py-3">
                              <select
                                value={o.status_pembayaran}
                                disabled={updatingOrderId === o.id}
                                onChange={(e) => handleUpdatePaymentStatus(o.id, e.target.value)}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-800 focus:border-[#FA8232] focus:outline-none cursor-pointer"
                              >
                                <option value="unpaid">Belum Bayar</option>
                                <option value="cash_pending">Tunai Menunggu</option>
                                <option value="paid">Lunas</option>
                              </select>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                              >
                                <Eye className="h-3.5 w-3.5" /> Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-fade-up max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Detail Pesanan #{selectedOrder.notransaksi}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Data Pembeli</p>
                        <p className="mt-1.5 font-bold text-gray-900">{selectedOrder.nama_penerima}</p>
                        <p className="text-gray-500">{selectedOrder.telepon_penerima}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Alamat Pengiriman</p>
                        <p className="mt-1.5 text-gray-700 leading-relaxed">{selectedOrder.alamat_kirim}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal Belanja:</span>
                        <span className="font-bold">{formatRupiah(selectedOrder.total_belanja)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ongkos Kirim:</span>
                        <span className="font-bold">{formatRupiah(selectedOrder.ongkir)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 text-sm">
                        <span className="font-bold text-gray-900">Total Akhir:</span>
                        <span className="font-black text-emerald-700">{formatRupiah(selectedOrder.total_akhir)}</span>
                      </div>
                    </div>

                    {selectedOrder.catatan && (
                      <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                        <span className="font-bold">Catatan Pembeli:</span> {selectedOrder.catatan}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[selectedOrder.status_order] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABEL[selectedOrder.status_order] || selectedOrder.status_order}
                        </span>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${PAY_COLORS[selectedOrder.status_pembayaran] || 'bg-gray-100 text-gray-600'}`}>
                          {PAY_LABEL[selectedOrder.status_pembayaran] || selectedOrder.status_pembayaran}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="rounded-xl bg-[#1B2559] px-5 py-2 text-xs font-bold text-white hover:bg-[#243070]"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: PRODUCTS CATALOG ── */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Katalog Stok & Harga</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Total {products.length} produk terdaftar</p>
                </div>
                <div className="relative w-full sm:w-72 shrink-0">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari nama atau kode produk..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs focus:border-[#FA8232] focus:outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <tr>
                        <th className="px-5 py-3">Produk</th>
                        <th className="px-5 py-3">Kode Item</th>
                        <th className="px-5 py-3">Satuan</th>
                        <th className="px-5 py-3">Harga Jual</th>
                        <th className="px-5 py-3">Stok</th>
                        <th className="px-5 py-3 text-right">Lihat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.slice(0, 50).map((p) => (
                        <tr key={p.kodeitem} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3 font-semibold text-gray-900 max-w-xs truncate">{p.namaitem}</td>
                          <td className="px-5 py-3 font-mono text-gray-400">{p.kodeitem}</td>
                          <td className="px-5 py-3 text-gray-500">{p.satuan || 'PCS'}</td>
                          <td className="px-5 py-3 font-bold text-emerald-700">{formatRupiah(p.hargajual1)}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${(p.stok ?? 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {p.stok ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              href={`/products/${p.kodeitem}`}
                              target="_blank"
                              className="text-xs font-bold text-[#FA8232] hover:text-orange-700 inline-flex items-center gap-1"
                            >
                              Lihat <ExternalLink className="h-3 w-3" />
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

          {/* ── TAB 4: CUSTOMERS ── */}
          {activeTab === 'customers' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Daftar Pelanggan Terdaftar</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{customers.length} akun pelanggan</p>
                  </div>
                  <button
                    onClick={loadCustomers}
                    disabled={loadingCustomers}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingCustomers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {loadingCustomers ? (
                  <div className="flex justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FA8232] border-t-transparent" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <tr>
                          <th className="px-5 py-3">Nama</th>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3">Role</th>
                          <th className="px-5 py-3">Telepon</th>
                          <th className="px-5 py-3">Terdaftar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customers.length === 0 ? (
                          <tr><td colSpan={5} className="px-5 py-16 text-center text-gray-400">Tidak ada data pelanggan.</td></tr>
                        ) : (
                          customers.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B2559] text-white font-bold text-xs shrink-0">
                                    {c.nama?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <span className="font-semibold text-gray-900">{c.nama || '—'}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3 text-gray-500">{c.email || '—'}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                                  c.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {c.role || 'buyer'}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-gray-500">{c.telepon || '—'}</td>
                              <td className="px-5 py-3 text-gray-400">{c.created_at ? formatDate(c.created_at) : '—'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 5: CUSTOMER CHAT CENTER ── */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm min-h-[560px]">
              {/* Conversation List */}
              <div className="md:col-span-4 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Percakapan Pembeli</h3>
                    <p className="text-[11px] text-gray-400">Pesan dari pelanggan toko</p>
                  </div>
                  <button
                    onClick={loadConversations}
                    disabled={loadingChat}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
                    title="Refresh Chat"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingChat ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">Belum ada percakapan masuk dari pembeli.</div>
                  ) : (
                    conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectConversation(c)}
                        className={`w-full text-left p-3.5 transition-colors flex items-center gap-3 ${
                          selectedConv?.id === c.id ? 'bg-[#FA8232]/10 border-l-4 border-[#FA8232]' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B2559] font-bold text-xs text-white">
                          {c.customer?.nama?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 truncate">{c.customer?.nama || c.customer?.email || 'Pelanggan'}</span>
                            {c.unread_count && c.unread_count > 0 ? (
                              <span className="h-2 w-2 rounded-full bg-[#FA8232]" />
                            ) : null}
                          </div>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5">{c.last_message}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Active Chat */}
              <div className="md:col-span-8 flex flex-col h-[560px]">
                {selectedConv ? (
                  <>
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B2559] text-white font-bold text-xs">
                        {selectedConv.customer?.nama?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{selectedConv.customer?.nama || 'Pelanggan'}</h4>
                        <p className="text-[11px] text-gray-400">{selectedConv.customer?.email}</p>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-16 text-xs text-gray-400">Belum ada pesan dalam percakapan ini.</div>
                      ) : (
                        chatMessages.map((m) => {
                          const isMe = m.sender_id === userProfile.id
                          return (
                            <div key={m.id} className={`flex gap-2 items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                                isMe
                                  ? 'rounded-br-sm bg-[#FA8232] text-white'
                                  : 'rounded-bl-sm bg-white text-gray-800 border border-gray-100'
                              }`}>
                                <p className="whitespace-pre-wrap break-words">{m.pesan}</p>
                                <span className={`block text-right text-[9px] mt-1 ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                                  {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <form onSubmit={handleSendAdminReply} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                      <input
                        type="text"
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        placeholder="Balas pesan pelanggan sebagai Karisma Care..."
                        className="flex-1 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 text-xs focus:border-[#FA8232] focus:bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!adminReply.trim() || sendingReply}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FA8232] text-white hover:bg-orange-600 disabled:opacity-50 transition-all"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                    <MessageSquare className="h-10 w-10 text-gray-200" />
                    <p className="text-xs">Pilih salah satu percakapan untuk melihat pesan.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
