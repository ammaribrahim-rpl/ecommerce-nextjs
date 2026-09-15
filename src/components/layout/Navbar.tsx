'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  MapPin,
  GitCompare,
  Headphones,
  HelpCircle,
  LogOut,
  ShieldCheck,
  PackageCheck,
  Check,
  Globe,
} from 'lucide-react'
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons'
import CliconLogo from '@/components/shared/CliconLogo'
import { getLocalCart } from '@/services/cart.service'
import { getCategories, type CategoryItem } from '@/services/categories.service'
import { createClient } from '@/lib/supabase/client'
import { formatRupiah } from '@/lib/utils/format'
import { useLanguage, SUPPORTED_LANGUAGES, type Language } from '@/contexts/LanguageContext'

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
  const { language, setLanguage, t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('jenis') || '')
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currency, setCurrency] = useState('IDR')

  const cartCount = React.useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot)
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    // Fetch categories
    getCategories().then((cats) => {
      setCategories(cats)
    })

    // Check auth user
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nama, role')
          .eq('id', data.user.id)
          .maybeSingle()

        setUser({
          email: data.user.email,
          name: profile?.nama || data.user.user_metadata?.nama || data.user.email?.split('@')[0],
          role: profile?.role || 'buyer',
        })
      }
    })
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false)
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchTerm.trim()
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (selectedCategory) params.set('jenis', selectedCategory)

    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/auth/login'
  }

  return (
    <header className="w-full flex flex-col z-40 sticky top-0 shadow-sm">
      {/* ── 1. TOP BAR (Welcome, Socials, Lang & Currency) ── */}
      <div className="bg-[#1B6392] text-white/90 border-b border-white/10 text-xs py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="font-normal tracking-wide">
            {t('nav.welcome')}
          </p>

          <div className="flex items-center gap-5">
            {/* Follow Us */}
            <div className="flex items-center gap-3 text-white/80">
              <span className="text-white/70">{t('nav.follow')}</span>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <TwitterIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="h-3 w-px bg-white/20" />

            {/* Language & Currency */}
            <div className="flex items-center gap-4 text-white">
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer text-xs font-medium py-1 px-2 rounded-md hover:bg-white/10"
                  aria-label="Pilih Bahasa"
                >
                  <span className="text-sm">{activeLang.flag}</span>
                  <span>{activeLang.label}</span>
                  <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white py-1.5 text-xs text-[#191C1F] shadow-2xl border border-gray-100 z-50 animate-fade-in">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      <span>{t('nav.language')}</span>
                    </div>
                    {SUPPORTED_LANGUAGES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code)
                          setLangDropdownOpen(false)
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                          language === item.code ? 'font-bold text-[#FA8232] bg-orange-50/60' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.flag}</span>
                          <span>{item.label}</span>
                        </div>
                        {language === item.code ? (
                          <Check className="h-3.5 w-3.5 text-[#FA8232]" />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-mono">{item.sublabel}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Currency Selector */}
              <button
                type="button"
                onClick={() => setCurrency(currency === 'IDR' ? 'USD' : 'IDR')}
                className="flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer font-semibold py-1 px-2 rounded-md hover:bg-white/10"
              >
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MIDDLE BAR (Logo, Search, Wishlist, Cart, User) ── */}
      <div className="bg-[#1B6392] py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-1 hover:bg-white/10 rounded cursor-pointer"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <CliconLogo variant="white" />
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-2xl items-center bg-white rounded-xs shadow-xs overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              className="flex-1 px-4 py-2.5 text-sm text-[#191C1F] placeholder-gray-400 outline-hidden bg-transparent"
            />

            {/* Category selection */}
            <div className="border-l border-gray-200 px-3 py-1.5 hidden md:flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-medium text-[#475156] bg-transparent outline-hidden cursor-pointer max-w-[130px] truncate"
              >
                <option value="">{t('nav.all_categories')}</option>
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#FA8232] hover:bg-[#de732d] text-white px-5 py-2.5 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Cari produk"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Right Action Icons (Cart, Wishlist, User) */}
          <div className="flex items-center gap-3 sm:gap-6 text-white">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 hover:text-white/80 transition-colors flex items-center"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1B6392]">
                0
              </span>
            </Link>

            {/* Shopping Cart Link */}
            <Link
              href="/cart"
              className="flex items-center gap-3 p-1.5 hover:text-white/80 transition-colors group cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#FA8232] text-[10px] font-bold text-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left text-xs leading-tight">
                <span className="text-white/70 text-[11px]">{t('nav.shopping_cart')}</span>
                <span className="font-bold text-white tracking-wide">
                  {cartCount > 0 ? `${cartCount} ${t('nav.items')}` : 'Rp 0'}
                </span>
              </div>
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 hover:text-white/80 transition-colors cursor-pointer"
                    aria-label="Profil pengguna"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white font-bold text-xs uppercase border border-white/20">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:inline text-xs font-semibold max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 hidden lg:inline opacity-70" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-2 text-sm text-[#191C1F] shadow-xl border border-gray-100 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {(user.role === 'admin' || user.role === 'owner') && (
                          <span className="mt-1 inline-block text-[10px] uppercase font-bold text-[#1B6392] bg-blue-50 px-2 py-0.5 rounded">
                            Admin Access
                          </span>
                        )}
                      </div>

                      {(user.role === 'admin' || user.role === 'owner') && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1B6392] hover:bg-blue-50 transition-colors"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>{t('nav.admin_dashboard')}</span>
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <PackageCheck className="h-4 w-4" />
                        <span>{t('nav.my_orders')}</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>{t('nav.account_settings')}</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false)
                          handleLogout()
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100 mt-1 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 p-1.5 hover:text-white/80 transition-colors"
                  aria-label="Masuk Akun"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:inline text-xs font-medium">{t('nav.sign_in')}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 flex sm:hidden items-center bg-white rounded-xs overflow-hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('nav.search_placeholder')}
            className="flex-1 px-3 py-2 text-xs text-[#191C1F] outline-hidden"
          />
          <button type="submit" className="bg-[#FA8232] text-white px-4 py-2" aria-label="Cari">
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* ── 3. BOTTOM NAV (All Categories, Navigation Links, Hotline) ── */}
      <div className="bg-white border-b border-[#E4E7E9] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between py-2.5 sm:py-3">
          {/* All Category dropdown button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center justify-between gap-3 bg-[#F2F4F5] hover:bg-gray-200 text-[#191C1F] font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xs transition-colors cursor-pointer min-w-[180px]"
              aria-label="Semua Kategori"
            >
              <span>{t('nav.all_category_btn')}</span>
              <ChevronDown
                className={`h-4 w-4 text-[#191C1F] transition-transform duration-200 ${
                  categoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Category Dropdown Content */}
            {categoryDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xs bg-white py-2 shadow-xl border border-gray-200 z-50 animate-fade-in max-h-96 overflow-y-auto">
                <Link
                  href="/products"
                  onClick={() => setCategoryDropdownOpen(false)}
                  className="block px-4 py-2 text-xs font-semibold text-[#FA8232] hover:bg-orange-50 border-b border-gray-100"
                >
                  {t('nav.see_all_categories')}
                </Link>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.code}
                      href={`/products?jenis=${encodeURIComponent(cat.code)}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-[#475156] hover:text-[#FA8232] hover:bg-gray-50 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-gray-400">{t('nav.loading_categories')}</div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs sm:text-sm font-medium text-[#5F6C72]">
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-[#FA8232] transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>{t('nav.track_order')}</span>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 hover:text-[#FA8232] transition-colors"
            >
              <GitCompare className="h-4 w-4" />
              <span>{t('nav.compare')}</span>
            </Link>

            <Link
              href="/customer-support"
              className="flex items-center gap-1.5 hover:text-[#FA8232] transition-colors"
            >
              <Headphones className="h-4 w-4" />
              <span>{t('nav.customer_support')}</span>
            </Link>

            <Link
              href="/faqs"
              className="flex items-center gap-1.5 hover:text-[#FA8232] transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>{t('nav.need_help')}</span>
            </Link>
          </nav>

          {/* Right Phone Hotline */}
          <div className="flex items-center gap-2 text-[#191C1F] text-xs sm:text-sm font-bold">
            <PhoneCall className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#FA8232]" />
            <a href="tel:+12025550104" className="hover:text-[#FA8232] transition-colors tracking-wide">
              +1-202-555-0104
            </a>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-2 text-xs font-medium text-[#475156] animate-fade-in">
            {/* Mobile Language Selector */}
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{t('nav.language')}:</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      language === item.code
                        ? 'bg-[#FA8232] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-100 font-semibold text-gray-900"
            >
              {t('nav.all_products')}
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
            >
              <MapPin className="h-3.5 w-3.5 text-[#FA8232]" />
              <span>{t('nav.track_order')}</span>
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
            >
              <GitCompare className="h-3.5 w-3.5 text-[#FA8232]" />
              <span>{t('nav.compare')}</span>
            </Link>
            <Link
              href="/customer-support"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
            >
              <Headphones className="h-3.5 w-3.5 text-[#FA8232]" />
              <span>{t('nav.customer_support')}</span>
            </Link>
            <Link
              href="/faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#FA8232]" />
              <span>{t('nav.need_help')}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
