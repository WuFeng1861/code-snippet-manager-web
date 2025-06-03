<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSnippetsStore } from '../stores/snippets'
import { useTagsStore } from '../stores/tags'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()

// 代码片段
const snippet = ref(null)
const loading = ref(true)
const error = ref('')

// 复制功能
const isCopied = ref(false)

onMounted(async () => {
  try {
    const id = parseInt(route.params.id as string)
    snippet.value = await snippetsStore.getSnippet(id)

    if (!snippet.value) {
      error.value = t('errors.notFound')
    } else {
      // 代码高亮
      setTimeout(() => {
        hljs.highlightAll()
      }, 0)
    }
  } catch (err) {
    console.error('Failed to fetch snippet:', err)
    error.value = t('errors.serverError')
  } finally {
    loading.value = false
  }
})

// 复制代码到剪贴板
const copyToClipboard = () => {
  if (!snippet.value) return

  navigator.clipboard.writeText(snippet.value.content)
    .then(() => {
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy:', err)
    })
}

// 编辑代码片段
const editSnippet = () => {
  router.push({ name: 'EditSnippet', params: { id: route.params.id } })
}

// 删除代码片段
const deleteSnippet = async () => {
  if (!snippet.value) return

  if (confirm(t('snippets.confirmDelete'))) {
    try {
      await snippetsStore.deleteSnippet(snippet.value.id)
      router.push({ name: 'Snippets' })
    } catch (err) {
      console.error('Failed to delete snippet:', err)
    }
  }
}

// 返回列表
const goBack = () => {
  router.push({ name: 'Snippets' })
}

// 获取标签名称
const getTagName = (tagId: number) => {
  const tag = tagsStore.allTags.find(t => Number(t.id) === Number(tagId))
  return tag ? tag.name : tagId
}
</script>

<template>
  <div class="animate-fade-in">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
      <div class="text-danger-600 dark:text-danger-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ t('common.error') }}
      </h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ error }}
      </p>
      <button
        @click="goBack"
        class="mt-4 btn btn-primary"
      >
        {{ t('common.back') }}
      </button>
    </div>

    <!-- 代码片段详情 -->
    <div v-else-if="snippet" class="space-y-6">
      <div class="flex justify-between items-center">
        <button
          @click="goBack"
          class="btn btn-ghost flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ t('common.back') }}
        </button>

        <div class="flex space-x-3">
          <button
            @click="editSnippet"
            class="btn btn-secondary"
          >
            {{ t('snippets.edit') }}
          </button>
          <button
            @click="deleteSnippet"
            class="btn btn-danger"
          >
            {{ t('snippets.delete') }}
          </button>
        </div>
      </div>

      <!-- 片段内容 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <!-- 标题和描述 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ snippet.title }}
          </h1>
          <p v-if="snippet.description" class="mt-2 text-gray-600 dark:text-gray-400">
            {{ snippet.description }}
          </p>

          <!-- 标签和语言 -->
          <div class="mt-4 flex flex-wrap gap-2 items-center">
            <span class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {{ snippet.language }}
            </span>

            <span
              v-for="tagId in snippet.tagIds"
              :key="tagId"
              class="px-3 py-1 text-sm rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400"
            >
              {{ getTagName(tagId) }}
            </span>
          </div>
        </div>

        <!-- 代码内容 -->
        <div class="relative">
          <!-- 代码内容 -->
          <pre class="p-6 bg-gray-100 dark:bg-gray-900 overflow-x-auto"><code class="language-{{ snippet.language.toLowerCase() }}">{{ snippet.content }}</code></pre>

          <!-- 复制按钮 -->
          <button
            @click="copyToClipboard"
            class="absolute top-4 right-4 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :title="isCopied ? t('common.yes') : t('common.copy')"
          >
            <svg v-if="isCopied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success-600 dark:text-success-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
