<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  mode: {
    type: String,
    default: 'light'
  }
})

const emit = defineEmits(['toggle'])

const { t } = useI18n()

const isDark = computed(() => props.mode === 'dark')
const title = computed(() => isDark.value ? t('theme.light') : t('theme.dark'))
</script>

<template>
  <button 
    @click="$emit('toggle')"
    :title="title"
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    :aria-label="title"
  >
    <MoonIcon v-if="!isDark" class="h-5 w-5 text-gray-600 dark:text-gray-300" />
    <SunIcon v-else class="h-5 w-5 text-yellow-500" />
  </button>
</template>