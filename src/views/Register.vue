<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()

// 表单数据
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// 表单验证
const validateForm = () => {
  if (!username.value) {
    error.value = t('errors.required', { field: t('auth.username') })
    return false
  }
  
  if (!email.value) {
    error.value = t('errors.required', { field: t('auth.email') })
    return false
  }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = t('errors.email')
    return false
  }
  
  if (!password.value) {
    error.value = t('errors.required', { field: t('auth.password') })
    return false
  }
  
  if (password.value.length < 6) {
    error.value = t('errors.minLength', { field: t('auth.password'), min: 6 })
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = t('errors.passwordMatch')
    return false
  }
  
  return true
}

// 注册
const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    // 调用注册
    const success = await authStore.register(username.value, email.value, password.value)
    
    if (success) {
      // 注册成功，导航到首页
      router.push({ name: 'Home' })
    } else {
      error.value = t('errors.serverError')
    }
  } catch (err) {
    console.error('Registration error:', err)
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
      {{ t('auth.register') }}
    </h2>
    
    <!-- 注册表单 -->
    <form @submit.prevent="handleRegister" class="space-y-4">
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
      
      <!-- 电子邮箱 -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('auth.email') }}
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="input mt-1"
          :placeholder="t('auth.email')"
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
      
      <!-- 确认密码 -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('auth.confirmPassword') }}
        </label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          class="input mt-1"
          :placeholder="t('auth.confirmPassword')"
        />
      </div>
      
      <!-- 错误信息 -->
      <div v-if="error" class="text-danger-600 dark:text-danger-400 text-sm">
        {{ error }}
      </div>
      
      <!-- 注册按钮 -->
      <div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full btn btn-primary"
        >
          <span v-if="loading">{{ t('common.loading') }}</span>
          <span v-else>{{ t('auth.register') }}</span>
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
    
    <!-- 登录链接 -->
    <div class="mt-6 text-center text-sm">
      <p class="text-gray-600 dark:text-gray-400">
        已有账号？
        <router-link :to="{ name: 'Login' }" class="text-primary-600 dark:text-primary-400 hover:underline">
          {{ t('auth.login') }}
        </router-link>
      </p>
    </div>
  </div>
</template>