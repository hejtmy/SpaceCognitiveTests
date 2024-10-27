<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <Header />
    <main class="grow">
      <PricingHero />
      <Features05 />
      <Customers />
      <Faqs />
      <Cta />
    </main>
    <Footer />
  </div>
</template>

<script>

export default {
  name: 'Pricing',
}
</script>