<script setup>
const props = defineProps({
  quote: {
    type: String,
    required: true,
    default: "This is an interesting quote from an interesting individual",
  },
  author: {
    type: String,
    required: false,
    default: "Pán Co Ví",
  },
  authorIcon: {
    required: false,
    default: '/images/post-avatar.jpg',
  },
});


</script>
<template>
  <aside class="pl-6 border-l-2 border-purple-500">
    <p class="inline-flex font-medium italic text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">“{{props.quote}}”</p>
    <footer class="flex items-center space-x-4">
      <img class="shrink-0 rounded-full" :src="props.authorIcon" width="32" height="32" alt="Author" />
      <div class="text-sm font-medium text-slate-300">
         {{ props.author }}<span class="text-slate-700">-</span>
      </div>
    </footer>
  </aside>
</template>