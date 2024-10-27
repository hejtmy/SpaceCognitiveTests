<script setup>

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">

  <!-- Site header -->
  <CestaHeader />

  <!-- Page content -->
  <main class="grow">
    <CestaTestFrame testName="Rozpoznávání emocí"/>
  </main>
  <Footer />
  </div>
</template>