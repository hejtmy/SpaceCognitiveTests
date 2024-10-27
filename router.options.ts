import type { RouterConfig } from '@nuxt/schema'

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: (_routes) => [
    {
      name: 'integrations-single',
      path: '/integrations-single',
      component: () => import('~/pages/inspiration/IntegrationsSingle.vue')
    }
  ],
} satisfies RouterConfig