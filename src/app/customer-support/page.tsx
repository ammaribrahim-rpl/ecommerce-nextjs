'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  PackageCheck,
  KeyRound,
  CreditCard,
  HelpCircle,
  MessageCircle,
} from 'lucide-react'

export default function CustomerSupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setSubmitted(true)
  }

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
            <span className="text-[#191C1F] font-semibold">Customer Support</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#1B6392] text-white py-14 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            Bantuan Pelanggan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ada yang bisa kami bantu hari ini?
          </h1>
          <p className="text-sm text-white/80">
            Pilih topik bantuan cepat di bawah atau kirimkan pesan langsung kepada tim support Karisma Store.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        {/* 4 Quick Support Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: PackageCheck,
              title: 'Lacak Pesanan',
              desc: 'Cek posisi dan status kurir pengiriman paket Anda secara real-time.',
              href: '/track-order',
              action: 'Lacak Sekarang',
            },
            {
              icon: KeyRound,
              title: 'Reset Password',
              desc: 'Lupa kata sandi? Pulihkan akses ke akun Anda dengan mudah dan aman.',
              href: '/auth/login',
              action: 'Buka Login',
            },
            {
              icon: CreditCard,
              title: 'Panduan Pembayaran',
              desc: 'Instruksi transfer bank, konfirmasi pembayaran, dan metode QRIS.',
              href: '/faqs',
              action: 'Lihat Panduan',
            },
            {
              icon: HelpCircle,
              title: 'FAQ & Bantuan',
              desc: 'Pertanyaan paling sering ditanyakan seputar produk dan belanja.',
              href: '/faqs',
              action: 'Baca FAQ',
            },
          ].map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-[#FA8232] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFF3EB] text-[#FA8232] mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#191C1F] mb-1.5">{card.title}</h3>
                  <p className="text-xs text-[#5F6C72] leading-relaxed mb-4">{card.desc}</p>
                </div>
                <Link
                  href={card.href}
                  className="text-xs font-bold text-[#2DA5F3] hover:text-[#1B6392] inline-flex items-center gap-1 group"
                >
                  <span>{card.action}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Contact Form & Contact Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#191C1F] mb-2">
              Kirimkan Pesan atau Keluhan
            </h2>
            <p className="text-xs text-[#5F6C72] mb-6">
              Isi formulir di bawah ini, tim customer service kami akan merespons melalui email dalam waktu maksimal 1x24 jam.
            </p>

            {submitted ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950">Pesan Berhasil Dikirim!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Terima kasih telah menghubungi Karisma Store. Nomor tiket bantuan telah kami kirimkan ke email Anda ({formData.email}).
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', subject: '', message: '' })
                  }}
                  className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md text-xs font-bold hover:bg-emerald-700"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#191C1F] mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama Anda"
                      className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#191C1F] mb-1.5">
                      Alamat Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191C1F] mb-1.5">
                    Subjek / Topik
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Pertanyaan produk, konfirmasi pesanan, kendala pengiriman"
                    className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191C1F] mb-1.5">
                    Pesan Anda <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan detail pertanyaan atau keluhan Anda di sini..."
                    className="w-full rounded-md border border-gray-300 p-3.5 text-xs text-[#191C1F] placeholder:text-gray-400 focus:border-[#FA8232] focus:outline-none focus:ring-1 focus:ring-[#FA8232]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[#FA8232] px-6 py-3 text-xs font-bold text-white hover:bg-[#E07328] transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirim Pesan</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Col: Contact Information Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-[#191C1F]">
                Kontak Langsung
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF7FF] text-[#2DA5F3]">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#191C1F]">Hotline / Telepon</div>
                    <a href="tel:+6281234567890" className="text-[#5F6C72] hover:text-[#FA8232]">
                      +62 812-3456-7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF7FF] text-[#2DA5F3]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#191C1F]">Email Dukungan</div>
                    <a href="mailto:cs@karismastore.id" className="text-[#5F6C72] hover:text-[#FA8232]">
                      cs@karismastore.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF7FF] text-[#2DA5F3]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#191C1F]">Jam Operasional</div>
                    <div className="text-[#5F6C72]">Senin - Minggu: 08.00 - 22.00 WIB</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF7FF] text-[#2DA5F3]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#191C1F]">Lokasi Kantor</div>
                    <div className="text-[#5F6C72]">Gedung Karisma Center, Jakarta, Indonesia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Feature Widget Box */}
            <div className="rounded-xl bg-gradient-to-br from-[#191C1F] to-[#2DA5F3] p-6 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#FA8232]" />
                <h4 className="text-sm font-bold">Chat Langsung (Live Chat)</h4>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Butuh bantuan kilat? Gunakan fitur Customer Chat di pojok kanan bawah layar Anda untuk terhubung langsung dengan AI & CS kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
