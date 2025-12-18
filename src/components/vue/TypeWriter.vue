<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Typed from 'typed.js'

interface Props {
  strings: string[]
  typeSpeed?: number
  backSpeed?: number
  backDelay?: number
  loop?: boolean
  showCursor?: boolean
  cursorChar?: string
}

const props = withDefaults(defineProps<Props>(), {
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 2000,
  loop: true,
  showCursor: true,
  cursorChar: '|'
})

const typedElement = ref<HTMLSpanElement | null>(null)
let typed: Typed | null = null

onMounted(() => {
  if (typedElement.value) {
    typed = new Typed(typedElement.value, {
      strings: props.strings,
      typeSpeed: props.typeSpeed,
      backSpeed: props.backSpeed,
      backDelay: props.backDelay,
      loop: props.loop,
      showCursor: props.showCursor,
      cursorChar: props.cursorChar,
      smartBackspace: true,
    })
  }
})

onUnmounted(() => {
  // 正确销毁实例，避免内存泄漏
  if (typed) {
    typed.destroy()
    typed = null
  }
})
</script>

<template>
  <span ref="typedElement" class="typed-text"></span>
</template>

<style scoped>
.typed-text {
  /* 继承父元素样式 */
  color: inherit;
}

/* 光标样式 - 使用 :deep() 穿透到 typed.js 注入的光标元素 */
:deep(.typed-cursor) {
  color: rgb(var(--color-accent));
  font-weight: normal;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}
</style>
