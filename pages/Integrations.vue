<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <!-- Site header -->
    <Header />
    <!-- Page content -->
    <main class="grow">
      <IntegrationsHero />
      <IntegrationsList />
      <Cta04 />
    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script>

export default {
  name: 'Integrations',
}
</script>