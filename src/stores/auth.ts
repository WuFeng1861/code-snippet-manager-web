import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { authApi } from '../api/auth'
import type { User } from '../types/user'

export const useAuthStore = defineStore('auth', () => {
  // 持久化存储的访问令牌
  const accessToken = useStorage<string | null>('access-token', null)
  // 当前用户信息
  const currentUser = ref<User | null>(null)
  // 游客模式状态
  const guestMode = ref(false)

  // 计算登录状态
  const isAuthenticated = computed(() => !!accessToken.value && !!currentUser.value)
  
  // 登录函数
  async function login(username: string, password: string) {
    try {
      const response = await authApi.login(username, password)
      accessToken.value = response.data.access_token
      currentUser.value = response.data.user
      guestMode.value = false
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  // 注册函数
  async function register(username: string, email: string, password: string) {
    try {
      const response = await authApi.register(username, email, password)
      accessToken.value = response.data.access_token
      currentUser.value = response.data.user
      guestMode.value = false
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  // 获取用户个人资料
  async function fetchUserProfile() {
    if (!accessToken.value) return null
    
    try {
      const response = await authApi.getUserProfile()
      currentUser.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return null
    }
  }

  // 退出登录
  function logout() {
    accessToken.value = null
    currentUser.value = null
    guestMode.value = false
    localStorage.clear()
  }

  // 启用游客模式
  function enableGuestMode() {
    guestMode.value = true
    accessToken.value = null
    currentUser.value = null
  }

  return {
    accessToken,
    currentUser,
    guestMode,
    isAuthenticated,
    login,
    register,
    fetchUserProfile,
    logout,
    enableGuestMode
  }
}, {
  persist: {
    paths: ['accessToken', 'guestMode']
  }
})
