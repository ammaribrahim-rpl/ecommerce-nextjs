import { createClient } from '@/lib/supabase/client'

export interface Conversation {
  id: string
  customer_id: string
  order_id?: string | null
  last_message_at?: string
  created_at?: string
  customer?: {
    nama: string | null
    email: string
  }
  unread_count?: number
  last_message?: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  pesan: string
  dibaca: boolean
  created_at: string
}

/**
 * Dapatkan atau buat percakapan untuk customer yang sedang login
 */
export async function getOrCreateCustomerConversation(customerId: string): Promise<string | null> {
  const supabase = createClient()

  // Cari percakapan yang sudah ada
  const { data: existing, error: findError } = await (supabase as any)
    .from('conversations')
    .select('id')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing?.id) {
    return existing.id
  }

  if (findError) {
    console.error('Error finding conversation:', findError)
  }

  // Buat percakapan baru jika belum ada
  const { data: newConv, error: createError } = await (supabase as any)
    .from('conversations')
    .insert({
      customer_id: customerId,
      last_message_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (createError) {
    console.error('Error creating conversation:', createError)
    return null
  }

  return newConv.id
}

/**
 * Ambil daftar pesan dalam suatu percakapan
 */
export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const supabase = createClient()
  const { data, error } = await (supabase as any)
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return (data || []) as ChatMessage[]
}

/**
 * Kirim pesan baru dalam percakapan
 */
export async function sendChatMessage(
  conversationId: string,
  senderId: string,
  pesan: string
): Promise<ChatMessage | null> {
  if (!pesan.trim()) return null

  const supabase = createClient()
  const { data, error } = await (supabase as any)
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      pesan: pesan.trim(),
      dibaca: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error sending message:', error)
    return null
  }

  // Update last_message_at di tabel conversations
  await (supabase as any)
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as ChatMessage
}

/**
 * Ambil semua percakapan untuk panel Admin / Owner
 */
export async function getAllConversations(): Promise<Conversation[]> {
  const supabase = createClient()

  // Ambil daftar percakapan
  const { data: convs, error } = await (supabase as any)
    .from('conversations')
    .select('*')
    .order('last_message_at', { ascending: false })

  if (error || !convs) {
    console.error('Error fetching all conversations:', error)
    return []
  }

  // Ambil profil customer dan pesan terakhir untuk setiap percakapan
  const enriched: Conversation[] = await Promise.all(
    convs.map(async (c: any) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nama, email')
        .eq('id', c.customer_id)
        .maybeSingle()

      const { data: lastMsg } = await (supabase as any)
        .from('messages')
        .select('pesan, dibaca, sender_id')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      return {
        ...c,
        customer: profile || { nama: 'Pelanggan', email: '' },
        last_message: lastMsg?.pesan || 'Belum ada pesan',
        unread_count: lastMsg && !lastMsg.dibaca && lastMsg.sender_id === c.customer_id ? 1 : 0,
      }
    })
  )

  return enriched
}

/**
 * Tandai pesan dalam percakapan sebagai dibaca
 */
export async function markMessagesAsRead(conversationId: string, currentUserId: string): Promise<void> {
  const supabase = createClient()
  await (supabase as any)
    .from('messages')
    .update({ dibaca: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', currentUserId)
}
