<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  title: 'Cesta Do Vesmíru',
  meta: [
    { name: 'description', content: 'My amazing Nuxt application' },
    { name:"viewport", content:"width=device-width, initial-scale=1.0"}
  ],
  bodyAttrs: {
    class: 'font-inter antialiased bg-slate-900 text-slate-100 tracking-tight'
  }
})
</script>

<script>
import AOS from 'aos'

export default {
  mounted() {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 500,
      easing: 'ease-out-cubic',
    }) 
  }
}
</script>
