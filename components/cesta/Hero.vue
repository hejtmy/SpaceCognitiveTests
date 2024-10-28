<script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  })
</script>
<template>
  <section>
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <Particles class="absolute inset-0 -z-10" />
      <div class="absolute inset-0 -z-10 -mx-28 rounded-b-[3rem] pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute left-1/2 -translate-x-1/2 bottom-0 -z-10">
          <img src="/images/glow-bottom.svg" class="max-w-none" width="2146" height="774" alt="Hero Illustration">
        </div>
      </div>
      <div class="pt-32 pb-16 md:pt-52 md:pb-32">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4" data-aos="fade-down">
            {{ title }}
          </h1>
          <p class="text-lg text-slate-300 mb-8" data-aos="fade-down" data-aos-delay="200">
            {{ description }}
          </p>
          <div class="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4" data-aos="fade-down" data-aos-delay="400">
            <div>
              <nuxt-link :to="/tests" class="btn text-slate-900 bg-gradient-to-r from-white/80 via-white to-white/80 hover:bg-white w-full transition duration-150 ease-in-out group">
                 Jdeme na to <span class="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
