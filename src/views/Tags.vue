<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTagsStore } from '../stores/tags'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const tagsStore = useTagsStore()
const authStore = useAuthStore()

// 新标签表单
const newTagName = ref('')
const loading = ref(false)
const error = ref('')

// 获取标签列表
onMounted(() => {
  if (authStore.isAuthenticated) {
    tagsStore.fetchMyTags()
  } else {
    tagsStore.fetchAllTags()
  }
})

// 创建新标签
const createTag = async () => {
  if (!newTagName.value.trim()) {
    error.value = t('errors.required', { field: t('tags.name') })
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await tagsStore.createTag({ 
      name: newTagName.value,
      isHidden: false // 默认可选择
    })
    newTagName.value = ''
  } catch (err) {
    console.error('Failed to create tag:', err)
    error.value = t('errors.serverError')
  } finally {
    loading.value = false
  }
}

// 更新标签可选择状态
const toggleTagSelectability = async (id: number, isHidden: boolean) => {
  try {
    await tagsStore.updateTagVisibility(id, !isHidden)
  } catch (err) {
    console.error('Failed to update tag selectability:', err)
  }
}

// 判断是否可以操作标签
const canManageTag = (tag: any) => {
  // 已登录用户可以操作自己的标签
  if (authStore.isAuthenticated) {
    return tag.userId === authStore.currentUser?.id
  }
  // 游客模式可以操作本地创建的标签
  if (authStore.guestMode) {
    return tagsStore.localTags.some(t => t.id === tag.id)
  }
  return false
}

// 过滤显示的标签
const displayTags = computed(() => {
  if (authStore.isAuthenticated) {
    // 登录用户显示所有标签
    return tagsStore.allTags
  } else if (authStore.guestMode) {
    // 游客模式显示本地标签和可选择的远程标签
    return [...tagsStore.localTags, ...tagsStore.tags.filter(tag => !tag.isHidden)]
  }
  // 未登录且非游客模式只显示可选择的标签
  return tagsStore.tags.filter(tag => !tag.isHidden)
})
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('navigation.tags') }}
      </h1>
    </div>
    
    <!-- 创建新标签 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('tags.create') }}
      </h2>
      
      <form @submit.prevent="createTag" class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="newTagName"
            type="text"
            class="input"
            :placeholder="t('tags.name')"
          />
          <p v-if="error" class="mt-1 text-sm text-danger-600 dark:text-danger-400">
            {{ error }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary"
        >
          <span v-if="loading">{{ t('common.loading') }}</span>
          <span v-else>{{ t('common.create') }}</span>
        </button>
      </form>
    </div>
    
    <!-- 标签列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('navigation.tags') }}
        </h2>
        
        <!-- 加载状态 -->
        <div v-if="tagsStore.loading" class="py-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="tagsStore.error" class="py-12 text-center">
          <p class="text-danger-600 dark:text-danger-400">
            {{ tagsStore.error }}
          </p>
          <button
            @click="tagsStore.fetchAllTags"
            class="mt-4 btn btn-primary"
          >
            {{ t('common.retry') }}
          </button>
        </div>
        
        <!-- 空状态 -->
        <div
          v-else-if="displayTags.length === 0"
          class="py-12 text-center"
        >
          <div class="text-gray-500 dark:text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            {{ t('tags.noTags') }}
          </p>
          <p class="mt-2 text-gray-500 dark:text-gray-500">
            {{ t('tags.createFirst') }}
          </p>
        </div>
        
        <!-- 标签列表 -->
        <div v-else class="space-y-4">
          <div
            v-for="tag in displayTags"
            :key="tag.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <span class="text-gray-900 dark:text-white font-medium">
                {{ tag.name }}
              </span>
              <!-- 本地标签标识 -->
              <span v-if="tagsStore.localTags.some(t => t.id === tag.id)" 
                class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 rounded-full">
                {{ t('snippets.uploadStatus.local') }}
              </span>
            </div>
            
            <!-- 可选择状态切换（对自己创建的标签可用） -->
            <button
              v-if="canManageTag(tag)"
              @click="toggleTagSelectability(tag.id, tag.isHidden)"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {{ tag.isHidden ? t('tags.unselectable') : t('tags.selectable') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>