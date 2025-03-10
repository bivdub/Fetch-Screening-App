/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,vue}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['lemonade']
  }
}
