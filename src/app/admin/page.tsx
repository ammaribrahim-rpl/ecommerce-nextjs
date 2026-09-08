import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export const metadata = {
  title: 'Dashboard Admin & Owner - Karisma Store',
  description: 'Kelola pesanan, katalog produk, dan layanan pelanggan Karisma Store.',
}

export default async function AdminPage() {
  const supabase = await createClient()

  // 1. Check Authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/admin')
  }

  // 2. Check Role (Owner / Admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role || 'buyer'

  if (role !== 'admin' && role !== 'owner') {
    // User bukan admin/owner -> tolak akses dan arahkan ke profile
    redirect('/profile')
  }

  // 3. Fetch Orders
  const { data: orders } = await supabase
    .from('ecommerce_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // 4. Fetch Products
  const { data: products } = await supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, hargajual1, stok, satuan, jenis, statusjual')
    .limit(100)

  const allOrders = orders || []
  const allProducts = products || []

  // Compute Metrics
  const totalRevenue = allOrders
    .filter((o) => o.status_pembayaran === 'paid' || o.status_order === 'delivered')
    .reduce((sum, o) => sum + (Number(o.total_akhir) || 0), 0)

  const totalOrders = allOrders.length
  const pendingOrders = allOrders.filter((o) => o.status_order === 'ordered').length
  const processingOrders = allOrders.filter((o) => o.status_order === 'processing').length
  const shippedOrders = allOrders.filter((o) => o.status_order === 'shipped').length
  const deliveredOrders = allOrders.filter((o) => o.status_order === 'delivered').length

  const stats = {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    totalProducts: allProducts.length,
  }

  const userProfile = {
    id: user.id,
    email: user.email || '',
    nama: profile?.nama || user.email?.split('@')[0] || 'Admin',
    role: role,
  }

  return (
    <AdminDashboardClient
      initialOrders={allOrders}
      initialProducts={allProducts}
      stats={stats}
      userProfile={userProfile}
    />
  )
}
