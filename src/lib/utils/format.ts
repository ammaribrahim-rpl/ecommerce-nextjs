/**
 * Utility functions for formatting currencies, dates, and order numbers.
 */

/**
 * Format a number to Indonesian Rupiah (IDR)
 * Example: 15000 -> "Rp 15.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return 'Rp 0'
  const rounded = Math.round(amount)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded)
}

/**
 * Format a date string to Indonesian locale
 * Example: "2026-09-06T07:44:58.75472Z" -> "6 September 2026, 14:44 WIB"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date) + ' WIB'
  } catch {
    return dateString
  }
}

/**
 * Generate a unique transaction order code
 * Format: TRX-YYYYMMDD-XXXX (where XXXX is 4 random uppercase alphanumeric characters)
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TRX-${year}${month}${day}-${randomStr}`
}
