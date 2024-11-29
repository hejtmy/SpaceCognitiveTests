<template>
  <footer>
    <div id="footer-div" class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Blocks -->
      <div class="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
        <!-- 1st block -->
        <div class="sm:col-span-12 lg:col-span-4 order-1 lg:order-none">
          <div class="h-full flex flex-col sm:flex-row lg:flex-col justify-between">
            <div class="mb-4 sm:mb-0">
              <div class="mb-4">
                <!-- Logo -->
                <router-link class="inline-flex" to="/" aria-label="Vzhůru do vesmíru">
                  <img src="/images/logo.png" width="38" height="38" alt="Stellar">
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="sm:col-span-6 md:col-span-3 lg:col-span-2">
          <h6 class="text-sm text-slate-50 font-medium mb-2">Vzhůru do vesmíru</h6>
          <ul class="text-sm space-y-2">
            <li>
              <a class="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out" href="#0">Zde okazy</a>
            </li>
          </ul>
        </div>
        <div class="sm:col-span-6 md:col-span-4 lg:col-span-2">
          <h6 class="text-sm text-slate-50 font-medium mb-2">Partneři</h6>
          <ul class="text-sm space-y-2">
            <li>
              <a class="text-slate-400 hover:text-slate-200 transition duration-150 ease-in-out" href="#0">Kdo se na těchto stránkách podílel</a>
            </li>
          </ul>
        </div>
        <div class="sm:col-span-6 md:col-span-4 lg:col-span-2">
          <ul class="flex">
            <li>
              <a class="flex justify-center items-center text-purple-500 hover:text-purple-400 transition duration-150 ease-in-out" href="#0" aria-label="Twitter">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                </svg>
              </a>
              </li>
            </ul>
          </div> 
      </div>
    </div>
  </footer>
</template>