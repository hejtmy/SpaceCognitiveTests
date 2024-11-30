// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', 
    'shadcn-nuxt', 
    '@nuxt/content',
    '@nuxtjs/supabase'
  ],
  vite: {
    server: {
       watch: {
        usePolling: true,
        interval: 100, // Poll files every 100ms
      },
      hmr: {
        protocol: 'ws',
        host: '0.0.0.0',
      }
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      confirm: '/tests',
    },
  },
  router: {
    options:{
      sensitive: false,
    }
  }
})