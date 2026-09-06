import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'

export interface ProductItem {
  kodeitem: string
  namaitem: string
  jenis: string | null
  jenis_nama: string | null
  merek: string | null
  merek_nama: string | null
  satuan: string | null
  hargajual1: number
  hargapokok: number | null
  stok: number
  keterangan: string | null
  statusjual: string | null
  imageUrl: string
}

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  jenis?: string
  merek?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest'
}

export interface ProductsResponse {
  data: ProductItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Returns a high-quality relevant placeholder image based on product category / brand
 */
export function getProductPlaceholderImage(nama: string, jenis?: string | null, merek?: string | null): string {
  const nameLower = (nama || '').toLowerCase()
  const jenisLower = (jenis || '').toLowerCase()

  if (nameLower.includes('susu') || nameLower.includes('promil') || nameLower.includes('procal') || jenisLower.includes('mnm')) {
    return 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80'
  }
  if (nameLower.includes('popok') || nameLower.includes('diaper') || jenisLower.includes('popok')) {
    return 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80'
  }
  if (nameLower.includes('botol') || nameLower.includes('empeng') || nameLower.includes('sisir') || (merek || '').includes('RELLIABLE')) {
    return 'https://images.unsplash.com/photo-1584839447470-f472856fae85?w=500&auto=format&fit=crop&q=80'
  }
  if (nameLower.includes('makan') || jenisLower.includes('mkn') || jenisLower.includes('food')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
  }
  if (nameLower.includes('shampoo') || nameLower.includes('sabun') || nameLower.includes('skincare') || nameLower.includes('lactacyd')) {
    return 'https://images.unsplash.com/photo-1608248597359-25095d36e897?w=500&auto=format&fit=crop&q=80'
  }
  // Default clean aesthetic product photo
  return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80'
}

interface RawProductData {
  kodeitem: string
  namaitem: string | null
  jenis: string | null
  merek: string | null
  satuan: string | null
  hargajual1: number | null
  hargapokok: number | null
  stok: number | null
  keterangan: string | null
  statusjual: string | null
  tbl_itemjenis?: { ketjenis?: string | null } | null
  tbl_itemmerek?: { ketmerek?: string | null } | null
}

function transformProduct(item: RawProductData): ProductItem {
  return {
    kodeitem: item.kodeitem,
    namaitem: item.namaitem || 'Produk Tanpa Nama',
    jenis: item.jenis,
    jenis_nama: item.tbl_itemjenis?.ketjenis || item.jenis,
    merek: item.merek,
    merek_nama: item.tbl_itemmerek?.ketmerek || item.merek,
    satuan: item.satuan,
    hargajual1: Number(item.hargajual1) || 0,
    hargapokok: item.hargapokok ? Number(item.hargapokok) : null,
    stok: Number(item.stok) || 0,
    keterangan: item.keterangan,
    statusjual: item.statusjual,
    imageUrl: getProductPlaceholderImage(item.namaitem || '', item.jenis, item.merek),
  }
}

/**
 * Fetch products with filtering, search, sorting and pagination
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const supabase = createClient()
  const page = Math.max(1, filters.page || 1)
  const limit = Math.max(1, filters.limit || 16)
  const offset = (page - 1) * limit

  let query = supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, jenis, merek, satuan, hargajual1, hargapokok, stok, keterangan, statusjual, tbl_itemjenis(ketjenis), tbl_itemmerek(ketmerek)', { count: 'exact' })
    .eq('statusjual', 'Y')
    .gt('hargajual1', 0)

  // Filter search
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim()
    query = query.or(`namaitem.ilike.%${term}%,kodeitem.ilike.%${term}%`)
  }

  // Filter category
  if (filters.jenis) {
    query = query.eq('jenis', filters.jenis)
  }

  // Filter brand
  if (filters.merek) {
    query = query.eq('merek', filters.merek)
  }

  // Filter price range
  if (filters.minPrice != null && filters.minPrice > 0) {
    query = query.gte('hargajual1', filters.minPrice)
  }
  if (filters.maxPrice != null && filters.maxPrice > 0) {
    query = query.lte('hargajual1', filters.maxPrice)
  }

  // Sorting
  switch (filters.sort) {
    case 'price_asc':
      query = query.order('hargajual1', { ascending: true })
      break
    case 'price_desc':
      query = query.order('hargajual1', { ascending: false })
      break
    case 'name_asc':
      query = query.order('namaitem', { ascending: true })
      break
    case 'newest':
    default:
      query = query.order('kodeitem', { ascending: false })
      break
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { data: [], total: 0, page, limit, totalPages: 0 }
  }

  const total = count || 0
  const products = (data || []).map(transformProduct)

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Fetch featured products for the homepage
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, jenis, merek, satuan, hargajual1, hargapokok, stok, keterangan, statusjual, tbl_itemjenis(ketjenis), tbl_itemmerek(ketmerek)')
    .eq('statusjual', 'Y')
    .gt('hargajual1', 0)
    .order('hargajual1', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return (data || []).map(transformProduct)
}

/**
 * Fetch a single product by its item code (kodeitem)
 */
export async function getProductByCode(kodeitem: string): Promise<{ product: ProductItem | null; stockLocations: Tables<'tbl_itemstok'>[] }> {
  const supabase = createClient()
  
  const { data: itemData, error } = await supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, jenis, merek, satuan, hargajual1, hargapokok, stok, keterangan, statusjual')
    .eq('kodeitem', kodeitem)
    .single()

  if (error || !itemData) {
    return { product: null, stockLocations: [] }
  }

  const { data: stockData } = await supabase
    .from('tbl_itemstok')
    .select('*')
    .eq('kodeitem', kodeitem)

  return {
    product: transformProduct(itemData),
    stockLocations: stockData || [],
  }
}
