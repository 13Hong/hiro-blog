<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  date?: string;
  githubColor?: string;
  articles: number;
  contributions: number;
}>();

const total = computed(() => props.articles + props.contributions);
const getPointHeightStyle = (value: number) => {
  return isNaN(value) ? 0 : `${Math.floor(value * 100)}%`;
};

// 蓝色贡献色阶（从浅到深）
// 使用 CSS 变量适配亮/暗模式
const getContributionColor = computed(() => {
  const count = props.contributions;
  if (count === 0) return 'transparent';
  // 4 级蓝色，与主题强调色协调
  if (count === 1) return 'rgba(51, 153, 255, 0.35)';  // 最浅
  if (count <= 3) return 'rgba(51, 153, 255, 0.55)';   // 中等
  if (count <= 6) return 'rgba(51, 153, 255, 0.75)';   // 较深
  return 'rgba(51, 153, 255, 0.95)';                   // 最深
});
</script>

<template>
  <div
    class="day bg-background-tertiary"
    :data-date="date"
    :data-total-count="total"
    :data-contribution-count="contributions"
    data-pagefind-ignore
  >
    <div class="point">
      <div
        class="item article"
        :style="{ height: getPointHeightStyle(articles / total) }"
      />
      <!-- <div
        class="item instagram"
        :style="{ height: getPointHeightStyle(instagrams / total) }"
      /> -->
      <!-- <div
        class="item instagram"
        :style="{
          height: getPointHeightStyle(2 / 3),
          backgroundColor: '#f6a6ac',
        }"
      /> -->
      <div
        class="item contribution"
        :style="{
          height: getPointHeightStyle(contributions / total),
          backgroundColor: getContributionColor,
        }"
      />
    </div>
    <div class="tooltip bg-background-overlay" v-if="total">
      <p class="date">{{ date }}</p>
      <ul class="counts">
        <li class="item article">
          <i class="iconfont icon-quill"></i>
          <span class="count">发生 {{ articles }} 次</span>
          articles
        </li>
        <li class="item contribution">
          <i class="iconfont icon-github"></i>
          <span class="count">发生 {{ contributions }} 次</span>
          contributions
        </li>
        <li class="item instagram">
          <i class="iconfont icon-instagram"></i>
          <span class="count">暂无数据</span>
          instagrams
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/mixins" as *;

li {
  text-decoration: none;
}

.day {
  $size: 11px;
  $radius: 2px;
  position: relative;
  width: 11px;
  height: 11px;
  border-radius: $radius;
  &.dark {
    background-color: #444;
    .point {
      filter: brightness(86%);
    }
    .tooltip {
      color: #444;
      #{--background}: rgba(#ffffff, 0.9);
    }
  }

  &:not([data-total-count="0"]) {
    &:hover {
      outline: 1px solid rgb(var(--color-border));
    }
    .point:hover {
      & + .tooltip {
        opacity: 1 !important;
        visibility: visible !important;
      }
    }
  }

  .point {
    display: block;
    width: 11px;
    height: 11px;
    border-radius: $radius;
    overflow: hidden;

    .item {
      width: 100%;
      &.article {
        background-color: #f8981d;
      }
      &.instagram {
        background-color: #ed4956;
      }
    }
  }

  .tooltip {
    #{--background}: rgba(#000000, 0.7);
    position: absolute;
    left: 22px;
    top: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    z-index: 0 + 1;
    padding: 8px 1rem;
    padding-right: 1rem;
    border-radius: 4px;
    color: rgb(var(--color-text-secondary));
    @include hidden();
    &::before {
      $size: 4px;
      content: "";
      position: absolute;
      left: -$size * 2;
      top: 50%;
      margin-top: -1px;
      width: 0;
      height: 0;
      border-top: $size * 1.5 solid transparent;
      border-right: $size * 2 solid var(--background);
      border-bottom: $size * 1.5 solid transparent;
    }

    .date {
      color: rgb(var(--color-text));
      font-weight: bold;
      margin-bottom: 4px;
    }

    .counts {
      margin: 0;
      padding: 0;
      list-style: none;

      .item {
        line-height: 1.8em;
        font-size: 12px;
        &.article {
          color: #f8981d;
          /* A token to indicate that twitter is no longer supported */
          // text-decoration: line-through;
        }

        &.instagram {
          color: #ed4956;
          /* A token to indicate that twitter is no longer supported */
          text-decoration: line-through;
        }

        &.contribution {
          color: rgb(var(--color-text));
        }

        .count {
          margin-left: 8px;
          font-weight: bold;
        }
      }
    }
  }

  /* articles */
  /* 5+ */
  &:not([data-article-count="0"]) {
    .point {
      .article {
        background-color: #f8981d;
      }
    }
  }
  /* 1 */
  &[data-article-count="1"] {
    .point {
      .article {
        background-color: color.scale(#f8981d, $lightness: 51%);
      }
    }
  }
  /* 2-4 */
  &[data-article-count="2"],
  &[data-article-count="3"],
  &[data-article-count="4"] {
    .point {
      .article {
        background-color: color.scale(#f8981d, $lightness: 25.5%);
      }
    }
  }

  /* instagrams */
  /* 3+ */
  &:not([data-instagram-count="0"]) {
    .point {
      .instagram {
        background-color: #ed4956;
      }
    }
  }
  /* 1 */
  &[data-instagram-count="1"] {
    .point {
      .instagram {
        background-color: color.scale(#ed4956, $lightness: 51%);
      }
    }
  }
  /* 2 */
  &[data-instagram-count="2"],
  &[data-instagram-count="3"] {
    .point {
      .instagram {
        background-color: color.scale(#ed4956, $lightness: 25.5%);
      }
    }
  }
}
</style>
