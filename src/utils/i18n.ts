/**
 * 国际化工具函数
 * 
 * 语言检测优先级：localStorage > navigator.language > 默认 zh-CN
 */

export type LocaleType = 'zh-CN' | 'en-US'

const LOCALE_KEY = 'locale'
const DEFAULT_LOCALE: LocaleType = 'zh-CN'

/**
 * 导航栏翻译映射
 */
export const navTranslations: Record<LocaleType, Record<string, string>> = {
  'zh-CN': {
    'home': '首页',
    'article': '文章归档',
    'aboutme': '关于我',
    'photo': '生活相册',
    'rss': 'RSS 订阅',
    'blogSince': '博客始于'
  },
  'en-US': {
    'home': 'Home',
    'article': 'Archives',
    'aboutme': 'About Me',
    'photo': 'Gallery',
    'rss': 'RSS',
    'blogSince': 'Blog since'
  }
}

/**
 * 从 localStorage 读取语言设置
 */
export function getStoredLocale(): LocaleType | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored === 'zh-CN' || stored === 'en-US') {
    return stored as LocaleType
  }
  return null
}

/**
 * 通过浏览器语言检测默认语言
 */
export function detectBrowserLocale(): LocaleType {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  
  const languages = navigator.languages || [navigator.language]
  
  for (const lang of languages) {
    const lowerLang = lang.toLowerCase()
    if (lowerLang.startsWith('zh')) {
      return 'zh-CN'
    }
    if (lowerLang.startsWith('en')) {
      return 'en-US'
    }
  }
  
  return DEFAULT_LOCALE
}

/**
 * 初始化语言设置
 * 优先级：localStorage > 浏览器检测 > 默认中文
 */
export function initLocale(): LocaleType {
  const stored = getStoredLocale()
  if (stored) return stored
  
  const detected = detectBrowserLocale()
  setLocale(detected)
  return detected
}

/**
 * 设置并持久化语言
 */
export function setLocale(locale: LocaleType): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCALE_KEY, locale)
}

/**
 * 获取当前语言
 * 优先级：localStorage > 浏览器检测 > 默认中文
 */
export function getCurrentLocale(): LocaleType {
  const stored = getStoredLocale()
  if (stored) return stored
  return detectBrowserLocale()
}

/**
 * 获取导航文本翻译
 */
export function getNavText(key: string, locale?: LocaleType): string {
  const currentLocale = locale || getCurrentLocale()
  return navTranslations[currentLocale]?.[key] || key
}

/**
 * 触发语言变更事件
 */
export function dispatchLocaleChange(locale: LocaleType): void {
  if (typeof window === 'undefined') return
  document.dispatchEvent(
    new CustomEvent('locale-change', { detail: { locale } })
  )
}
