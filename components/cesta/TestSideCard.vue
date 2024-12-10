<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: 'icon-01'
  },
  url: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
    default: 'Název dovednosti'
  },
  duration: {
    type: String,
    required: true,
    default: 'Doba testu'
  },
  attempted: {
    type: Boolean,
    required: false,
    default: false
  }
})

const information = ref({
  Dovednost: props.skill,
  Délka: props.duration,
})
</script>

<template>
  <div class="sticky top-6 md:pl-6 lg:pl-10">
    <div class="space-y-6">
      <div class="bg-gradient-to-tr from-slate-800 to-slate-800/25 rounded-3xl border border-slate-800">
        <div class="px-5 py-6">
          <div class="text-center mb-5">
            <div class="mb-4">
              <div class="relative inline-flex">
                <img :src="props.icon" width="80" height="80" alt="Icon 08" />
              </div>
            </div>
            <div v-if="props.attempted" class="text-slate>400 text-sm">Test máš už hotový</div>
            <nuxt-link v-else :to="'../run/' + props.url">
              <button class="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/70 before:rounded-full before:pointer-events-none">
                <span class="relative inline-flex items-center">
                  Spustit test <span class="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                </span>
              </button>
            </nuxt-link>
          </div>
          <ul class="text-sm">
            <li v-for="(value, key) in information" :key="key" class="flex items-center justify-between space-x-2 py-3 border-t [border-image:linear-gradient(to_right,theme(colors.slate.700/.3),theme(colors.slate.700),theme(colors.slate.700/.3))1]">
              <span class="text-slate-400">{{ key }}</span>
              <span class="text-slate-300 font-medium">{{ value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>