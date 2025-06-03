<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LanguageIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['toggle'])
const { t, locale } = useI18n()

const currentLocale = computed(() => locale.value)
const nextLocale = computed(() => currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
const title = computed(() => t(`language.${nextLocale.value}`))
</script>

<template>
  <button 
    @click="$emit('toggle')"
    :title="title"
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    :aria-label="title"
  >
    <span class="sr-only">{{ title }}</span>
    <span class="font-semibold text-sm">{{ currentLocale === 'zh-CN' ? '中' : 'EN' }}</span>
  </button>
</template>