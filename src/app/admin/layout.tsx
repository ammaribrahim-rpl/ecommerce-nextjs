import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard Admin - Karisma Store',
    template: '%s | Admin Karisma',
  },
}

/**
 * Admin layout — no Navbar/Footer from the main store.
 * The admin panel has its own navigation inside AdminDashboardClient.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
