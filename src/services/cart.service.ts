import { createClient } from '@/lib/supabase/client'
import { getProductByCode, type ProductItem } from './products.service'

export interface CartLineItem {
  id?: string
  kodeitem: string
  product: ProductItem
  quantity: number
  satuan: string
  subtotal: number
}

const LOCAL_STORAGE_KEY = 'karisma_store_cart'

/**
 * Get guest cart from localStorage
 */
export function getLocalCart(): { kodeitem: string; quantity: number; satuan: string }[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save guest cart to localStorage
 */
export function saveLocalCart(items: { kodeitem: string; quantity: number; satuan: string }[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('cart-updated'))
  } catch (e) {
    console.error('Failed to save cart to localStorage:', e)
  }
}

/**
 * Fetch cart items with full product details
 */
export async function getCartDetails(): Promise<CartLineItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let rawItems: { id?: string; kodeitem: string; quantity: number; satuan: string }[] = []

  if (user) {
    // User is logged in: fetch from database cart_items
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)

    if (!error && data) {
      rawItems = data.map((item) => ({
        id: item.id,
        kodeitem: item.kodeitem,
        quantity: Number(item.jumlah) || 1,
        satuan: item.satuan,
      }))
    }
  } else {
    // Guest: read from localStorage
    rawItems = getLocalCart()
  }

  // Fetch product detail for each item
  const detailedItems: CartLineItem[] = []
  for (const item of rawItems) {
    const { product } = await getProductByCode(item.kodeitem)
    if (product) {
      detailedItems.push({
        id: item.id,
        kodeitem: item.kodeitem,
        product,
        quantity: item.quantity,
        satuan: item.satuan || product.satuan || 'PCS',
        subtotal: item.quantity * product.hargajual1,
      })
    }
  }

  return detailedItems
}

/**
 * Add item to cart
 */
export async function addToCart(product: ProductItem, quantity = 1): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const satuan = product.satuan || 'PCS'

  if (user) {
    // Check if already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('kodeitem', product.kodeitem)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({
          jumlah: Number(existing.jumlah) + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('cart_items').insert({
        user_id: user.id,
        kodeitem: product.kodeitem,
        satuan,
        jumlah: quantity,
      })
    }
  } else {
    // Local storage for guests
    const items = getLocalCart()
    const index = items.findIndex((i) => i.kodeitem === product.kodeitem)
    if (index >= 0) {
      items[index].quantity += quantity
    } else {
      items.push({
        kodeitem: product.kodeitem,
        quantity,
        satuan,
      })
    }
    saveLocalCart(items)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'))
  }
}

/**
 * Update quantity of item in cart
 */
export async function updateCartQuantity(kodeitem: string, quantity: number, id?: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (quantity <= 0) {
    return removeFromCart(kodeitem, id)
  }

  if (user && id) {
    await supabase
      .from('cart_items')
      .update({ jumlah: quantity, updated_at: new Date().toISOString() })
      .eq('id', id)
  } else {
    const items = getLocalCart()
    const index = items.findIndex((i) => i.kodeitem === kodeitem)
    if (index >= 0) {
      items[index].quantity = quantity
      saveLocalCart(items)
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'))
  }
}

/**
 * Remove an item from cart
 */
export async function removeFromCart(kodeitem: string, id?: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user && id) {
    await supabase.from('cart_items').delete().eq('id', id)
  } else {
    const items = getLocalCart().filter((i) => i.kodeitem !== kodeitem)
    saveLocalCart(items)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'))
  }
}

/**
 * Clear the entire cart
 */
export async function clearCart(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.from('cart_items').delete().eq('user_id', user.id)
  } else {
    saveLocalCart([])
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart-updated'))
  }
}
