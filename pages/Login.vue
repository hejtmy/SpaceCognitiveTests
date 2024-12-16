<script setup>
const runtimeConfig = useRuntimeConfig();
const loginActive = true;

</script>
<template>
  <main class="grow">
    <CestaHeader/>
    <section class="relative">
      <!-- Illustration -->
      <div class="md:block absolute left-1/2 -translate-x-1/2 -mt-36 blur-2xl opacity-70 pointer-events-none -z-10" aria-hidden="true">
        <img src="/images/auth-illustration.svg" class="max-w-none" width="1440" height="450" alt="Page Illustration">
      </div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div v-if="loginActive" class="pt-32 pb-12 md:pt-40 md:pb-20">
          <!-- Page header -->
          <div class="max-w-3xl mx-auto text-center pb-12">
            <!-- Logo -->
            <div class="mb-5">
              <router-link class="inline-flex" to="/">
                <div class="relative flex items-center justify-center w-16 h-16 border border-transparent rounded-2xl shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-2xl">
                  <img class="relative" src="/images/logo.png" width="42" height="42" alt="Stellar">
                </div>
              </router-link>
            </div>
            <h1 class="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60">Přihlašte se</h1>
          <p>Testy si můžete natrénovat kolikrát chcete bez přihlášení.</p>
          <p>Pokud chcete zaznamenat své oficální výsledky, přihlašte se zde se zaslanými údaji.</p>
          </div>
          <div class="max-w-sm mx-auto">
            <CestaLoginForm/>
            <div class="text-center mt-4">
              <div class="text-sm text-slate-400">
                Přihlášení je pouze pro registrované uživatele. 
                Přihlašovací údaje by vám měly přijít na zaregistrovaný email. Pokud ne, ozvěte se prosím organizárům Vzhůru do vesmíru.
              </div>
            </div>
          </div>
        </div>

        <div v-else class="pt-32 pb-12 md:pt-40 md:pb-20">
          <div class="max-w-3xl mx-auto text-center pb-12">
            <!-- Logo -->
            <div class="mb-5">
              <router-link class="inline-flex" to="/">
                <div class="relative flex items-center justify-center w-16 h-16 border border-transparent rounded-2xl shadow-2xl [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-2xl">
                  <img class="relative" src="/images/logo.png" width="42" height="42" alt="Stellar">
                </div>
              </router-link>
            </div>
            <h1 class="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60">Konec!</h1>
          <p>Děkujeme za účast. Vaše výsledky se nyní vyhodnocují.</p>
        </div>
        </div>
      </div>
    </section>
    <CestaFooter/>
  </main>
</template>