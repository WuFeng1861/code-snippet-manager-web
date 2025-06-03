<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale, type SupportedLocale } from '../i18n'
import { useThemeStore } from '../stores/theme'
import LanguageSwitcher from '../components/common/LanguageSwitcher.vue'
import ThemeSwitcher from '../components/common/ThemeSwitcher.vue'

const { t, locale } = useI18n() // 添加 locale 引用
const themeStore = useThemeStore()

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 切换语言
const toggleLanguage = () => {
  const currentLocale = locale.value as SupportedLocale
  setLocale(currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 页面顶部 -->
    <div class="p-4 flex justify-end">
      <ThemeSwitcher 
        :mode="themeStore.mode" 
        class="mr-4" 
        @toggle="toggleTheme" 
      />
      <LanguageSwitcher @toggle="toggleLanguage" />
    </div>
    
    <!-- 主内容 -->
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('app.title') }}
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ t('app.tagline') }}
          </p>
        </div>
        
        <!-- 内容区 -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 animate-fade-in">
          <router-view />
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <div class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
      © {{ new Date().getFullYear() }} {{ t('app.title') }}
    </div>
  </div>
</template>