'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Search, HelpCircle, PhoneCall, Mail, MessageSquare, ArrowRight } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQS_DATA: FAQItem[] = [
  {
    category: 'Pemesanan & Akun',
    question: 'Bagaimana cara memesan produk di Karisma Store?',
    answer:
      'Pilih produk yang Anda inginkan dari katalog produk, tentukan jumlah atau varian yang sesuai, lalu klik tombol "Tambah ke Keranjang" atau "Beli Sekarang". Lanjutkan ke halaman checkout untuk mengisi alamat pengiriman dan memilih metode pembayaran.',
  },
  {
    category: 'Pemesanan & Akun',
    question: 'Apakah saya harus membuat akun sebelum berbelanja?',
    answer:
      'Membuat akun sangat dianjurkan agar Anda dapat memantau riwayat pesanan, menyimpan wishlist, dan mempercepat proses checkout berikutnya. Namun, Anda juga dapat menjelajahi seluruh katalog kami secara bebas.',
  },
  {
    category: 'Pembayaran',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer:
      'Kami mendukung transfer bank (BCA, Mandiri, BRI, BNI), QRIS (GoPay, OVO, Dana, ShopeePay), serta pembayaran tunai di tempat (COD) untuk area jangkauan tertentu.',
  },
  {
    category: 'Pembayaran',
    question: 'Apakah transaksi dan data pembayaran saya aman?',
    answer:
      'Keamanan Anda adalah prioritas kami. Semua transaksi dilindungi dengan enkripsi SSL 256-bit standar industri dan diproses melalui gateway pembayaran resmi berlisensi Bank Indonesia.',
  },
  {
    category: 'Pengiriman & Ongkir',
    question: 'Berapa lama estimasi waktu pengiriman pesanan?',
    answer:
      'Untuk pengiriman reguler di area Jabodetabek berkisar antara 1-2 hari kerja. Untuk luar Jabodetabek dan luar pulau Jawa berkisar antara 2-5 hari kerja tergantung pada jasa ekspedisi yang dipilih.',
  },
  {
    category: 'Pengiriman & Ongkir',
    question: 'Bagaimana cara melacak keberadaan paket pesanan saya?',
    answer:
      'Anda dapat melacak pesanan kapan saja melalui menu "Track Order" di navbar atas atau halaman riwayat pesanan. Cukup masukkan Nomor Order (Order ID) dan alamat email pemesanan Anda.',
  },
  {
    category: 'Pengembalian & Garansi',
    question: 'Bagaimana jika produk yang diterima rusak atau tidak sesuai?',
    answer:
      'Kami memberikan jaminan pengembalian atau penggantian 100% untuk produk yang rusak saat diterima atau salah kirim. Silakan ajukan komplain maksimal 2x24 jam setelah paket diterima dengan menyertakan video unboxing melalui Customer Support kami.',
  },
  {
    category: 'Pengembalian & Garansi',
    question: 'Apakah semua produk yang dijual dijamin 100% original?',
    answer:
      'Ya! Semua produk susu, popok, makanan bayi, dan perawatan kulit yang dijual di Karisma Store didatangkan langsung dari distributor resmi bersertifikat BPOM dan SNI.',
  },
]

const CATEGORIES = ['Semua', 'Pemesanan & Akun', 'Pembayaran', 'Pengiriman & Ongkir', 'Pengembalian & Garansi']

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndices, setOpenIndices] = useState<number[]>([0, 2, 4]) // Default expand a few

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory = activeCategory === 'Semua' || faq.category === activeCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F2F4F5] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#5F6C72]">
            <Link href="/" className="hover:text-[#FA8232] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#191C1F] font-semibold">FAQs</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1B6392] to-[#2DA5F3] text-white py-14 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            Pusat Bantuan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-white/80">
            Temukan jawaban cepat untuk pertanyaan seputar produk, pengiriman, pembayaran, dan layanan Karisma Store.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik pertanyaan (misal: pengiriman, ongkir, retur)..."
              className="w-full rounded-md bg-white py-3.5 pl-11 pr-4 text-sm text-[#191C1F] shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA8232]"
            />
            <Search className="absolute left-4 top-5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#FA8232] text-white shadow-sm'
                  : 'bg-gray-100 text-[#475156] hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#191C1F]">Pertanyaan Tidak Ditemukan</h3>
              <p className="text-xs text-[#5F6C72] mt-1 max-w-md mx-auto">
                Maaf, tidak ada FAQ yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Silakan hubungi tim Customer Support kami untuk bantuan langsung.
              </p>
              <Link
                href="/customer-support"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#E07328] transition-colors"
              >
                Hubungi Customer Support
              </Link>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx)
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#191C1F] pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#FA8232] text-white' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#5F6C72] leading-relaxed border-t border-gray-100 bg-[#FAFAFA]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Support Banner CTA */}
        <div className="mt-12 rounded-xl bg-white border border-gray-200 p-8 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-[#191C1F]">
              Belum menemukan jawaban yang Anda cari?
            </h3>
            <p className="text-xs text-[#5F6C72]">
              Tim bantuan Karisma Store siap melayani Anda setiap hari dari pukul 08.00 - 22.00 WIB.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/customer-support"
              className="inline-flex items-center gap-2 rounded-md bg-[#1B6392] px-5 py-3 text-xs font-bold text-white hover:bg-[#134b70] transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Kirim Tiket Bantuan</span>
            </Link>
            <a
              href="tel:+6281234567890"
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-xs font-bold text-[#191C1F] hover:bg-gray-50 transition-colors"
            >
              <PhoneCall className="h-4 w-4 text-[#FA8232]" />
              <span>+62 812-3456-7890</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
