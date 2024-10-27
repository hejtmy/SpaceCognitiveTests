<script setup>
const { data } = await useAsyncData('home', () => queryContent('/home').findOne());
</script>

<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <CestaHero :title = "data.title" :description = "data.description" />
      <Clients />
      <Features />
      <Features02 />
      <Features03 />
      <TestimonialsCarousel />
      <Features04 />
      <PricingHome />
      <Testimonials />
      <Cta />
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'index',
}
</script>