<script setup>
// using a supabase client log in the user with and email and a password
const user = useSupabaseUser();
const client = useSupabaseClient();

const word1 = ref('');
const word2 = ref('');
const word3 = ref('');
const word4 = ref('');
const word5 = ref('');
const errorMsg = ref('');
const isAuthenticating = ref(false);

async function signin() {
  isAuthenticating.value = true;
  try {
    const pass = `${word1.value}${word2.value}${word3.value}${word4.value}${word5.value}`;
    const email = `${pass}@cyberspacelab.cz`; 
    const { data, error } = await client.auth.signInWithPassword({
      // email is joined password plus @cyberspacelab.cz
      email: email,
      password: pass,
    });
    if (error) throw error;
    isAuthenticating.value = false;
    navigateTo('/tests');
  } catch (error) {
    errorMsg.value = error.message;
    isAuthenticating.value = false;
  }
}

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/')
  }
});

</script>
<template>
  <form @submit.prevent="signin" class="mx-auto max-w-md">
    <div class="space-y-4">
      <div>
        <div class="flex justify-between">
          <label class="block text-sm text-slate-300 font-medium mb-1" for="password">Zaslané heslo</label>
        </div>
        <div class="flex space-x-2">
          <input class="form-input w-full bg-black" type="text" v-model="word1" maxlength="10" required />
          <input class="form-input w-full bg-black" type="text" v-model="word2" maxlength="10" required />
          <input class="form-input w-full bg-black" type="text" v-model="word3" maxlength="10" required />
          <input class="form-input w-full bg-black" type="text" v-model="word4" maxlength="10" required />
          <input class="form-input w-full bg-black" type="text" v-model="word5" maxlength="10" required />
        </div>
      </div>
    </div>
    <div class="mt-6">
      <button :disabled="isAuthenticating" class="btn text-sm text-white bg-purple-500 hover:bg-purple-600 w-full shadow-sm group">
        {{ isAuthenticating ? 'Přihlašuji' : 'Přihlásit se' }}  <span class="tracking-normal text-purple-300 group-hover:translate-x-0.5 
                                  transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
      </button>
    </div>
    <div v-if="errorMsg" class="mt-4 text-red-500 text-sm">{{ errorMsg }}</div>
  </form>
</template>


<style scoped>
.form-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.btn {
  padding: 0.75rem 1.5rem;
  background-color: #6366F1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.btn:hover {
  background-color: #4f46e5;
}
</style>