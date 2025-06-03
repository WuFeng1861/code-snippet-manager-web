<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useSnippetsStore } from '../stores/snippets'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const snippetsStore = useSnippetsStore()

// 最近的代码片段
const recentSnippets = ref([])

onMounted(() => {
  // 获取最近的代码片段
  recentSnippets.value = snippetsStore.allSnippets.slice(0, 5)
})

// 导航到代码片段页面
const goToSnippets = () => {
  router.push({ name: 'Snippets' })
}

// 导航到创建代码片段页面
const goToCreateSnippet = () => {
  router.push({ name: 'CreateSnippet' })
}

// 启用游客模式
const enableGuestMode = () => {
  authStore.enableGuestMode()
  router.push({ name: 'Snippets' })
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 欢迎区域 -->
    <div class="py-12 px-4 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ t('app.title') }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ t('app.tagline') }}
      </p>
      
      <!-- 主要操作按钮 -->
      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <template v-if="authStore.isAuthenticated || authStore.guestMode">
          <button
            @click="goToCreateSnippet"
            class="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors duration-200"
          >
            {{ t('snippets.create') }}
          </button>
          <button
            @click="goToSnippets"
            class="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium transition-colors duration-200"
          >
            {{ t('navigation.snippets') }}
          </button>
        </template>
        <template v-else>
          <button
            @click="router.push({ name: 'Login' })"
            class="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors duration-200"
          >
            {{ t('auth.login') }}
          </button>
          <button
            @click="router.push({ name: 'Register' })"
            class="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium transition-colors duration-200"
          >
            {{ t('auth.register') }}
          </button>
          <button
            @click="enableGuestMode"
            class="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
          >
            {{ t('auth.enterGuestMode') }}
          </button>
        </template>
      </div>
    </div>
    
    <!-- 功能特点 -->
    <div class="py-12 bg-gray-100 dark:bg-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('snippets.title') }}
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 特点1: 代码片段管理 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('snippets.features.management.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('snippets.features.management.description') }}
            </p>
          </div>
          
          <!-- 特点2: 在线/离线访问 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('snippets.features.access.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('snippets.features.access.description') }}
            </p>
          </div>
          
          <!-- 特点3: 标签组织 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="text-primary-600 dark:text-primary-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('snippets.features.organization.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('snippets.features.organization.description') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>