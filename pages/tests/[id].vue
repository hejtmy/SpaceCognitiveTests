<script setup>
const route = useRoute()
const { data } = await useAsyncData('tests', () => queryContent(`tests/${route.params.id}`).findOne())
const cardThumb = data?.value.cardThumb;
</script>

<template>
  <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
    <CestaHeader />
    <main class="grow">
      <section class="relative">
        <div class="absolute flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-[800px] aspect-square" aria-hidden="true">
          <div class="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[120px] opacity-30"></div>
          <div class="absolute w-64 h-64 translate-z-0 bg-purple-400 rounded-full blur-[80px] opacity-70"></div>
        </div>
        <Particles class="absolute inset-0 h-96 -z-10" :quantity="15" />
        <div class="md:block absolute left-1/2 -translate-x-1/2 -mt-16 blur-2xl opacity-90 pointer-events-none -z-10" aria-hidden="true">
          <img src="/images/page-illustration.svg" class="max-w-none" width="1440" height="427" alt="Page Illustration">
        </div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="pt-32 md:pt-40">
            <div class="md:flex md:justify-between">
              <div class="md:grow pb-12 md:pb-20">
                <div class="max-w-[720px]">
                  <div class="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-16">
                    <div class="shrink-0">
                      <div class="sticky top-6">
                        <router-link class="flex items-center justify-center w-9 h-9 group border border-transparent rounded-full [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none" to="/tests">
                          <span class="sr-only">Go back</span>
                          <svg class="w-4 h-4 fill-purple-500" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.7 14.7l1.4-1.4L3.8 9H16V7H3.8l4.3-4.3-1.4-1.4L0 8z" />
                          </svg>
                        </router-link>
                      </div>
                    </div>
                    <div>
                      <article class="pb-12 mb-12 border-b [border-image:linear-gradient(to_right,transparent,theme(colors.slate.800),transparent)1]">
                        <figure class="bg-slate-700/20 border border-slate-300/10 p-4 rounded-3xl mb-8">
                          <ContentRenderer :value="data">
                            <img class="w-full rounded-2xl" :src="cardThumb" width="586" height="316" alt="Illustration image" />
                          </ContentRenderer>
                        </figure>
                        <div class="prose max-w-none text-slate-400 prose-headings:text-slate-50 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-a:text-purple-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-50 prose-strong:font-medium prose-blockquote:pl-5 prose-blockquote:xl:-ml-5 prose-blockquote:border-l-2 prose-blockquote:border-purple-500 prose-blockquote:font-medium prose-blockquote:text-slate-300 prose-blockquote:italic"></div>
                        <article>
                          <ContentDoc class="text-slate-400 space-y-6" />
                        </article>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
              <aside class="md:w-64 lg:w-80 md:shrink-0 md:pt-[3.75rem] lg:pt-0 pb-12 md:pb-20">
                <ContentDoc>
                  <template v-slot="{doc}">
                    <CestaTestSideCard :icon="doc.icon" :url="doc.url" :name="doc.name" :duration="doc.duration" :skill="doc.skill"/>
                  </template>
                </ContentDoc> 
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
    <CestaFooter />
  </div>
</template>