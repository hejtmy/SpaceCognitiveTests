<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <HeroPricing />
      <Features05 />
      <Customers />
      <Faqs />
      <Cta />

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script>

export default {
  name: 'Pricing',
}
</script>