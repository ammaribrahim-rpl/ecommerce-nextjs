import React from 'react'
import Link from 'next/link'
import { getProducts, type ProductFilters } from '@/services/products.service'
import { getCategories, getBrands } from '@/services/categories.service'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilter from '@/components/products/ProductFilter'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Katalog Produk - Karisma Store',
  description: 'Jelajahi seluruh produk pilihan berkualitas di Karisma Store dengan filter kategori dan merek.',
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    jenis?: string
    merek?: string
    sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest'
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // In Next.js 16, searchParams must be awaited
  const resolvedParams = await searchParams

  const page = parseInt(resolvedParams.page || '1', 10)
  const limit = 16

  const filters: ProductFilters = {
    page,
    limit,
    search: resolvedParams.search,
    jenis: resolvedParams.jenis,
    merek: resolvedParams.merek,
    sort: resolvedParams.sort,
  }

  const [productsRes, categories, brands] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getBrands(),
  ])

  // Helper to build pagination link
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    if (resolvedParams.search) params.set('search', resolvedParams.search)
    if (resolvedParams.jenis) params.set('jenis', resolvedParams.jenis)
    if (resolvedParams.merek) params.set('merek', resolvedParams.merek)
    if (resolvedParams.sort) params.set('sort', resolvedParams.sort)
    params.set('page', targetPage.toString())
    return `/products?${params.toString()}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-emerald-600">Beranda</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Katalog Produk</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Katalog Produk</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{productsRes.data.length}</span> dari{' '}
            <span className="font-semibold text-emerald-700">{productsRes.total.toLocaleString('id-ID')}</span> produk
          </p>
        </div>
      </div>

      {/* Grid Layout: Filters + Product Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ProductFilter categories={categories} brands={brands} />
        </div>

        {/* Product Grid & Pagination */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid
            products={productsRes.data}
            emptyMessage="Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih. Silakan coba kata kunci lain atau reset filter."
          />

          {/* Pagination Controls */}
          {productsRes.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
              {/* Prev Button */}
              {productsRes.page > 1 ? (
                <Link
                  href={createPageUrl(productsRes.page - 1)}
                  className="flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-300 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </span>
              )}

              {/* Current Page Indicator */}
              <div className="flex items-center gap-1 px-3 text-xs font-medium text-gray-700">
                Halaman <span className="font-bold text-emerald-700 mx-1">{productsRes.page}</span> dari {productsRes.totalPages}
              </div>

              {/* Next Button */}
              {productsRes.page < productsRes.totalPages ? (
                <Link
                  href={createPageUrl(productsRes.page + 1)}
                  className="flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-300 cursor-not-allowed">
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
