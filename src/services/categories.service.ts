import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'

export interface CategoryItem {
  id: string
  name: string
  code: string
  description?: string | null
}

export interface BrandItem {
  code: string
  name: string
}

/**
 * Fetch list of item categories (from tbl_itemjenis)
 */
export async function getCategories(): Promise<CategoryItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tbl_itemjenis')
    .select('jenis, ketjenis')
    .order('ketjenis', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data || []).map((item) => ({
    id: item.jenis,
    code: item.jenis,
    name: item.ketjenis || item.jenis,
  }))
}

/**
 * Fetch list of top item brands (from tbl_itemmerek)
 */
export async function getBrands(): Promise<BrandItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tbl_itemmerek')
    .select('merek, ketmerek')
    .not('merek', 'is', null)
    .order('ketmerek', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return (data || []).map((item) => ({
    code: item.merek,
    name: item.ketmerek || item.merek,
  }))
}

/**
 * Fetch showcase ecommerce categories with icons/images
 */
export async function getEcommerceCategories(): Promise<Tables<'ecommerce_categories'>[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ecommerce_categories')
    .select('*')
    .order('urutan', { ascending: true })

  if (error) {
    console.error('Error fetching ecommerce categories:', error)
    return []
  }

  return data || []
}
