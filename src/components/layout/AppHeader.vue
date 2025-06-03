<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ThemeSwitcher from '../common/ThemeSwitcher.vue'
import LanguageSwitcher from '../common/LanguageSwitcher.vue'
import { MoonIcon, SunIcon, LanguageIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isGuestMode: {
    type: Boolean,
    default: false
  },
  themeMode: {
    type: String,
    default: 'light'
  }
})

const emit = defineEmits(['toggleTheme', 'toggleLanguage', 'logout'])

const router = useRouter()
const { t } = useI18n()
const mobileMenuOpen = ref(false)

// 切换移动菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 导航到登录页
const goToLogin = () => {
  router.push({ name: 'Login' })
  mobileMenuOpen.value = false
}

// 导航到注册页
const goToRegister = () => {
  router.push({ name: 'Register' })
  mobileMenuOpen.value = false
}

// 登出
const logout = () => {
  emit('logout')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo和标题 -->
        <div class="flex items-center">
          <router-link :to="{ name: 'Home' }" class="flex items-center">
            <div class="text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">{{ t('app.title') }}</span>
          </router-link>
        </div>

        <!-- 桌面导航菜单 -->
        <nav class="hidden md:flex items-center space-x-6">
          <!-- 主题切换器 -->
          <ThemeSwitcher :mode="themeMode" @toggle="$emit('toggleTheme')" />
          
          <!-- 语言切换器 -->
          <LanguageSwitcher @toggle="$emit('toggleLanguage')" />
          
          <!-- 认证状态 -->
          <div v-if="isAuthenticated" class="flex items-center space-x-4">
            <router-link :to="{ name: 'Profile' }" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              <UserCircleIcon class="h-6 w-6" />
            </router-link>
            <button 
              @click="logout"
              class="px-3 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              {{ t('auth.logout') }}
            </button>
          </div>
          <div v-else-if="isGuestMode" class="flex items-center space-x-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('auth.guestMode') }}</span>
            <router-link 
              :to="{ name: 'Login' }"
              class="px-3 py-2 text-sm rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              {{ t('auth.login') }}
            </router-link>
          </div>
          <div v-else class="flex items-center space-x-4">
            <router-link 
              :to="{ name: 'Login' }"
              class="px-3 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              {{ t('auth.login') }}
            </router-link>
            <router-link 
              :to="{ name: 'Register' }"
              class="px-3 py-2 text-sm rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              {{ t('auth.register') }}
            </router-link>
          </div>
        </nav>

        <!-- 移动端菜单按钮 -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
          <XMarkIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 space-y-4 animate-slide-down">
        <div class="flex items-center justify-between py-2">
          <ThemeSwitcher :mode="themeMode" @toggle="$emit('toggleTheme')" />
          <LanguageSwitcher @toggle="$emit('toggleLanguage')" />
        </div>
        <div class="space-y-2">
          <router-link 
            :to="{ name: 'Home' }"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {{ t('navigation.home') }}
          </router-link>
          <router-link 
            :to="{ name: 'Snippets' }"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {{ t('navigation.snippets') }}
          </router-link>
          <router-link 
            :to="{ name: 'Tags' }"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {{ t('navigation.tags') }}
          </router-link>
        </div>
        <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div v-if="isAuthenticated" class="space-y-2">
            <router-link 
              :to="{ name: 'Profile' }"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {{ t('navigation.profile') }}
            </router-link>
            <button 
              @click="logout"
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {{ t('auth.logout') }}
            </button>
          </div>
          <div v-else-if="isGuestMode" class="space-y-2">
            <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {{ t('auth.guestMode') }}
            </div>
            <button 
              @click="goToLogin"
              class="w-full text-left px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              {{ t('auth.login') }}
            </button>
          </div>
          <div v-else class="space-y-2">
            <button 
              @click="goToLogin"
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {{ t('auth.login') }}
            </button>
            <button 
              @click="goToRegister"
              class="w-full text-left px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              {{ t('auth.register') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>