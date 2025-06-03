<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSnippetsStore } from '../stores/snippets'
import { useTagsStore } from '../stores/tags'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
// 导入常用的编程语言支持
import 'highlight.js/lib/languages/javascript'
import 'highlight.js/lib/languages/typescript'
import 'highlight.js/lib/languages/xml'
import 'highlight.js/lib/languages/css'
import 'highlight.js/lib/languages/python'
import 'highlight.js/lib/languages/java'
import 'highlight.js/lib/languages/cpp'
import 'highlight.js/lib/languages/csharp'
import 'highlight.js/lib/languages/php'
import 'highlight.js/lib/languages/ruby'
import 'highlight.js/lib/languages/go'
import 'highlight.js/lib/languages/rust'
import 'highlight.js/lib/languages/shell'
import 'highlight.js/lib/languages/sql'
import 'highlight.js/lib/languages/json'
import 'highlight.js/lib/languages/yaml'
import 'highlight.js/lib/languages/markdown'

const router = useRouter()
const { t } = useI18n()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()

// 搜索和筛选
const searchQuery = ref('')
const selectedTags = ref<number[]>([])
const selectedLanguage = ref('')

// 编程语言列表
const languageOptions = [
  { value: '', label: t('common.filter') },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'shell', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
]

// 获取所有片段
onMounted(() => {
  snippetsStore.fetchSnippets()
  tagsStore.fetchAllTags()
})

// 过滤的片段
const filteredSnippets = computed(() => {
  return snippetsStore.allSnippets.filter(snippet => {
    // 搜索标题和描述
    const matchesSearch =
      searchQuery.value === '' ||
      snippet.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (snippet.description && snippet.description.toLowerCase().includes(searchQuery.value.toLowerCase()))

    // 标签筛选
    const matchesTags =
      selectedTags.value.length === 0 ||
      selectedTags.value.some(tagId => snippet.tagIds.includes(tagId))

    // 语言筛选
    const matchesLanguage =
      selectedLanguage.value === '' ||
      snippet.language.toLowerCase() === selectedLanguage.value.toLowerCase()

    return matchesSearch && matchesTags && matchesLanguage
  })
})

// 导航到片段详情
const viewSnippet = (id: number) => {
  router.push({ name: 'SnippetDetail', params: { id } })
}

// 创建新片段
const createSnippet = () => {
  router.push({ name: 'CreateSnippet' })
}

// 删除片段
const deleteSnippet = async (id: number, event: Event) => {
  event.stopPropagation()
  if (confirm(t('snippets.confirmDelete'))) {
    await snippetsStore.deleteSnippet(id)
  }
}

// 切换标签选中状态
const toggleTagSelection = (tagId: number) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// 获取代码片段同步状态
const getSyncStatus = (id: number) => {
  return snippetsStore.syncStatusMap[id] || 'local'
}

// 代码高亮处理函数
const highlightCode = (code: string, language: string) => {
  try {
    // 处理特殊语言映射
    const languageMap: Record<string, string> = {
      'html': 'xml',
      'c': 'cpp',
      'vue': 'javascript',
      'react': 'javascript'
    }

    const mappedLanguage = languageMap[language.toLowerCase()] || language.toLowerCase()

    // 如果语言不存在，使用纯文本
    if (!hljs.getLanguage(mappedLanguage)) {
      return hljs.highlightAuto(code).value
    }

    return hljs.highlight(code, { language: mappedLanguage }).value
  } catch (error) {
    console.error('Highlight error:', error)
    return code // 出错时返回原始代码
  }
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('navigation.snippets') }}
      </h1>

      <button
        @click="createSnippet"
        class="btn btn-primary flex items-center"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        {{ t('snippets.create') }}
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 搜索框 -->
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="input pl-10"
              :placeholder="t('common.search')"
            />
          </div>
        </div>

        <!-- 语言筛选 -->
        <div class="w-full md:w-48">
          <select
            v-model="selectedLanguage"
            class="input"
          >
            <option v-for="option in languageOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div v-if="tagsStore.allTags.length > 0" class="mt-4">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ t('snippets.tags') }}:
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in tagsStore.allTags"
            :key="tag.id"
            @click="toggleTagSelection(tag.id)"
            :class="[
              'px-2 py-1 text-xs rounded-full transition-colors duration-200',
              selectedTags.includes(tag.id)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 代码片段列表 -->
    <div v-if="filteredSnippets.length > 0" class="space-y-4">
      <div
        v-for="snippet in filteredSnippets"
        :key="snippet.id"
        @click="viewSnippet(snippet.id)"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <div class="p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ snippet.title }}
              </h3>
              <p v-if="snippet.description" class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {{ snippet.description }}
              </p>
            </div>

            <!-- 同步状态指示器 -->
            <div class="ml-4 flex items-center">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  getSyncStatus(snippet.id) === 'synced'
                    ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400'
                    : getSyncStatus(snippet.id) === 'pending'
                      ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ t(`snippets.uploadStatus.${getSyncStatus(snippet.id)}`) }}
              </span>
            </div>
          </div>

          <!-- 标签和语言 -->
          <div class="mt-2 flex flex-wrap gap-2 items-center">
            <span class="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {{ snippet.language }}
            </span>

            <span
              v-for="tagId in snippet.tagIds"
              :key="tagId"
              class="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400"
            >
              {{ tagsStore.allTags.find(t => Number(t.id) === Number(tagId))?.name || tagId}}
            </span>
          </div>

          <!-- 代码预览 -->
          <div class="mt-3 relative">
            <pre class="text-sm bg-gray-100 dark:bg-gray-900 rounded-md p-3 overflow-x-auto max-h-40">
              <code v-html="highlightCode(snippet.content.slice(0, 200) + (snippet.content.length > 200 ? '...' : ''), snippet.language)"></code>
            </pre>

            <!-- 操作按钮 -->
            <div class="absolute top-2 right-2 flex space-x-2">
              <button
                @click="deleteSnippet(snippet.id, $event)"
                class="p-1 rounded-md text-gray-500 hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
    >
      <div class="text-gray-500 dark:text-gray-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        {{ t('snippets.noSnippets') }}
      </h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ t('snippets.createFirst') }}
      </p>
      <button
        @click="createSnippet"
        class="mt-4 btn btn-primary"
      >
        {{ t('snippets.create') }}
      </button>
    </div>
  </div>
</template>
