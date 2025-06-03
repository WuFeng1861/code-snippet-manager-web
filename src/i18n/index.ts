import { createI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 支持的语言列表
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 获取本地存储中保存的语言或默认使用中文
const storedLocale = useStorage<SupportedLocale>('locale', 'zh-CN')

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: storedLocale.value,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

// 设置语言的工具函数
export function setLocale(locale: SupportedLocale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    storedLocale.value = locale
    i18n.global.locale.value = locale
    document.querySelector('html')?.setAttribute('lang', locale)
  }
}

export default i18n