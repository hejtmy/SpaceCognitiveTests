<script setup>
const { data } = await useAsyncData('tests', () => queryContent('/tests/').find())
const tests = data.value;
const client = useSupabaseClient();
const user = useSupabaseUser();

if(user.value) {
  try {
    const { data: attempts, error } = await client.from('OfficialResults').
      select('test_name').
      eq('user_id', user.value.id)
  if (error) throw error
  // go to the const data and for each test, check if its url matches any value in the attempted test and if so, set the test.attempted to true
  tests.forEach(test => {
    attempts.forEach(attempt => {
      if (test.url === attempt.test_name) {
        test.attempted = true
      }
    })
  })
  } catch (error) {
    console.error('Chyba při načítání pokusů', error)
  }
}

</script>
<template>
  <section class="relative">
    <div class="absolute left-1/2 -translate-x-1/2 top-0 -z-10 w-80 h-80 -mt-24 -ml-32">
      <Particles class="absolute inset-0 -z-10" :quantity="6" :staticity="30" />
    </div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="pt-16 md:pt-32">
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-20">
          <h2 class="h2 bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">Kognitivní kompetence astronauta</h2>
          <p class="text-lg text-slate-400">Na těchto stránkách najdeš čtyři testy. Každý z nich měří specifickou doménu psychologických kompetencí (rozpoznávání emocí, rychlost a pozornost, paměť a prostorová orientace). Každý test má svou průvodní stránků, kde se dozvíš, k čemu slouží a jak bude probíhat. Stránky si můžeš nastudovat anebo se můžeš rovnou vrhnout do zkoušení. Testy si můžeš zkusit kolikrát chceš, počítá se jen a pouze ostrá verze až po tvém přihlášení. Neboj, o všem tě budeme v průběhu informovat!</p>
        </div>
        <div class="relative pb-12 md:pb-20">
          <div class="absolute bottom-0 -mb-20 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
              <defs>
                <linearGradient id="bs2-a" x1="19.609%" x2="50%" y1="14.544%" y2="100%">
                  <stop offset="0%" stop-color="#6366F1" />
                  <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path fill="url(#bs2-a)" fill-rule="evenodd" d="m346 898 461 369-284 58z" transform="translate(-346 -898)" />
            </svg>
          </div>
          <Highlighter class="grid md:grid-cols-12 gap-6 group">
            <CestaTestCard v-for="test in tests" :url="test.url" :title="test.title" :description="test.testListShortDescription" 
              :image="test.listThumb" :attempted="test.attempted"/>
          </Highlighter>
        </div>
      </div>
    </div>
  </section>
</template>