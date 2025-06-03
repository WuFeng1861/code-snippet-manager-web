<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useSnippetsStore } from '../stores/snippets'
import { useTagsStore } from '../stores/tags'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()

// 用户统计信息
const stats = ref({
  snippetsCount: 0,
  tagsCount: 0
})

// 加载用户数据
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login' })
    return
  }

  // 计算统计信息
  stats.value.snippetsCount = snippetsStore.snippets.length
  stats.value.tagsCount = tagsStore.tags.filter(tag => tag.userId == authStore.currentUser?.id).length
})

// 退出登录
const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('navigation.profile') }}
      </h1>
    </div>

    <!-- 用户信息卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center space-x-4">
        <!-- 用户头像 -->
        <div class="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ authStore.currentUser?.username.charAt(0).toUpperCase() }}
          </span>
        </div>

        <!-- 用户基本信息 -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ authStore.currentUser?.username }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ authStore.currentUser?.email }}
          </p>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('navigation.snippets') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.snippetsCount }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('navigation.tags') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ stats.tagsCount }}
          </p>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <div class="mt-6">
        <button
          @click="handleLogout"
          class="w-full btn btn-danger"
        >
          {{ t('auth.logout') }}
        </button>
      </div>
    </div>
  </div>
</template>
