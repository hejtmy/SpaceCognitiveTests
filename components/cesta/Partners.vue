<script setup>
const partners = [
  {name: "Psychologický ústav Akademie Věd České Republiky", img: "/images/partners/psu.png"},
  {name: "Ministerstvo Dopravy České Republiky", img: "/images/partners/MD.png"},
  {name: "Hvězdárna a planetárium Brno", img: "/images/partners/HPB.png"},
  {name: "Planetum", img: "/images/partners/PLANETUM.png"},
]
</script>

<template>
  <section>
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">

      <!-- Particles animation -->
      <div class="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6">
        <Particles class="absolute inset-0 -z-10" :quantity="5" />
      </div>
      <div class="py-12 md:py-16">
        <div class="overflow-hidden">
          <div
            class="inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul
              class="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
              <li v-for="partner in partners">
                <img :src="partner.img" :alt="partner.name" class="w-32 h-auto md:w-48">
              </li>
            </ul>
            <ul
              class="flex animate-infinite-scroll items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8"
              aria-hidden="true">
              <li v-for="partner in partners">
                <img :src="partner.img" :alt="partner.name" class="w-32 h-auto md:w-48">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>