import tailwindcss from '@tailwindcss/vite'
import Aura from '@primeuix/themes/aura'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }],
      title: 'DogFindr'
    }
  },

  css: ['~/assets/css/main.css'],

  // modules: ['nuxt-security'],
  routeRules: {
    '/api/**': {
      proxy: 'https://frontend-take-home-service.fetch.com/**'
    }
  },

  modules: ['@nuxt/eslint', '@primevue/nuxt-module'],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})
