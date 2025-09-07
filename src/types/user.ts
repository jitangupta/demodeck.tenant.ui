export interface User {
  id: number
  username: string
  email: string
  tenantId: string
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errorCode?: string
}