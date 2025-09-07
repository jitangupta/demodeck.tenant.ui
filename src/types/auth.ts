export interface LoginRequest {
  username: string
  password: string
  tenantName: string
}

export interface LoginResponse {
  success: boolean
  token: string
  expiresAt: string
  message: string
  user: UserInfo
}

export interface UserInfo {
  username: string
  email: string
  role: string
  tenantName: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserInfo | null
  token: string | null
  loading: boolean
}