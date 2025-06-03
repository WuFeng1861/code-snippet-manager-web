import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 从本地存储获取主题模式，默认为浅色模式
  const mode = useStorage<ThemeMode>('theme-mode', 'light')

  // 检测系统主题偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  
  // 初始化时，如果本地没有保存主题偏好，则使用系统偏好
  if (mode.value === 'light' && prefersDark.matches) {
    mode.value = 'dark'
  }

  // 监听系统主题变化
  prefersDark.addEventListener('change', (e) => {
    if (mode.value === 'light' && e.matches) {
      mode.value = 'dark'
    } else if (mode.value === 'dark' && !e.matches) {
      mode.value = 'light'
    }
  })

  // 切换主题模式
  function toggleTheme() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  // 设置特定主题模式
  function setTheme(newMode: ThemeMode) {
    mode.value = newMode
  }

  // 监听主题变化并应用到 HTML 元素
  watch(mode, (newMode) => {
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    mode,
    toggleTheme,
    setTheme
  }
}, {
  persist: true
})