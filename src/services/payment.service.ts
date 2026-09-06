import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'

/**
 * Upload payment receipt to Supabase Storage and record in payment_proofs table
 */
export async function uploadPaymentProof(
  orderId: string,
  file: File
): Promise<{ success: boolean; proof?: Tables<'payment_proofs'>; error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu.' }
  }

  // Generate unique filename in bucket
  const fileExt = file.name.split('.').pop()
  const fileName = `${orderId}_${Date.now()}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  // 1. Upload to Supabase Storage bucket 'payment-proofs'
  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { success: false, error: uploadError.message }
  }

  // 2. Get Public or Signed URL
  const { data: { publicUrl } } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(filePath)

  // 3. Record in payment_proofs table
  const { data: proof, error: dbError } = await supabase
    .from('payment_proofs')
    .insert({
      order_id: orderId,
      user_id: user.id,
      file_path: filePath,
      file_url: publicUrl,
      file_name: file.name,
      status_verifikasi: 'pending',
    })
    .select()
    .single()

  if (dbError) {
    console.error('Database insert payment proof error:', dbError)
    return { success: false, error: dbError.message }
  }

  // 4. Update order status to 'proof_submitted'
  await supabase
    .from('ecommerce_orders')
    .update({
      status_pembayaran: 'proof_submitted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  return { success: true, proof }
}
