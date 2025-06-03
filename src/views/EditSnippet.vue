<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

// 表单数据
const title = ref('')
const content = ref('')
const description = ref('')
const language = ref('javascript')
const selectedTagIds = ref<number[]>([])

// 新标签输入
const newTagName = ref('')
const showNewTagInput = ref(false)

// 加载状态
const loading = ref(true)
const saving = ref(false)
const error = ref('')

// 验证表单
const isFormValid = computed(() => {
  return title.value.trim() !== '' && content.value.trim() !== ''
})

// 编程语言选项
const languageOptions = [
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

// 加载代码片段数据
onMounted(async () => {
  try {
    const id = parseInt(route.params.id as string)
    const snippet = await snippetsStore.getSnippet(id)

    if (!snippet) {
      error.value = t('errors.notFound')
      return
    }

    // 填充表单数据
    title.value = snippet.title
    content.value = snippet.content
    description.value = snippet.description || ''
    language.value = snippet.language
    selectedTagIds.value = snippet.tagIds.map(tagId => Number(tagId))
    console.log(snippet, 'snippet', languageOptions)
  } catch (err) {
    console.error('Failed to fetch snippet:', err)
    error.value = t('errors.serverError')
  } finally {
    loading.value = false
  }
})

// 更新代码片段
const updateSnippet = async () => {
  if (!isFormValid.value) {
    error.value = t('errors.required', { field: t('snippets.title') }) + ', ' +
                  t('errors.required', { field: t('snippets.content') })
    return
  }

  saving.value = true
  error.value = ''

  try {
    const id = parseInt(route.params.id as string)
    const snippet = await snippetsStore.updateSnippet({
      id,
      title: title.value,
      content: content.value,
      description: description.value,
      language: language.value,
      tagIds: selectedTagIds.value
    })

    // 导航到片段详情页
    router.push({ name: 'SnippetDetail', params: { id } })
  } catch (err) {
    console.error('Failed to update snippet:', err)
    error.value = t('errors.serverError')
  } finally {
    saving.value = false
  }
}

// 创建新标签
const createTag = async () => {
  if (!newTagName.value.trim()) return

  try {
    const tag = await tagsStore.createTag({ name: newTagName.value })
    selectedTagIds.value.push(tag.id)
    newTagName.value = ''
    showNewTagInput.value = false
  } catch (err) {
    console.error('Failed to create tag:', err)
  }
}

// 切换标签选中状态
const toggleTagSelection = (tagId: number) => {
  const index = selectedTagIds.value.indexOf(tagId)
  if (index === -1) {
    selectedTagIds.value.push(tagId)
  } else {
    selectedTagIds.value.splice(index, 1)
  }
}

// 取消编辑
const cancel = () => {
  router.back()
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('snippets.edit') }}
      </h1>
    </div>

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
        @click="cancel"
        class="mt-4 btn btn-primary"
      >
        {{ t('common.back') }}
      </button>
    </div>

    <!-- 编辑表单 -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form @submit.prevent="updateSnippet" class="space-y-6">
        <!-- 标题 -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('snippets.title') }} *
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            class="input mt-1"
            :placeholder="t('snippets.title')"
          />
        </div>

        <!-- 描述 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('snippets.description') }}
          </label>
          <textarea
            id="description"
            v-model="description"
            rows="2"
            class="input mt-1"
            :placeholder="t('snippets.description')"
          ></textarea>
        </div>

        <!-- 编程语言 -->
        <div>
          <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('snippets.language') }} *
          </label>
          <select
            id="language"
            v-model="language"
            required
            class="input mt-1"
          >
            <option v-for="option in languageOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 标签 -->
        <div>
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('snippets.tags') }}
            </label>
            <button
              type="button"
              @click="showNewTagInput = !showNewTagInput"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              + {{ t('tags.create') }}
            </button>
          </div>

          <!-- 已有标签选择 -->
          <div v-if="tagsStore.allTags.length > 0" class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="tag in tagsStore.allTags"
              :key="tag.id"
              type="button"
              @click="toggleTagSelection(tag.id)"
              :class="[
                'px-2 py-1 text-sm rounded-full transition-colors duration-200',
                selectedTagIds.includes(tag.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              ]"
            >
              {{ tag.name }}
            </button>
          </div>
          <div v-else class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ t('tags.noTags') }}
          </div>

          <!-- 新标签输入 -->
          <div v-if="showNewTagInput" class="mt-2 flex">
            <input
              v-model="newTagName"
              type="text"
              class="input flex-1"
              :placeholder="t('tags.name')"
            />
            <button
              type="button"
              @click="createTag"
              class="ml-2 btn btn-primary"
            >
              {{ t('common.create') }}
            </button>
          </div>
        </div>

        <!-- 代码内容 -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('snippets.content') }} *
          </label>
          <div class="mt-1 rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
            <textarea
              id="content"
              v-model="content"
              rows="12"
              required
              class="font-mono w-full p-3 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              :placeholder="t('snippets.content')"
            ></textarea>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="text-danger-600 dark:text-danger-400 text-sm">
          {{ error }}
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="cancel"
            class="btn btn-ghost"
          >
            {{ t('snippets.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving || !isFormValid"
            class="btn btn-primary"
          >
            <span v-if="saving">{{ t('common.loading') }}</span>
            <span v-else>{{ t('snippets.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
