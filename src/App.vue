<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSnippetsStore } from './stores/snippets'
import { useTagsStore } from './stores/tags'

const authStore = useAuthStore()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()

// 应用启动时加载数据
onMounted(async () => {
  // 如果有访问令牌，尝试获取用户信息
  if (authStore.accessToken) {
    await authStore.fetchUserProfile()
    
    // 如果成功获取用户信息，加载用户数据
    if (authStore.isAuthenticated) {
      snippetsStore.fetchSnippets()
      tagsStore.fetchMyTags()
    }
  }
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>