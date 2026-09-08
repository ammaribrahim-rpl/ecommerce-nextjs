import React from 'react'
import { getProducts } from '@/services/products.service'
import SearchClient from '@/components/search/SearchClient'

export const metadata = {
  title: 'Cari Produk - Karisma Store',
  description: 'Temukan produk grosir dengan pencarian cerdas dan auto rekomendasi kosakata.',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams
  const query = (resolvedParams.q || '').trim()

  const productsRes = await getProducts({
    search: query,
    limit: 36,
  })

  return (
    <SearchClient
      initialQuery={query}
      initialProducts={productsRes.data}
      totalCount={productsRes.total}
    />
  )
}
