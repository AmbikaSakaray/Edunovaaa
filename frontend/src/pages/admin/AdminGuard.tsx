import { ReactNode } from 'react'
import AdminLayout from './AdminLayout'

export default function AdminGuard({ children }: { children?: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
