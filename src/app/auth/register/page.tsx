'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [telepon, setTelepon] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Step 1: Daftar akun baru
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama, telepon },
        },
      })

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered') ||
            signUpError.message.toLowerCase().includes('already exists') ||
            signUpError.message.toLowerCase().includes('user already')) {
          setError('Email ini sudah terdaftar. Silakan masuk dengan akun yang sudah ada.')
        } else if (signUpError.message.toLowerCase().includes('rate limit')) {
          setError('Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      if (!data.user) {
        setError('Gagal membuat akun. Silakan coba lagi.')
        return
      }

      // Step 2: Simpan ke tabel profiles
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        nama,
        telepon,
        role: 'buyer',
      })

      // Step 3: Langsung login otomatis (tidak perlu konfirmasi email)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        // Jika email belum dikonfirmasi, arahkan ke halaman login dengan pesan
        if (signInError.message.toLowerCase().includes('email not confirmed') ||
            signInError.message.toLowerCase().includes('not confirmed')) {
          setError(
            'Akun berhasil dibuat namun email belum dikonfirmasi. ' +
            'Silakan hubungi admin toko untuk mengaktifkan akun Anda, atau nonaktifkan verifikasi email di pengaturan Supabase.'
          )
          return
        }
        // Login gagal tapi akun sudah dibuat — arahkan ke login manual
        setSuccess(true)
        setTimeout(() => router.push('/auth/login'), 2000)
        return
      }

      // Step 4: Berhasil! Redirect ke profil
      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/profile'
      }, 1200)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat pendaftaran.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-200/90 bg-white p-8 shadow-xs">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="text-xs text-gray-500">
            Bergabunglah dengan Karisma Store untuk pengalaman belanja yang lebih mudah
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Pendaftaran berhasil! Kamu sudah masuk otomatis. Mengalihkan ke profil...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nomor WhatsApp / HP
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="081234567890"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kata Sandi (Minimal 6 Karakter)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Daftar Akun</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  )
}
