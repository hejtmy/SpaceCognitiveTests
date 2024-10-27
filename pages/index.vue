<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <!-- Site header -->
    <Header />
    <!-- Page content -->
    <main class="grow">
      <Hero />
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
    
    <!-- Site footer -->
    <Footer />    

  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>