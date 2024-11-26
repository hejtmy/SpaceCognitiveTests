<script setup>
const client = useSupabaseClient();
const router = useRouter();

const props = defineProps({
  userLoggedIn: {
    type: Boolean,
    required: true,
  },
});

async function userLogout () {
  await client.auth.signOut();
  router.push('/login');
};

</script>
<template>
  <ul class="flex-1 flex justify-end items-center">
    <li class="ml-6">
      <button v-if="userLoggedIn" @click="userLogout" class="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
            Odhlásit se
      </button>
      <nuxt-link v-else to="/login" class="btn-sm text-slate-300 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
        <span class="relative inline-flex items-center">Přihlásit se<span class="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
      </span>
    </nuxt-link>
  </li>
</ul>
</template>