'use client'

import React, { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { uploadPaymentProof } from '@/services/payment.service'

interface PaymentProofUploaderProps {
  orderId: string
  onUploaded?: () => void
}

export default function PaymentProofUploader({ orderId, onUploaded }: PaymentProofUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError('Ukuran file maksimal 10MB.')
        return
      }
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih foto atau file bukti transfer terlebih dahulu.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const res = await uploadPaymentProof(orderId, file)
      if (!res.success) {
        setError(res.error || 'Gagal mengunggah bukti pembayaran.')
        return
      }

      setSuccess(true)
      if (onUploaded) onUploaded()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mengunggah.'
      setError(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-emerald-600" />
        <h3 className="text-sm font-bold text-gray-900">Upload Bukti Transfer Pembayaran</h3>
      </div>

      <p className="text-xs text-gray-600">
        Setelah melakukan transfer ke rekening kami, silakan unggah foto atau screenshot struk/mutasi di bawah ini untuk diverifikasi oleh tim kami.
      </p>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-100/70 p-4 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold">Bukti Pembayaran Berhasil Diunggah!</p>
            <p className="text-xs text-emerald-700">Status pesanan diperbarui. Tim kami akan memverifikasi dalam 1-2 jam kerja.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {preview ? (
            <div className="relative aspect-video max-w-xs overflow-hidden rounded-xl border border-emerald-300 bg-black/5">
              <img src={preview} alt="Preview Bukti" className="h-full w-full object-contain" />
              <button
                onClick={() => { setFile(null); setPreview(null) }}
                className="absolute top-2 right-2 rounded-lg bg-gray-900/80 px-2 py-1 text-[10px] text-white hover:bg-red-600 transition-colors"
              >
                Ganti Foto
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-white/80 p-6 text-center cursor-pointer hover:bg-emerald-50/50 transition-colors">
              <ImageIcon className="h-8 w-8 text-emerald-500 mb-2" />
              <span className="text-xs font-semibold text-gray-700">Pilih Foto Struk / Screenshot</span>
              <span className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP (Maksimal 10MB)</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  <span>Kirim Bukti Pembayaran</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
