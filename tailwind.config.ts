import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontFamily: {
			display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			body: ['Karla', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			code: ['JetBrains Mono', 'ui-monospace', 'monospace'],
		},
		extend: {
			colors: {
				// Your custom pastel palette
				mauve: {
					DEFAULT: '#EBC2FF',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFFFF',
					300: '#F8E8FF',
					400: '#F2D5FF',
					500: '#EBC2FF',
					600: '#DF9AFF',
					700: '#D372FF',
					800: '#C74AFF',
					900: '#BB22FF',
				},
				periwinkle: {
					DEFAULT: '#A385E5',
					50: '#FFFFFF',
					100: '#F5F1FD',
					200: '#DED1F5',
					300: '#C7B1ED',
					400: '#B59BE9',
					500: '#A385E5',
					600: '#8661DC',
					700: '#6A3DD3',
					800: '#5430AB',
					900: '#3E2480',
				},
				glaucous: {
					DEFAULT: '#5D7BD5',
					50: '#EDF0FB',
					100: '#DBE2F7',
					200: '#B8C5EF',
					300: '#95A8E7',
					400: '#798CDE',
					500: '#5D7BD5',
					600: '#3A5EC9',
					700: '#2D49A0',
					800: '#203477',
					900: '#14204E',
				},
				'pearl-aqua': {
					DEFAULT: '#75DBCD',
					50: '#F0FCFB',
					100: '#E1F9F7',
					200: '#C3F3EF',
					300: '#A5EDE7',
					400: '#8DE4DC',
					500: '#75DBCD',
					600: '#4DCFBD',
					700: '#2FB9A5',
					800: '#259080',
					900: '#1A675B',
				},
				aqua: {
					DEFAULT: '#C2FFEE',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFFFF',
					300: '#FFFFFF',
					400: '#E8FFF8',
					500: '#C2FFEE',
					600: '#8AFFE0',
					700: '#52FFD2',
					800: '#1AFFC4',
					900: '#00E1A5',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'float': 'float 6s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
			},
		},
	},
	plugins: [],
};

export default config;