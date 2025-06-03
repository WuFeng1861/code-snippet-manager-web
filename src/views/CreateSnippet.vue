<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSnippetsStore } from '../stores/snippets'
import { useTagsStore } from '../stores/tags'
import { useAuthStore } from '../stores/auth'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const router = useRouter()
const { t } = useI18n()
const snippetsStore = useSnippetsStore()
const tagsStore = useTagsStore()
const authStore = useAuthStore()

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
const loading = ref(false)
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

// 可选择的标签列表
const selectableTags = computed(() => {
  if (authStore.isAuthenticated) {
    // 登录用户可以看到自己的所有标签和其他用户的可选择标签
    return tagsStore.allTags.filter(tag =>
      !tag.isHidden || tag.userId == authStore.currentUser?.id
    )
  } else {
    // 游客只能看到本地标签和可选择的远程标签
    return tagsStore.allTags.filter(tag => !tag.isHidden)
  }
})

// 创建代码片段
const createSnippet = async () => {
  if (!isFormValid.value) {
    error.value = t('errors.required', { field: t('snippets.title') }) + ', ' +
                  t('errors.required', { field: t('snippets.content') })
    return
  }

  loading.value = true
  error.value = ''

  try {
    const snippet = await snippetsStore.createSnippet({
      title: title.value,
      content: content.value,
      description: description.value,
      language: language.value,
      tagIds: selectedTagIds.value
    })

    // 导航到片段列表
    router.push({ name: 'Snippets' })
  } catch (err) {
    console.error('Failed to create snippet:', err)
    error.value = t('errors.serverError')
  } finally {
    loading.value = false
  }
}

// 创建新标签
const createTag = async () => {
  if (!newTagName.value.trim()) return

  try {
    const tag = await tagsStore.createTag({
      name: newTagName.value,
      isHidden: false // 默认可选择
    })
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

// 取消创建
const cancel = () => {
  router.push({ name: 'Snippets' })
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('snippets.create') }}
      </h1>
    </div>

    <!-- 创建表单 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form @submit.prevent="createSnippet" class="space-y-6">
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
          <div v-if="selectableTags.length > 0" class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="tag in selectableTags"
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
            :disabled="loading || !isFormValid"
            class="btn btn-primary"
          >
            <span v-if="loading">{{ t('common.loading') }}</span>
            <span v-else>{{ t('snippets.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
