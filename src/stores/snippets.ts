import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { snippetsApi } from '../api/snippets'
import { useAuthStore } from './auth'
import type { Snippet, SnippetCreateDTO } from '../types/snippet'

// 同步状态类型
type SyncStatus = 'synced' | 'pending' | 'local'

export const useSnippetsStore = defineStore('snippets', () => {
  // 存储所有代码片段
  const snippets = ref<Snippet[]>([])
  // 本地存储的代码片段
  const localSnippets = useStorage<Snippet[]>('local-snippets', [])
  // 待同步队列
  const syncQueue = useStorage<SnippetCreateDTO[]>('sync-queue', [])
  // 同步状态映射
  const syncStatusMap = useStorage<Record<number, SyncStatus>>('sync-status-map', {})
  // 加载状态
  const loading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  // 所有可见的代码片段 (合并本地和远程)
  const allSnippets = computed(() => {
    // 如果用户已登录，返回已同步的片段加上本地未同步的
    if (authStore.isAuthenticated) {
      return [...snippets.value, ...localSnippets.value]
    }
    // 游客模式，只返回本地片段
    return localSnippets.value
  })

  // 获取用户的代码片段
  async function fetchSnippets() {
    if (!authStore.isAuthenticated) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await snippetsApi.getMySnippets()
      snippets.value = response.data
      
      // 处理同步状态
      snippets.value.forEach(snippet => {
        syncStatusMap.value[snippet.id] = 'synced'
      })
      
      loading.value = false
    } catch (err) {
      console.error('Failed to fetch snippets:', err)
      error.value = '获取代码片段失败'
      loading.value = false
    }
  }

  // 创建代码片段
  async function createSnippet(snippet: SnippetCreateDTO) {
    // 生成临时ID用于本地标识
    const tempId = Date.now()
    const tempSnippet: Snippet = {
      id: tempId,
      ...snippet,
      userId: authStore.currentUser?.id || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      tagIds: snippet.tagIds || []
    }
    
    // 先保存到本地
    localSnippets.value.push(tempSnippet)
    syncStatusMap.value[tempId] = 'local'
    
    // 如果用户已登录，尝试同步到服务器
    if (authStore.isAuthenticated) {
      try {
        const response = await snippetsApi.createSnippet(snippet)
        
        // 更新本地存储，移除临时片段，添加从服务器返回的片段
        localSnippets.value = localSnippets.value.filter(s => s.id !== tempId)
        snippets.value.push(response.data)
        syncStatusMap.value[response.data.id] = 'synced'
        delete syncStatusMap.value[tempId]
        
        return response.data
      } catch (err) {
        console.error('Failed to create snippet:', err)
        
        // 添加到同步队列，稍后重试
        syncQueue.value.push(snippet)
        return tempSnippet
      }
    } else {
      // 游客模式，只保存在本地
      return tempSnippet
    }
  }

  // 删除代码片段
  async function deleteSnippet(id: number) {
    // 检查是否为本地片段
    const isLocal = localSnippets.value.some(s => s.id === id)
    
    // 从本地存储中删除
    localSnippets.value = localSnippets.value.filter(s => s.id !== id)
    
    // 如果是已同步的片段且用户已登录，从服务器删除
    if (!isLocal && authStore.isAuthenticated) {
      try {
        await snippetsApi.deleteSnippet(id)
        snippets.value = snippets.value.filter(s => s.id !== id)
        delete syncStatusMap.value[id]
      } catch (err) {
        console.error('Failed to delete snippet:', err)
        // 如果删除失败，恢复本地状态
        // 这里保持简单，实际应用可能需要更复杂的恢复逻辑
      }
    } else {
      // 如果是本地片段，直接删除
      delete syncStatusMap.value[id]
    }
  }

  // 获取单个代码片段
  async function getSnippet(id: number) {
    // 先查找本地片段
    const localSnippet = localSnippets.value.find(s => s.id === id)
    if (localSnippet) return localSnippet
    
    // 查找已加载的远程片段
    const cachedSnippet = snippets.value.find(s => s.id === id)
    if (cachedSnippet) return cachedSnippet
    
    // 如果用户已登录，从服务器获取
    if (authStore.isAuthenticated) {
      try {
        const response = await snippetsApi.getSnippet(id)
        return response.data
      } catch (err) {
        console.error('Failed to get snippet:', err)
        return null
      }
    }
    
    return null
  }

  // 同步队列处理函数，定期尝试同步
  function startSyncQueue() {
    // 每分钟尝试同步一次，最多同步10个
    const syncInterval = setInterval(async () => {
      if (!authStore.isAuthenticated || syncQueue.value.length === 0) return
      
      const batchSize = Math.min(syncQueue.value.length, 10)
      const batch = syncQueue.value.slice(0, batchSize)
      const remaining = syncQueue.value.slice(batchSize)
      
      for (const snippetData of batch) {
        try {
          const response = await snippetsApi.createSnippet(snippetData)
          
          // 查找对应的本地片段（如果存在）
          const localIndex = localSnippets.value.findIndex(
            s => s.title === snippetData.title && s.content === snippetData.content
          )
          
          if (localIndex !== -1) {
            const tempId = localSnippets.value[localIndex].id
            localSnippets.value.splice(localIndex, 1)
            delete syncStatusMap.value[tempId]
          }
          
          // 添加到已同步列表
          snippets.value.push(response.data)
          syncStatusMap.value[response.data.id] = 'synced'
        } catch (err) {
          console.error('Failed to sync snippet:', err)
          // 失败的留在队列中，等待下一次尝试
          remaining.push(snippetData)
        }
      }
      
      syncQueue.value = remaining
    }, 60000) // 每分钟执行一次
    
    // 组件卸载时清除定时器
    onCleanup(() => {
      clearInterval(syncInterval)
    })
  }
  
  // 清理函数，用于组件卸载时停止同步
  function onCleanup(fn: () => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', fn)
      return () => window.removeEventListener('beforeunload', fn)
    }
    return () => {}
  }

  // 启动同步队列
  startSyncQueue()

  return {
    snippets,
    localSnippets,
    syncQueue,
    syncStatusMap,
    loading,
    error,
    allSnippets,
    fetchSnippets,
    createSnippet,
    deleteSnippet,
    getSnippet,
  }
})