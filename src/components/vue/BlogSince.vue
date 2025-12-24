<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { LocaleType } from '@/utils/i18n'
import { getCurrentLocale, getNavText, initLocale } from '@/utils/i18n'

const props = defineProps<{
  since: string
}>()

const currentLocale = ref<LocaleType>('zh-CN')

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
  <span>{{ getNavText('blogSince', currentLocale) }} {{ since }}</span>
</template>
