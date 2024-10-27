// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', 
    'shadcn-nuxt', 
    '@nuxt/content'
  ],
  vite: {
    server: {
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
  router: {
    options:{
      sensitive: false,
    }
  }
})