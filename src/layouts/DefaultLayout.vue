<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportedLocale } from '../i18n'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/layout/AppHeader.vue'
import AppFooter from '../components/layout/AppFooter.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'

const router = useRouter()
const { t, locale } = useI18n() // 添加 locale 引用
const themeStore = useThemeStore()
const authStore = useAuthStore()

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 切换语言
const toggleLanguage = () => {
  const currentLocale = locale.value as SupportedLocale
  setLocale(currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN')
}

// 登出
const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Home' })
}

// 是否为移动设备
const isMobile = computed(() => {
  return window.innerWidth < 768
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 头部导航 -->
    <AppHeader 
      :is-authenticated="authStore.isAuthenticated" 
      :is-guest-mode="authStore.guestMode"
      :theme-mode="themeStore.mode"
      @toggle-theme="toggleTheme"
      @toggle-language="toggleLanguage"
      @logout="handleLogout"
    />
    
    <div class="flex flex-1">
      <!-- 侧边栏 (仅在桌面端显示) -->
      <AppSidebar 
        v-if="!isMobile" 
        :is-authenticated="authStore.isAuthenticated"
      />
      
      <!-- 主内容区 -->
      <main class="flex-1 p-4 md:p-6">
        <div class="container mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
    
    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>