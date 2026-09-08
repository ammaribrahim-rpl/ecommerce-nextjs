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
  unitOptions?: ProductUnitOption[]
}

export interface ProductUnitOption {
  satuan: string
  hargajual: number
  label?: string
  isi?: number
  isDefault?: boolean
  kodeitem?: string
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
  if (nameLower.includes('makan') || jenisLower.includes('mkn') || jenisLower.includes('food') || nameLower.includes('gula') || nameLower.includes('kopi')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
  }
  if (nameLower.includes('shampoo') || nameLower.includes('sabun') || nameLower.includes('skincare') || nameLower.includes('lactacyd') || nameLower.includes('detergent') || nameLower.includes('royale') || nameLower.includes('daia')) {
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
 * Fetch products with intelligent multi-word search, filtering, sorting and pagination
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const supabase = createClient()
  const page = Math.max(1, filters.page || 1)
  const limit = Math.max(1, filters.limit || 24)
  const offset = (page - 1) * limit

  let query = supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, jenis, merek, satuan, hargajual1, hargapokok, stok, keterangan, statusjual, tbl_itemjenis(ketjenis), tbl_itemmerek(ketmerek)', { count: 'exact' })
    .eq('statusjual', 'Y')

  // Cerdas multi-word search: jika pencarian "abc kopi", cocokkan item yang mengandung "abc" DAN "kopi"
  if (filters.search && filters.search.trim()) {
    const rawTerm = filters.search.trim()
    const words = rawTerm.split(/\s+/).filter(w => w.length > 0)

    if (words.length === 1) {
      const term = words[0]
      query = query.or(`namaitem.ilike.%${term}%,kodeitem.ilike.%${term}%`)
    } else {
      // Untuk multi kata: setiap kata harus ada di namaitem (ilike berantai)
      words.forEach((word) => {
        query = query.ilike('namaitem', `%${word}%`)
      })
    }
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
 * Mengambil rekomendasi auto-suggest saat pembeli mengetik di search bar
 */
export async function getSearchSuggestions(keyword: string): Promise<string[]> {
  if (!keyword || keyword.trim().length < 2) return []
  const supabase = createClient()
  const term = keyword.trim()

  const { data } = await supabase
    .from('tbl_item')
    .select('namaitem')
    .eq('statusjual', 'Y')
    .ilike('namaitem', `%${term}%`)
    .limit(8)

  if (!data) return []

  const suggestions: string[] = []
  const seen = new Set<string>()

  data.forEach((item) => {
    if (item.namaitem && !seen.has(item.namaitem)) {
      seen.add(item.namaitem)
      suggestions.push(item.namaitem)
    }
  })

  return suggestions
}

/**
 * Ambil daftar satuan jual untuk suatu produk (PCS, KRTN, DUS, RENCENG, BALL, dll)
 * Menggabungkan data dari tbl_item, tbl_itemhj, dan produk saudara jika ada
 */
export async function getProductUnitOptions(
  kodeitem: string,
  namaitem: string,
  defaultSatuan: string,
  defaultHarga: number
): Promise<ProductUnitOption[]> {
  const supabase = createClient()
  const unitsMap = new Map<string, ProductUnitOption>()

  // 1. Masukkan satuan bawaan dari tbl_item
  const normDefSat = (defaultSatuan || 'PCS').toUpperCase()
  unitsMap.set(normDefSat, {
    satuan: normDefSat,
    hargajual: defaultHarga,
    isDefault: true,
    kodeitem: kodeitem,
    label: normDefSat === 'PCS' ? 'PCS (Satuan)' : normDefSat,
  })

  // 2. Ambil semua satuan dan harga dari tbl_itemhj
  const { data: hjData } = await supabase
    .from('tbl_itemhj')
    .select('satuan, hargajual, tipehj, level')
    .eq('kodeitem', kodeitem)
    .gt('hargajual', 0)

  if (hjData && hjData.length > 0) {
    hjData.forEach((row) => {
      if (row.satuan && row.hargajual) {
        const satUpper = row.satuan.toUpperCase().trim()
        const price = Number(row.hargajual)
        
        if (!unitsMap.has(satUpper) || (unitsMap.get(satUpper)?.hargajual || 0) < price) {
          let label = satUpper
          if (satUpper === 'KRTN' || satUpper === 'KARTON' || satUpper === 'CTN') {
            label = 'KARTON / DUS'
          } else if (satUpper === 'RCG' || satUpper === 'RENCENG') {
            label = 'RENCENG'
          } else if (satUpper === 'BALL' || satUpper === 'BAL') {
            label = 'BALL'
          } else if (satUpper === 'PAK') {
            label = 'PAK'
          }

          unitsMap.set(satUpper, {
            satuan: satUpper,
            hargajual: price,
            label,
            kodeitem: kodeitem,
            isDefault: satUpper === normDefSat,
          })
        }
      }
    })
  }

  // 3. Cari kemungkinan produk saudara di tbl_item (misal varian RCG, DUS, KRTN yang terdaftar terpisah)
  // Ambil kata kunci utama dari nama produk (3 kata pertama)
  const words = (namaitem || '').replace(/[\(\)\/\-]/g, ' ').split(/\s+/).filter(w => w.length > 2)
  if (words.length >= 2) {
    const prefix1 = words[0]
    const prefix2 = words[1]
    const { data: siblings } = await supabase
      .from('tbl_item')
      .select('kodeitem, namaitem, satuan, hargajual1')
      .ilike('namaitem', `%${prefix1}%`)
      .ilike('namaitem', `%${prefix2}%`)
      .neq('kodeitem', kodeitem)
      .gt('hargajual1', 0)
      .limit(6)

    if (siblings && siblings.length > 0) {
      siblings.forEach((sib) => {
        const sibSat = (sib.satuan || '').toUpperCase().trim()
        const sibNameUpper = (sib.namaitem || '').toUpperCase()
        
        let detectedUnit = sibSat
        if (sibNameUpper.includes('KARTON') || sibNameUpper.includes('KRTN') || sibNameUpper.includes('DUS')) {
          detectedUnit = 'KRTN'
        } else if (sibNameUpper.includes('RENCENG') || sibNameUpper.includes('RCG')) {
          detectedUnit = 'RENCENG'
        } else if (sibNameUpper.includes('BALL') || sibNameUpper.includes('BAL')) {
          detectedUnit = 'BALL'
        }

        if (detectedUnit && !unitsMap.has(detectedUnit) && sib.hargajual1) {
          unitsMap.set(detectedUnit, {
            satuan: detectedUnit,
            hargajual: Number(sib.hargajual1),
            label: detectedUnit,
            kodeitem: sib.kodeitem,
            isDefault: false,
          })
        }
      })
    }
  }

  // Konversi ke array dan urutkan: PCS -> RENCENG -> PAK -> KRTN / DUS -> BALL
  const orderPriority: Record<string, number> = {
    PCS: 1,
    RCG: 2,
    RENCENG: 2,
    PAK: 3,
    DUS: 4,
    KRTN: 4,
    KARTON: 4,
    CTN: 4,
    BALL: 5,
    BAL: 5,
  }

  return Array.from(unitsMap.values()).sort((a, b) => {
    const pA = orderPriority[a.satuan] || 99
    const pB = orderPriority[b.satuan] || 99
    if (pA !== pB) return pA - pB
    return a.hargajual - b.hargajual
  })
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
 * Fetch a single product by its item code (kodeitem) with unit options
 */
export async function getProductByCode(kodeitem: string): Promise<{
  product: ProductItem | null
  stockLocations: Tables<'tbl_itemstok'>[]
  unitOptions: ProductUnitOption[]
}> {
  const supabase = createClient()
  
  const { data: itemData, error } = await supabase
    .from('tbl_item')
    .select('kodeitem, namaitem, jenis, merek, satuan, hargajual1, hargapokok, stok, keterangan, statusjual')
    .eq('kodeitem', kodeitem)
    .single()

  if (error || !itemData) {
    return { product: null, stockLocations: [], unitOptions: [] }
  }

  const { data: stockData } = await supabase
    .from('tbl_itemstok')
    .select('*')
    .eq('kodeitem', kodeitem)

  const product = transformProduct(itemData)
  const unitOptions = await getProductUnitOptions(
    product.kodeitem,
    product.namaitem,
    product.satuan || 'PCS',
    product.hargajual1
  )

  return {
    product,
    stockLocations: stockData || [],
    unitOptions,
  }
}
