<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  HomeIcon, 
  CodeBracketIcon, 
  TagIcon, 
  PlusCircleIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 菜单项
const menuItems = computed(() => [
  {
    name: t('navigation.home'),
    icon: HomeIcon,
    route: 'Home',
    active: route.name === 'Home'
  },
  {
    name: t('navigation.snippets'),
    icon: CodeBracketIcon,
    route: 'Snippets',
    active: ['Snippets', 'SnippetDetail', 'EditSnippet'].includes(route.name as string)
  },
  {
    name: t('navigation.createSnippet'),
    icon: PlusCircleIcon,
    route: 'CreateSnippet',
    active: route.name === 'CreateSnippet'
  },
  {
    name: t('navigation.tags'),
    icon: TagIcon,
    route: 'Tags',
    active: route.name === 'Tags'
  },
  {
    name: t('navigation.profile'),
    icon: UserCircleIcon,
    route: 'Profile',
    active: route.name === 'Profile',
    requireAuth: true
  }
])

// 筛选菜单项
const filteredMenuItems = computed(() => {
  return menuItems.value.filter(item => !item.requireAuth || props.isAuthenticated)
})

// 导航到指定路由
const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <aside class="w-64 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
    <div class="h-full flex flex-col p-4">
      <div class="space-y-2 flex-1">
        <!-- 菜单项 -->
        <button
          v-for="item in filteredMenuItems"
          :key="item.route"
          @click="navigateTo(item.route)"
          :class="[
            'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
            item.active 
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span>{{ item.name }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>