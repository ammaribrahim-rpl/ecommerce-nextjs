'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingBag, Search, User, Menu, X, ShoppingCart } from 'lucide-react'
import { getLocalCart } from '@/services/cart.service'
import { createClient } from '@/lib/supabase/client'

function subscribeToCart(callback: () => void) {
  window.addEventListener('cart-updated', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('cart-updated', callback)
    window.removeEventListener('storage', callback)
  }
}

function getCartSnapshot(): number {
  const items = getLocalCart()
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

function getCartServerSnapshot(): number {
  return 0
}

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const cartCount = React.useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot)
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check auth user
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser({
          email: data.user.email,
          name: data.user.user_metadata?.nama || data.user.email?.split('@')[0],
        })
      }
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-1.5 text-center text-xs font-medium text-white">
        ✨ Gratis Ongkir & Layanan Pengiriman Cepat untuk Wilayah Lokal · Belanja Aman & Terpercaya
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm transition-transform group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Karisma<span className="text-emerald-600">Store</span>
            </span>
            <span className="hidden sm:block text-[10px] tracking-wider font-semibold uppercase text-gray-400">
              Toko Online Terpercaya
            </span>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari dari 5.700+ produk (cth: Morinaga, Popok, Susu)..."
              className="w-full rounded-full border border-gray-300 bg-gray-50/70 py-2.5 pl-4 pr-11 text-sm text-gray-900 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700 transition-colors"
              title="Cari"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Catalog Link */}
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Semua Produk
          </Link>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3.5 py-2 text-sm font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-700"
          >
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Login */}
          {user ? (
            <Link
              href="/orders"
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50/50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              Masuk
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 p-1.5 text-white"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Beranda
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              Katalog Semua Produk
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex justify-between items-center"
            >
              <span>Keranjang Belanja</span>
              {cartCount > 0 && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
              >
                Pesanan Saya
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
