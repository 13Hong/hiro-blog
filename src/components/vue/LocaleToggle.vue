<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { LocaleType } from '@/utils/i18n'
import { getCurrentLocale, setLocale, dispatchLocaleChange, initLocale } from '@/utils/i18n'

const currentLocale = ref<LocaleType>('zh-CN')

onMounted(() => {
  // 初始化语言设置
  currentLocale.value = initLocale()
})

const toggleLocale = () => {
  // 切换语言
  currentLocale.value = currentLocale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  
  // 持久化到 localStorage
  setLocale(currentLocale.value)
  
  // 触发自定义事件供其他组件监听
  dispatchLocaleChange(currentLocale.value)
}
</script>

<template>
  <div class="locale-toggle">
    <button
      :aria-label="currentLocale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
      :title="currentLocale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
      @click="toggleLocale"
    >
      <!-- 中文图标 -->
      <img 
        v-show="currentLocale === 'zh-CN'" 
        src="/chinese.svg" 
        alt="中文" 
        class="locale-icon"
      />
      <!-- 英文图标 -->
      <img 
        v-show="currentLocale === 'en-US'" 
        src="/english.svg" 
        alt="English" 
        class="locale-icon"
      />
    </button>
  </div>
</template>

<style scoped>
.locale-toggle {
  position: relative;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--color-text));
  transition: color 0.2s ease, transform 0.2s ease;
}

.locale-toggle:hover {
  color: rgb(var(--color-accent));
  transform: scale(1.1);
}

.locale-toggle:focus-visible {
  outline: 2px solid rgb(var(--color-accent));
  outline-offset: 2px;
  border-radius: 4px;
}

.locale-icon {
  width: 22px;
  height: 22px;
}
</style>
