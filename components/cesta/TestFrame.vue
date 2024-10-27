<script setup>
const props = defineProps({
  testName: {
    type: String,
    required: true
  },
});
</script>
<template>
  <section class="relative">

    <!-- Radial gradient -->
    <div class="absolute flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-[800px] aspect-square" aria-hidden="true">
      <div class="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[120px] opacity-30"></div>
      <div class="absolute w-64 h-64 translate-z-0 bg-purple-400 rounded-full blur-[80px] opacity-70"></div>
    </div>

    <!-- Particles animation -->
    <Particles class="absolute inset-0 h-96 -z-10" :quantity="15" />

    <!-- Illustration -->
    <div class="md:block absolute left-1/2 -translate-x-1/2 -mt-16 blur-2xl opacity-90 pointer-events-none -z-10" aria-hidden="true">
      <img src="/images/page-illustration.svg" class="max-w-none" width="1440" height="427" alt="Page Illustration">
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-32 pb-10 md:pt-40">

        <!-- Hero content -->
        <div class="text-center">
          <h1 class="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-6">{{ testName }}</h1>
          <!-- Rings illustration -->
          <div class="inline-flex items-center justify-center relative">
            <!-- Particles animation -->
            <Particles class="absolute inset-0 -z-10" :quantity="10" />
            <div class="inline-flex">
              <div id="jspsych-target"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>