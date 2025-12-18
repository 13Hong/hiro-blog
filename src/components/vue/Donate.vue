<template>
  <div id="iak-twikoo"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { twikoo } from "../../config";

const loadTwikoo = () => {
  const script = document.createElement("script");
  script.textContent = `
    twikoo.init({
      envId: "${twikoo.url}",
      el: "#iak-twikoo"
    });
  `;
  document.head.append(script);

  const twikooElement = document.querySelector('#twikoo');
  if (twikooElement) {
    // 使用语义化颜色 class，无需 dark: 前缀
    twikooElement.classList.add('bg-background-secondary/90');
  }
};

const onPopState = () => {
  loadTwikoo();
};

onMounted(() => {
  window.addEventListener("popstate", onPopState);
  loadTwikoo();
});

onUnmounted(() => {
  window.removeEventListener("popstate", onPopState);
});
</script>
