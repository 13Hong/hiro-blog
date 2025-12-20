/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// ========================================
				// 语义化颜色 (Semantic Colors)
				// 通过 CSS 变量实现主题切换，无需 dark: 前缀
				// ========================================
				background: {
					DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
					secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
					tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
					overlay: 'rgb(var(--color-bg-overlay) / <alpha-value>)',
				},
				foreground: {
					DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
					secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
					muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
					inverted: 'rgb(var(--color-text-inverted) / <alpha-value>)',
					name: 'rgb(var(--color-name) / <alpha-value>)',  /* 名称蓝色，支持亮暗模式 */
				},
				border: {
					DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
					light: 'rgb(var(--color-border-light) / <alpha-value>)',
				},
				accent: {
					DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
					hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
				},
				card: {
					DEFAULT: 'rgb(var(--color-card-bg) / <alpha-value>)',
					border: 'rgb(var(--color-card-border) / <alpha-value>)',
				},

				// ========================================
				// 功能色 (Functional Colors)
				// 不随主题变化
				// ========================================
				success: 'rgb(var(--color-success) / <alpha-value>)',
				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				error: 'rgb(var(--color-error) / <alpha-value>)',
				info: 'rgb(var(--color-info) / <alpha-value>)',

				// ========================================
				// 兼容层 (Legacy Colors)
				// TODO: 逐步迁移后删除这些颜色
				// ========================================
				snowfallWhite: '#dedede',
				crystalClear: "#FFFFFFE5",
				techNoir: "#000000E5",
				lightGray: '#444444',
				lunarLight: '#eebbeeec',
				markerShadow: 'rgba(68, 68, 68, .6)',
				dullGrey: '#B2C5DE',
				frostedGlass: 'rgba(255, 255, 255, .6)',
				codeReveal: 'rgba(255, 255, 255, .9)',
				secondary: 'rgba(240, 240, 240, .5)',
				commentBackground: '#ffffffe5',
			},
			fontFamily: {
				sans: ['Manrope', ...defaultTheme.fontFamily.sans],
				display: ['Manrope', ...defaultTheme.fontFamily.sans],
				mono: ['JetBrains Mono', 'Consolas', 'monospace'],
			},
			spacing: {
				// 黄金比例间距 (用于文章/导航)
				'article': '1.236rem',
				'section': '2.472rem',
				'nav': '0.618rem',
			},
			fontSize: {
				// 博客专用字号
				'article-body': ['1rem', { lineHeight: '1.8' }],
				'article-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
				'meta': ['0.875rem', { lineHeight: '1.5' }],
			},
		}
	}
}

