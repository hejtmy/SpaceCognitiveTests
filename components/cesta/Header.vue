<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const user = useSupabaseUser();

const mobileNavOpen = ref(false)
const mobileNav = ref(null)
const hamburger = ref(null)

// close on click outside
const clickHandler = ({ target }) => {
  if (!mobileNavOpen.value || mobileNav.value.contains(target) || hamburger.value.contains(target)) return
  mobileNavOpen.value = false
}

// close if the esc key is pressed
const keyHandler = ({ keyCode }) => {
  if (!mobileNavOpen.value || keyCode !== 27) return
  mobileNavOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', clickHandler)
  document.addEventListener('keydown', keyHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('keydown', keyHandler)
})

const links = [
  { name: 'K testům', link: '/tests' },
  //{ name: 'Inspirace', link: '/inspiration/' },
]

const isLoggedIn = computed(() => !!user.value);

console.log(isLoggedIn.value);

defineExpose({ isLoggedIn });
</script>
<template>
  <header class="absolute w-full z-30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16 md:h-20">
        <div class="flex-1">
          <router-link class="inline-flex" to="/" aria-label="Cruip">
            <img class="max-w-none" src="/images/logo.png" width="38" height="38" alt="Stellar">
          </router-link>
        </div>
        <nav class="hidden md:flex md:grow">
          <ul class="flex grow justify-center flex-wrap items-center">
           <li v-for="item in links" :key="item.id">
            <nuxt-link class="font-medium text-sm text-slate-300 hover:text-white mx-4 lg:mx-5 transition duration-150 ease-in-out" :to="item.link">{{ item.name }}</nuxt-link>
          </li>
          </ul>
        </nav>
        <CestaLoginLogoutButton :userLoggedIn="isLoggedIn"/>
        <div class="md:hidden flex items-center ml-4">
          <button class="hamburger" ref="hamburger" :class="{ 'active': mobileNavOpen }" @click="mobileNavOpen = !mobileNavOpen" aria-controls="mobile-nav" :aria-expanded="mobileNavOpen">
            <span class="sr-only">Menu</span>
            <svg class="w-5 h-5 fill-current text-slate-300 hover:text-white transition duration-150 ease-in-out" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <rect y="2" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="16" width="20" height="2" rx="1" />
            </svg>
          </button>
          <nav id="mobile-nav" class="absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out" ref="mobileNav" :style="[mobileNavOpen ? { maxHeight: $refs.mobileNav.scrollHeight + 'px', opacity: 1 } : { maxHeight: 0, opacity: .8 }]" @click.outside="expanded = false" @keydown.escape.window="expanded = false">
            <ul class="border border-transparent [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] rounded-lg px-4 py-1.5">
              <li v-for="item in links" :key="item.id">
                <nuxt-link class="flex font-medium text-sm text-slate-300 hover:text-white py-1.5" :to="item.link">{{ item.name }}</nuxt-link>
              </li>
            </ul>
          </nav>
      </div>
    </div>
    </div>
  </header>
</template>
