<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import ImageModal from "./ImageModal.vue";

// In order to solve [ERROR] [vite] Could not resolve "../../../src/server/getters/photoalbum" from "src/components/vue/Photoalbum.vue"
// I put it here temporarily
const data = ref({
  images: [
   {
      label: "周也🎶",
      time: "2025/12/25",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/zhouye1.jpg",
    },
    {
      label: "周也😄",
      time: "2025/12/25",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/zhouye2.jpg",
    },
    {
      label: "周也🧧",
      time: "2025/12/25",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/zhouye3.jpg",
    },
    {
      label: "周也👸🏻",
      time: "2025/12/25",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/zhouye4.jpg",
    },
    {
      label: "睡觉猫猫🐱💤",
      time: "2025/10/12",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/202510123.jpg",
    },
    {
      label: "睡觉猫猫🐱💤",
      time: "2025/10/12",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/202510121.jpg",
    },
    {
      label: "高速猫猫🐱",
      time: "2025/10/12",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20251012.jpg",
    },
    {
      label: "露营喝茶🍵",
      time: "2024/10/11",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20251011.jpg",
    },
    {
      label: "日落🌄",
      time: "2025/10/07",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20251007.jpg",
    },
    {
      label: "看门狗🐶",
      time: "2024/07/13",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240713.jpg",
    },
    {
      label: "家乡猫🐱",
      time: "2024/06/08",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/202406081.jpg",
    },
    {
      label: "家乡猫🐱",
      time: "2024/06/08",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240608.jpg",
    },
    {
      label: "温馨一家猫🐱",
      time: "2024/05/04",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240504.jpg",
    },
    {
      label: "玉龙雪山🏔️",
      time: "2024/02/11",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/202402111.jpg",
    },
    {
      label: "玉龙雪山🏔️",
      time: "2024/02/11",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240211.jpg",
    },
    {
      label: "灰背鸫",
      time: "2024/02/10",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240210.jpg",
    },
    {
      label: "日出🌄",
      time: "2024/02/08",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/202402081.jpg",
    },
    {
      label: "日出🌄",
      time: "2024/02/08",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240208.jpg",
    },
    {
      label: "红嘴鸥",
      time: "2024/02/05",
      size: {
        width: 0,
        height: 0,
      },
      href: "https://img.hiro7.info/images/20240205.jpg",
    },
  ],
});

const isAlertVisible = ref(false);
const currentIndex = ref(0);
const isModalVisible = ref(false);

const isMobile = computed(() => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
});

const openModal = (index: number) => {
  if (!isMobile.value) {
    currentIndex.value = index;
    isModalVisible.value = true;
  } else {
    // TODO: Temporary processing, will be optimized later
    alert("对不起，暂不支持手机查看，请上电脑查看");
  }
};

const handleImageChange = (newIndex: number) => {
  currentIndex.value = newIndex;
};
</script>

<template>
  <div class="md:ml-0 md:mr-20 pb-10" data-pagefind-ignore>
    <div class="flex flex-wrap">
      <div
        v-for="(image, index) in data.images"
        :key="index"
        class="w-2/4 md:w-1/4 p-1 2xl:p-3 md:p-3 h-17 relative"
      >
        <div class="relative group rounded-md overflow-hidden">
          <div class="date-top">
            <div class="group-hover:opacity-0 transition duration-200">
              <span class="date-label group-hover:opacity-0 transition duration-200"
                >"{{ image.label }}"</span
              >
            </div>
          </div>
          <a data-cropped="true" class="block overflow-hidden">
            <div class="transition-transform transform group-hover:scale-110">
              <div class="transform-img">
                <img
                  :src="image.href"
                  :alt="image.label"
                  class="img-width"
                  @click="openModal(index)"
                />
              </div>
            </div>
          </a>
          <div class="date-container">
            <div class="group-hover:opacity-0 transition duration-200">
              <span class="date-label group-hover:opacity-0 transition duration-200">{{
                image.time
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <image-modal
    :images="data.images"
    :current-index="currentIndex"
    :is-visible="isModalVisible"
    @close="isModalVisible = false"
    @change="handleImageChange"
  />
  <div v-if="isAlertVisible" class="alert-modal">
    <p>对不起，暂不支持手机查看，请上电脑查看</p>
    <button @click="isAlertVisible = false">关闭</button>
  </div>
</template>

<style lang="scss" scoped>
.date-container {
  position: absolute;
  bottom: 0.318rem;
  left: 0.5rem;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}
.date-top {
  position: absolute;
  top: 0.318rem;
  left: 0.5rem;
  color: #fff;
  z-index: 999;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.date-label {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.transform-img {
  width: 100%;
  height: 260px;
  position: relative;
}
.img-width {
  width: 100%;
  height: 260px;
  object-fit: cover;
}
</style>
