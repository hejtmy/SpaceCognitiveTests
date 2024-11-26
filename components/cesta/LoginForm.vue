<script setup>
// using a supabase client log in the user with and email and a password
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const password = ref('');

async function signin() {
  try {
    const email = `${password.value}@cyberspacelab.cz`; 
    const { data, error } = await client.auth.signInWithPassword({
      // email is joined password plus @cyberspacelab.cz
      email: email,
      password: password.value,
    });
    if (error) throw error;
    router.push('/')
  } catch (error) {
    errorMsg.value = "Error signing up";
  }
}

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/')
  }
});

</script>
<template>
  <form @submit.prevent="signin">
    <div class="space-y-4">
      <div>
        <div class="flex justify-between">
          <label class="block text-sm text-slate-300 font-medium mb-1" for="password">Zaslané heslo</label>
        </div>
        <input id="password" class="form-input w-full" type="password" v-model="password" autocomplete="on" required />
      </div>
    </div>
    <div class="mt-6">
      <button class="btn text-sm text-white bg-purple-500 hover:bg-purple-600 w-full shadow-sm group">
        Přihlásit se <span class="tracking-normal text-purple-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
      </button>
    </div>
  </form>
</template>