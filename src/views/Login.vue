<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useSnippetsStore } from '../stores/snippets'
import { useTagsStore } from '../stores/tags'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()

// 表单数据
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// 登录
const handleLogin = async () => {
  // 表单验证
  if (!username.value || !password.value) {
    error.value = t('errors.required', { field: t('auth.username') }) + ', ' + 
                  t('errors.required', { field: t('auth.password') })
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 调用登录
    const success = await authStore.login(username.value, password.value)
    
    if (success) {
      // 登录成功，获取用户数据
      await snippetsStore.fetchSnippets()
      await tagsStore.fetchMyTags()
      
      // 导航到重定向页面或首页
      const redirectPath = route.query.redirect as string || { name: 'Home' }
      router.push(redirectPath)
    } else {
      error.value = t('errors.unauthorized')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = t('errors.networkError')
  } finally {
    loading.value = false
  }
}

// 启用游客模式
const enableGuestMode = () => {
  authStore.enableGuestMode()
  router.push({ name: 'Snippets' })
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('auth.login') }}
    </h2>
    
    <!-- 登录表单 -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- 用户名 -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('auth.username') }}
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          class="input mt-1"
          :placeholder="t('auth.username')"
        />
      </div>
      
      <!-- 密码 -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('auth.password') }}
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="input mt-1"
          :placeholder="t('auth.password')"
        />
      </div>
      
      <!-- 错误信息 -->
      <div v-if="error" class="text-danger-600 dark:text-danger-400 text-sm">
        {{ error }}
      </div>
      
      <!-- 登录按钮 -->
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn btn-primary"
        >
          <span v-if="loading">{{ t('common.loading') }}</span>
          <span v-else>{{ t('auth.login') }}</span>
        </button>
      </div>
      
      <!-- 游客模式 -->
      <div>
        <button
          type="button"
          @click="enableGuestMode"
          class="w-full btn btn-ghost mt-4"
        >
          {{ t('auth.enterGuestMode') }}
        </button>
      </div>
    </form>
    
    <!-- 注册链接 -->
    <div class="mt-6 text-center text-sm">
      <p class="text-gray-600 dark:text-gray-400">
        还没有账号？
        <router-link :to="{ name: 'Register' }" class="text-primary-600 dark:text-primary-400 hover:underline">
          {{ t('auth.register') }}
        </router-link>
      </p>
    </div>
  </div>
</template>