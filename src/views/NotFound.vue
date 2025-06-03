<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// 返回首页
const goHome = () => {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        {{ t('errors.notFound') }}
      </p>
      <button
        @click="goHome"
        class="btn btn-primary"
      >
        {{ t('common.back') }}
      </button>
    </div>
  </div>
</template>