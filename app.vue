<script setup>
useHead({
  title: 'Vzhůru do vesmíru: kognitivní testování',
  meta: [
    { name: 'description', content: 'Aplikace pro edukaci a demonstraci kognitivního testování budoucích astronautů.' },
    { name:"viewport", content:"width=device-width, initial-scale=1.0"}
  ],
  bodyAttrs: {
    class: 'font-inter antialiased bg-slate-900 text-slate-100 tracking-tight'
  }
})
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

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
