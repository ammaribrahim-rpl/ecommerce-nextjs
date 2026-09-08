import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  User, Mail, Phone, ShieldCheck, Package,
  ArrowRight, LogOut, Settings, Clock, CheckCircle,
  Truck, XCircle, CreditCard, Crown, UserCheck
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatRupiah, formatDate } from '@/lib/utils/format'

export const metadata = {
  title: 'Profil Saya - Karisma Grosir',
  description: 'Kelola akun dan pantau riwayat pesanan Anda di Karisma Grosir.',
}

type Profile = {
  id: string
  email: string
  nama: string | null
  telepon: string | null
  role: string
  created_at: string | null
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    ordered:    { label: 'Dipesan',   cls: 'badge-blue',    icon: <Clock className="h-3 w-3" /> },
    processing: { label: 'Diproses',  cls: 'badge-orange',  icon: <Settings className="h-3 w-3" /> },
    shipped:    { label: 'Dikirim',   cls: 'badge-purple',  icon: <Truck className="h-3 w-3" /> },
    delivered:  { label: 'Diterima',  cls: 'badge-emerald', icon: <CheckCircle className="h-3 w-3" /> },
    cancelled:  { label: 'Dibatal',   cls: 'badge-red',     icon: <XCircle className="h-3 w-3" /> },
    unpaid:     { label: 'Belum Bayar', cls: 'badge-red',   icon: <CreditCard className="h-3 w-3" /> },
    paid:       { label: 'Lunas',     cls: 'badge-emerald', icon: <CheckCircle className="h-3 w-3" /> },
    cash_pending: { label: 'Tunai',   cls: 'badge-orange',  icon: <CreditCard className="h-3 w-3" /> },
  }
  const s = map[status] ?? { label: status, cls: 'badge-gray', icon: null }
  return (
    <span className={`badge ${s.cls} flex items-center gap-1`}>
      {s.icon}{s.label}
    </span>
  )
}

function getRoleIcon(role: string) {
  if (role === 'owner') return <Crown className="h-4 w-4 text-amber-500" />
  if (role === 'admin') return <ShieldCheck className="h-4 w-4 text-blue-500" />
  return <UserCheck className="h-4 w-4 text-emerald-500" />
}

function getRoleLabel(role: string) {
  if (role === 'owner') return 'Owner / Superadmin'
  if (role === 'admin') return 'Admin Toko'
  return 'Pelanggan'
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/profile')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch recent orders (last 5)
  const { data: orders } = await supabase
    .from('ecommerce_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalOrders = orders?.length ?? 0
  const totalSpend = orders?.reduce((sum, o) => sum + (o.total_akhir ?? 0), 0) ?? 0

  const displayName = (profile as Profile | null)?.nama || user.email?.split('@')[0] || 'Pengguna'
  const roleStr = (profile as Profile | null)?.role ?? 'buyer'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-up">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil Saya
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola informasi akun dan lihat riwayat pesanan Anda
          </p>
        </div>
        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Profile Card ───────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Avatar + Info */}
          <div className="card p-6 text-center space-y-4">
            {/* Avatar */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-3xl font-black shadow-lg shadow-emerald-200">
              {displayName[0]?.toUpperCase() ?? 'U'}
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">{displayName}</h2>
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500">
                {getRoleIcon(roleStr)}
                <span>{getRoleLabel(roleStr)}</span>
              </div>
            </div>

            <hr className="divider" />

            {/* Contact info */}
            <div className="space-y-2.5 text-left text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <span className="truncate">{user.email}</span>
              </div>
              {(profile as Profile | null)?.telepon && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <span>{(profile as Profile | null)?.telepon}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <span>Bergabung {formatDate((profile as Profile | null)?.created_at ?? user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">{totalOrders}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Total Pesanan</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-base font-black text-emerald-600">
                {totalSpend >= 1000000
                  ? `${(totalSpend / 1000000).toFixed(1)}jt`
                  : formatRupiah(totalSpend)}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Total Belanja</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card p-4 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Menu Cepat</p>
            <Link
              href="/orders"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Semua Pesanan</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Katalog Produk</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            {(roleStr === 'owner' || roleStr === 'admin') && (
              <Link
                href="/admin"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Dashboard Admin</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            )}
          </div>
        </div>

        {/* ── RIGHT: Recent Orders ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Pesanan Terbaru</h2>
            <Link
              href="/orders"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {(!orders || orders.length === 0) ? (
            <div className="card p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">Belum Ada Pesanan</h3>
              <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
                Mulai belanja sekarang dan semua pesanan Anda akan tampil di sini.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="card card-hover p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 block"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        #{order.notransaksi}
                      </span>
                      {getStatusBadge(order.status_order)}
                      {getStatusBadge(order.status_pembayaran)}
                    </div>
                    <p className="text-xs text-slate-400">
                      {formatDate(order.created_at)} · {order.nama_penerima}
                    </p>
                    <p className="text-sm font-bold text-emerald-700">
                      {formatRupiah(order.total_akhir)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                    <span>Detail</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
