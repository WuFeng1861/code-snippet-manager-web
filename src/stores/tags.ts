import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { tagsApi } from '../api/tags'
import { useAuthStore } from './auth'
import type { Tag, TagCreateDTO } from '../types/tag'

export const useTagsStore = defineStore('tags', () => {
  // 存储所有标签
  const tags = ref<Tag[]>([])
  // 本地存储的标签
  const localTags = useStorage<Tag[]>('local-tags', [])
  // 加载状态
  const loading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // 所有可见的标签 (合并本地和远程，过滤掉隐藏的标签)
  const allTags = computed(() => {
    // 如果用户已登录，返回已同步的标签加上本地标签
    if (authStore.isAuthenticated) {
      const visibleTags = tags.value.filter(tag => 
        // 显示所有自己创建的标签和其他用户的公开标签
        !tag.isHidden || tag.userId === authStore.currentUser?.id
      )
      return [...visibleTags, ...localTags.value]
    }
    // 游客模式，只返回本地标签和公开的远程标签
    return [...tags.value.filter(tag => !tag.isHidden), ...localTags.value]
  })

  // 获取所有可见标签
  async function fetchAllTags() {
    // 游客模式不需要获取远程标签
    if (!authStore.isAuthenticated) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await tagsApi.getAllTags()
      tags.value = response.data
      loading.value = false
    } catch (err) {
      console.error('Failed to fetch tags:', err)
      error.value = '获取标签失败'
      loading.value = false
    }
  }

  // 获取用户创建的标签
  async function fetchMyTags() {
    if (!authStore.isAuthenticated) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await tagsApi.getMyTags()
      tags.value = response.data
      loading.value = false
    } catch (err) {
      console.error('Failed to fetch user tags:', err)
      error.value = '获取个人标签失败'
      loading.value = false
    }
  }

  // 创建标签
  async function createTag(tagData: TagCreateDTO) {
    // 生成临时ID用于本地标识
    const tempId = Date.now()
    const tempTag: Tag = {
      id: tempId,
      name: tagData.name,
      userId: authStore.currentUser?.id || 0,
      isHidden: tagData.isHidden || false,
      createdAt: new Date().toISOString()
    }
    
    // 先保存到本地
    localTags.value.push(tempTag)
    
    // 如果用户已登录，尝试同步到服务器
    if (authStore.isAuthenticated) {
      try {
        const response = await tagsApi.createTag(tagData)
        
        // 更新本地存储，移除临时标签，添加从服务器返回的标签
        localTags.value = localTags.value.filter(t => t.id !== tempId)
        tags.value.push(response.data)
        
        return response.data
      } catch (err) {
        console.error('Failed to create tag:', err)
        return tempTag
      }
    } else {
      // 游客模式，只保存在本地
      return tempTag
    }
  }

  // 更新标签可见性
  async function updateTagVisibility(id: number, isHidden: boolean) {
    // 检查是否为本地标签
    const isLocal = localTags.value.some(t => t.id === id)
    
    if (isLocal) {
      // 更新本地标签
      const index = localTags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        localTags.value[index].isHidden = isHidden
      }
    } else if (authStore.isAuthenticated) {
      // 更新远程标签
      try {
        const response = await tagsApi.updateTagVisibility(id, isHidden)
        
        // 更新本地缓存
        const index = tags.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tags.value[index] = response.data
        }
      } catch (err) {
        console.error('Failed to update tag visibility:', err)
      }
    }
  }

  return {
    tags,
    localTags,
    allTags,
    loading,
    error,
    fetchAllTags,
    fetchMyTags,
    createTag,
    updateTagVisibility
  }
})