/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#269B61',
        accent: '#34CF5D',
      },
    },
  },
  corePlugins: {
    preflight: false, // 기존 스타일 유지
  },
  plugins: [],
};


