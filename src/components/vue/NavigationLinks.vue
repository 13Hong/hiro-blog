<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { LocaleType } from '@/utils/i18n'
import { getCurrentLocale, getNavText, initLocale } from '@/utils/i18n'

interface NavItem {
  key: string
  url: string
}

const props = defineProps<{
  navs: NavItem[]
  currentPath: string
}>()

const currentLocale = ref<LocaleType>('zh-CN')

// 计算当前路径，移除尾部斜杠
const trimmedPath = computed(() => {
  return props.currentPath === '/' 
    ? props.currentPath 
    : props.currentPath.replace(/\/$/, '')
})

// 判断是否为激活状态
const isActive = (url: string) => {
  return trimmedPath.value === url
}

// 获取翻译后的导航文本
const getNavTitle = (key: string) => {
  return getNavText(key, currentLocale.value)
}

// 监听语言变更事件
const handleLocaleChange = (event: CustomEvent<{ locale: LocaleType }>) => {
  currentLocale.value = event.detail.locale
}

onMounted(() => {
  currentLocale.value = initLocale()
  document.addEventListener('locale-change', handleLocaleChange as EventListener)
})

onUnmounted(() => {
  document.removeEventListener('locale-change', handleLocaleChange as EventListener)
})
</script>

<template>
  <div class="flex lg:flex-col gap-4 mx-auto nav-webfont">
    <a
      v-for="nav in navs"
      :key="nav.key"
      :href="nav.url"
      :class="{ 'active': isActive(nav.url) }"
      :rel="nav.url.startsWith('http') ? 'noopener' : undefined"
    >
      {{ getNavTitle(nav.key) }}
    </a>
  </div>
</template>

<style scoped>
/* 导航链接样式继承自全局 .nav-webfont */
</style>
