import React from 'react'
import Link from 'next/link'
import { PhoneCall, Mail, MapPin } from 'lucide-react'
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons'

const TOP_CATEGORIES = [
  { name: 'Susu & Minuman', href: '/products?jenis=MNM' },
  { name: 'Popok & Bayi', href: '/products?jenis=POPOK' },
  { name: 'Perlengkapan Anak', href: '/products?jenis=PLKPN' },
  { name: 'Makanan & Biskuit', href: '/products?jenis=MKN' },
  { name: 'Kesehatan & Obat', href: '/products?jenis=HEALTH' },
  { name: 'Perawatan Kulit', href: '/products?jenis=SCINCARE' },
]

const QUICK_LINKS = [
  { name: 'Beranda', href: '/' },
  { name: 'Semua Produk', href: '/products' },
  { name: 'Keranjang Belanja', href: '/cart' },
  { name: 'Wishlist', href: '/wishlist' },
  { name: 'Status Pesanan', href: '/orders' },
  { name: 'Hubungi Kami', href: '/customer-support' },
]

const POPULAR_TAGS = [
  'Susu Formula', 'Popok', 'MPASI', 'Vitamin Anak', 'Sabun Bayi',
  'Perlengkapan Mandi', 'Skincare', 'Makanan Sehat',
]

const PAYMENT_METHODS = ['BCA Transfer', 'Mandiri', 'BRI', 'QRIS', 'COD']

export default function Footer() {
  return (
    <footer className="w-full bg-[#191C1F] text-white mt-auto">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Company Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Karisma<span className="text-[#FA8232]">Store</span>
              </span>
            </div>
            <p className="text-sm text-[#77878F] leading-relaxed">
              Platform e-commerce terpercaya untuk kebutuhan ibu, bayi, dan keluarga. Produk asli, harga terjangkau, pengiriman cepat.
            </p>

            {/* Contact */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 text-sm text-[#ADB7BC]">
                <PhoneCall className="h-4 w-4 text-[#FA8232] shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-white transition-colors">
                  +62 812-3456-7890
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#ADB7BC]">
                <Mail className="h-4 w-4 text-[#FA8232] shrink-0" />
                <a href="mailto:cs@karismastore.id" className="hover:text-white transition-colors">
                  cs@karismastore.id
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-[#ADB7BC]">
                <MapPin className="h-4 w-4 text-[#FA8232] shrink-0 mt-0.5" />
                <span>Jl. Contoh No. 123, Kota Anda</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: TwitterIcon, href: '#', label: 'Twitter' },
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#303639] hover:bg-[#FA8232] text-[#ADB7BC] hover:text-white transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Kategori</h4>
            <ul className="space-y-2.5">
              {TOP_CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-sm text-[#77878F] hover:text-[#FA8232] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="h-0.5 w-3 rounded-full bg-[#303639] group-hover:bg-[#FA8232] transition-colors" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tautan Cepat</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#77878F] hover:text-[#FA8232] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="h-0.5 w-3 rounded-full bg-[#303639] group-hover:bg-[#FA8232] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Popular Tags + Download App */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tag Populer</h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?search=${encodeURIComponent(tag)}`}
                    className="rounded-sm border border-[#303639] bg-transparent px-2.5 py-1 text-xs text-[#77878F] hover:border-[#FA8232] hover:text-[#FA8232] transition-all duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Metode Pembayaran</h4>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <span
                    key={m}
                    className="rounded-sm border border-[#303639] bg-[#303639] px-2.5 py-1 text-xs font-medium text-[#ADB7BC]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#303639]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5F6C72]">
          <p>© {new Date().getFullYear()} Karisma Store. Semua Hak Dilindungi.</p>
          <p>Dibangun dengan ❤️ menggunakan Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  )
}
