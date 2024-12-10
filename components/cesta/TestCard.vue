<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Title'
  },
  description: {
    type: String,
    required: true,
    default: 'Description'
  },
  image: {
    type: String,
    required: true,
    default: '/images/feature-image-01.png'
  },
  url: {
    type: String,
    required: true,
  },
  attempted: {
    type: Boolean,
    required: false,
    default: false
  },
  finished: {
    type: Boolean,
    required: false,
    default: false
  }
})
const uniqueId = useId();
const runURL = 'run/' + props.url;
const stateClass = computed(() => {
  if(props.finished) return 'bg-green-500';
  return props.attempted ? 'bg-red-500' : 'bg-purple-500';
})

const message = computed(() => {
  if(props.finished) return 'Test máš už hotový. Výborně!';
  return props.attempted ? 'Test jsi začal/a, nemáme tvoje výsledky:( Pokud se jedná o chybu, ozvi se prosím organizátorům.' : 'Spustit test';
})
</script>

<template>
  <div class="md:col-span-12" data-aos="fade-down">
    <HighlighterItem>
      <div class="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="absolute right-0 top-0 blur-2xl" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="342" height="393">
              <defs>
                <linearGradient :id="`bs-${uniqueId}`" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                  <stop offset="0%" stop-color="#6366F1" />
                  <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#bs-a)" fill-rule="evenodd" d="m104 .827 461 369-284 58z" transform="translate(0 -112.827)" opacity=".7" />
            </svg>
          </div>
          <div class="absolute flex items-center justify-center bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 h-full aspect-square" aria-hidden="true">
            <div :class="stateClass" class="absolute inset-0 translate-z-0 rounded-full blur-[120px] opacity-70"></div>
            <div class="absolute w-1/4 h-1/4 translate-z-0 bg-purple-400 rounded-full blur-[40px]"></div>
          </div>
          <div class="md:max-w-[480px] shrink-0 order-1 md:order-none p-6 pt-0 md:p-8 md:pr-0">
            <div class="mb-5">
              <div>
                <h3 class="inline-flex text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-1">{{ title }}</h3>
                <p class="text-slate-400">{{ description }}</p>
              </div>
            </div>
            <div class="my-4">
              <nuxt-link :to="{name: 'tests-id', params: {id: url}}" class="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
                <span class="relative inline-flex items-center">
                  Dozvědět se víc <span class="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                </span>
              </nuxt-link>
            </div>
            <div class="my-4">
              <div v-if="attempted" class="text-slate-400 text-sm"> {{ message }} </div>
              <NuxtLink v-if="!attempted" :to="runURL" class="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
                <span class="relative inline-flex items-center">
                   Spustit test<span class="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="relative w-full h-64 md:h-auto overflow-hidden">
            <img class="absolute bottom-0 left-1/2 -translate-x-1/2 mx-auto max-w-none md:relative md:left-0 md:translate-x-0" :src="image" width="504" height="400" alt="Feature 01">
          </div>
        </div>
      </div>
    </HighlighterItem>
  </div>
</template>

<style scoped>
.bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(255 90 10 / var(--tw-bg-opacity));
}
.bg-green-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(128 255 64/ var(--tw-bg-opacity));
}
</style>