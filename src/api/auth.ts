import http from './http'
import type { User } from '../types/user'

interface RegisterResponse {
  access_token: string
  user: User
}

interface LoginResponse {
  access_token: string
  user: User
}

export const authApi = {
  // 用户注册
  register: (username: string, email: string, password: string) => {
    return http.post<RegisterResponse>('/auth/register', {
      username,
      email,
      password
    })
  },
  
  // 用户登录
  login: (username: string, password: string) => {
    return http.post<LoginResponse>('/auth/login', {
      username,
      password
    })
  },
  
  // 获取当前用户信息
  getUserProfile: () => {
    return http.get<User>('/users/profile')
  }
}