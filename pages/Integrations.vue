<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <Header />
    <main class="grow">
      <IntegrationsHero />
      <IntegrationsList />
      <Cta04 />
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'Integrations',
}
</script>