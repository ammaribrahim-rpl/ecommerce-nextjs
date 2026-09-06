/**
 * Application-level shared types.
 * These are ecommerce-domain types separate from the raw DB schema.
 */

// ============================================================
// USER ROLES
// ============================================================

export type UserRole = 'guest' | 'buyer' | 'admin' | 'owner'

// ============================================================
// PRODUCT STATUS
// ============================================================

export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'NOT_FOR_SALE'

export const ProductStatusLabel: Record<ProductStatus, string> = {
  AVAILABLE: 'Masih',
  OUT_OF_STOCK: 'Kosong',
  NOT_FOR_SALE: 'Tidak Dijual',
}

// ============================================================
// ORDER STATUS
// ============================================================

export type OrderStatus =
  | 'ordered'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export type PaymentStatus =
  | 'unpaid'
  | 'proof_submitted'
  | 'verified'
  | 'rejected'
  | 'cash_pending'
  | 'paid'

export type DeliveryStatus = 'pending' | 'shipped' | 'delivered'

export type PaymentMethod = 'bank_transfer' | 'qris' | 'cash'

// ============================================================
// PAGINATION
// ============================================================

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================
// API RESPONSE
// ============================================================

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError
