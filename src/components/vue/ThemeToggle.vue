<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // 从 DOM 读取当前主题状态
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = () => {
  isDark.value = !isDark.value

  // 更新 DOM class
  document.documentElement.classList.toggle('dark', isDark.value)

  // 持久化到 localStorage
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

  // 触发自定义事件供其他组件监听
  document.dispatchEvent(
    new CustomEvent('theme-change', { detail: { theme: isDark.value ? 'dark' : 'light' } })
  )
}
</script>

<template>
  <button
    class="theme-toggle"
    :aria-pressed="isDark"
    aria-label="Toggle dark mode"
    @click="toggleTheme"
  >
    <span class="theme-toggle__track">
      <span class="theme-toggle__thumb" :class="{ 'is-dark': isDark }">
        <!-- 太阳图标 -->
        <svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <g class="sun-rays">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </g>
        </svg>
        <!-- 月亮图标 -->
        <svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  --toggle-width: 52px;
  --toggle-height: 26px;
  --toggle-padding: 3px;

  position: relative;
  width: var(--toggle-width);
  height: var(--toggle-height);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: none;
  padding: 0;
}

.theme-toggle__track {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #87CEEB 0%, #B4E1FF 100%);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background 0.4s ease;
}

:global(.dark) .theme-toggle__track {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d3a4f 100%);
}

.theme-toggle__thumb {
  position: absolute;
  top: var(--toggle-padding);
  left: var(--toggle-padding);
  width: calc(var(--toggle-height) - var(--toggle-padding) * 2);
  height: calc(var(--toggle-height) - var(--toggle-padding) * 2);
  border-radius: 50%;
  background: linear-gradient(145deg, #fff 0%, #f0f0f0 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.theme-toggle__thumb.is-dark {
  transform: translateX(calc(var(--toggle-width) - var(--toggle-height)));
  background: linear-gradient(145deg, #3a3f4b 0%, #2d3748 100%);
}

.theme-toggle__icon {
  position: absolute;
  width: 12px;
  height: 12px;
  transition: opacity 0.3s ease, transform 0.4s ease;
}

.theme-toggle__icon--sun {
  fill: #fbbf24;
  stroke: #fbbf24;
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.theme-toggle__icon--moon {
  fill: #94a3b8;
  stroke: none;
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-toggle__thumb.is-dark .theme-toggle__icon--sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.theme-toggle__thumb.is-dark .theme-toggle__icon--moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* 太阳光线微动画 */
.sun-rays line {
  stroke: #fbbf24;
  stroke-width: 2;
  stroke-linecap: round;
}

/* 聚焦状态 */
.theme-toggle:focus-visible .theme-toggle__track {
  outline: 2px solid rgb(var(--color-accent));
  outline-offset: 2px;
}

/* 悬停效果 */
.theme-toggle:hover .theme-toggle__thumb {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}
</style>
