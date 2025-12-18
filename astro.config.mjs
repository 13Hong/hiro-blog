import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: 'shiki',
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      // Choose Shiki's built-in theme (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dark-plus',
      wrap: false,
    },
  },
  site: 'https://hiroblog.netlify.app/',
  integrations: [tailwind(), vue()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 使用现代 Sass API，消除 legacy-js-api 警告
          api: 'modern-compiler',
        },
      },
    },
  },
});
