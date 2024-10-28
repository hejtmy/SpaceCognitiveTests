<script setup>

</script>
<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
  <CestaHeader />
  <main class="grow">
    <CestaTestFrame testName="Rozpoznávání emocí"/>
  </main>
  <CestaFooter />
  </div>
</template>