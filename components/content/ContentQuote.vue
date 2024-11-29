<template>
  <aside class="pl-6 border-l-2 border-purple-500 mt-4 mb-4">
    <p class="inline-flex font-medium italic text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">
      <slot />
    </p>
    <footer class="flex items-center space-x-4">
      <div class="text-sm font-medium text-slate-300">
         <slot name="author"/><span class="text-slate-700">-</span>
      </div>
    </footer>
  </aside>
</template>