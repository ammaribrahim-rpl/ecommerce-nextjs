'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User as UserIcon, CheckCheck, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  getOrCreateCustomerConversation,
  getConversationMessages,
  sendChatMessage,
  type ChatMessage,
} from '@/services/chat.service'

export default function CustomerChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email?: string; nama?: string; role?: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cek user login & role
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nama, role')
          .eq('id', data.user.id)
          .maybeSingle()

        setUser({
          id: data.user.id,
          email: data.user.email,
          nama: profile?.nama || data.user.email?.split('@')[0],
          role: profile?.role || 'buyer',
        })
      }
    })
  }, [])

  // Inisialisasi percakapan saat widget dibuka
  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true)
      getOrCreateCustomerConversation(user.id).then(async (cId) => {
        if (cId) {
          setConversationId(cId)
          const msgs = await getConversationMessages(cId)
          setMessages(msgs)
        }
        setLoading(false)
      })
    }
  }, [isOpen, user?.id])

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Polling pesan baru setiap 4 detik saat widget terbuka
  useEffect(() => {
    if (!isOpen || !conversationId) return

    const interval = setInterval(async () => {
      const msgs = await getConversationMessages(conversationId)
      setMessages(msgs)
    }, 4000)

    return () => clearInterval(interval)
  }, [isOpen, conversationId])

  // Jangan tampilkan floating chat jika yang login adalah admin/owner (karena admin/owner menggunakan tab Chat di Dashboard Admin)
  if (user?.role === 'admin' || user?.role === 'owner') {
    return null
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !user?.id || sending) return

    let currentCId = conversationId
    setSending(true)

    try {
      if (!currentCId) {
        currentCId = await getOrCreateCustomerConversation(user.id)
        setConversationId(currentCId)
      }

      if (currentCId) {
        const text = inputMessage
        setInputMessage('')
        const newMsg = await sendChatMessage(currentCId, user.id, text)
        if (newMsg) {
          setMessages((prev) => [...prev, newMsg])
        }
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tombol Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-600/40 focus:outline-none"
          title="Chat Layanan Pelanggan"
        >
          <MessageCircle className="h-7 w-7 transition-transform group-hover:scale-105" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Jendela Chat Popup */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold backdrop-blur-xs">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-600"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Karisma Care</h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Layanan Bantuan Toko
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              title="Tutup Chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Area Pesan Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {/* Sambutan default */}
            <div className="flex gap-2.5 items-start">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                KC
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-xs bg-white p-3 text-xs text-slate-800 shadow-xs border border-slate-100 leading-relaxed">
                Halo! Selamat datang di Karisma Store. Ada yang bisa kami bantu seputar produk, stok, atau pesanan Anda?
              </div>
            </div>

            {!user ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center my-4">
                <p className="text-xs font-semibold text-amber-800 mb-2">
                  Silakan Masuk untuk Memulai Chat
                </p>
                <p className="text-[11px] text-amber-600 mb-3">
                  Masuk dengan akun Anda agar kami dapat menghubungkan Anda langsung dengan admin toko.
                </p>
                <a
                  href="/auth/login"
                  className="inline-block rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  Masuk Sekarang
                </a>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="text-xs">Memuat percakapan...</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        A
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'rounded-br-xs bg-emerald-600 text-white'
                          : 'rounded-bl-xs bg-white text-slate-800 border border-slate-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.pesan}</p>
                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                          isMe ? 'text-emerald-100' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && <CheckCheck className="h-3 w-3 text-emerald-200" />}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Chat */}
          {user && (
            <form onSubmit={handleSend} className="border-t border-gray-100 bg-white p-3 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan Anda..."
                disabled={sending}
                className="flex-1 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 text-xs text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all"
                title="Kirim Pesan"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
