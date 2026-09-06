import { createClient } from '@/lib/supabase/client'
import { generateOrderNumber } from '@/lib/utils/format'
import type { CartLineItem } from './cart.service'
import type { Tables } from '@/types/database'

export interface CheckoutPayload {
  nama_penerima: string
  telepon_penerima: string
  alamat_kirim: string
  metode_pembayaran: 'bank_transfer' | 'qris' | 'cash'
  catatan?: string
  ongkir?: number
  items: CartLineItem[]
}

export interface OrderDetail extends Tables<'ecommerce_orders'> {
  items: Tables<'ecommerce_order_items'>[]
  payment_proofs?: Tables<'payment_proofs'>[]
}

/**
 * Create a new ecommerce order and its order items
 */
export async function createOrder(payload: CheckoutPayload): Promise<{ success: boolean; orderId?: string; notransaksi?: string; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu untuk menyelesaikan pesanan.' }
  }

  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: 'Keranjang belanja masih kosong.' }
  }

  const totalBelanja = payload.items.reduce((sum, i) => sum + i.subtotal, 0)
  const ongkir = payload.ongkir != null ? payload.ongkir : 15000 // Standar flat rate ongkir lokal
  const totalAkhir = totalBelanja + ongkir
  const notransaksi = generateOrderNumber()

  // 1. Insert order header
  const { data: order, error: orderError } = await supabase
    .from('ecommerce_orders')
    .insert({
      notransaksi,
      user_id: user.id,
      status_order: 'ordered',
      status_pembayaran: payload.metode_pembayaran === 'cash' ? 'cash_pending' : 'unpaid',
      status_pengiriman: 'pending',
      metode_pembayaran: payload.metode_pembayaran,
      total_belanja: totalBelanja,
      ongkir,
      total_akhir: totalAkhir,
      catatan: payload.catatan || null,
      nama_penerima: payload.nama_penerima,
      telepon_penerima: payload.telepon_penerima,
      alamat_kirim: payload.alamat_kirim,
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { success: false, error: orderError?.message || 'Gagal membuat pesanan.' }
  }

  // 2. Insert order items
  const orderItemsData = payload.items.map((item) => ({
    order_id: order.id,
    kodeitem: item.kodeitem,
    namaitem: item.product.namaitem,
    satuan: item.satuan,
    jumlah: item.quantity,
    harga_satuan: item.product.hargajual1,
    subtotal: item.subtotal,
  }))

  const { error: itemsError } = await supabase
    .from('ecommerce_order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
  }

  return {
    success: true,
    orderId: order.id,
    notransaksi: order.notransaksi,
  }
}

/**
 * Get all orders for the current logged in user
 */
export async function getUserOrders(): Promise<Tables<'ecommerce_orders'>[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('ecommerce_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  return data || []
}

/**
 * Get detailed order by ID including line items and payment proof
 */
export async function getOrderById(orderId: string): Promise<OrderDetail | null> {
  const supabase = createClient()

  const [orderRes, itemsRes, proofsRes] = await Promise.all([
    supabase.from('ecommerce_orders').select('*').eq('id', orderId).single(),
    supabase.from('ecommerce_order_items').select('*').eq('order_id', orderId),
    supabase.from('payment_proofs').select('*').eq('order_id', orderId),
  ])

  if (orderRes.error || !orderRes.data) {
    return null
  }

  return {
    ...orderRes.data,
    items: itemsRes.data || [],
    payment_proofs: proofsRes.data || [],
  }
}
