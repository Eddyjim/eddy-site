import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/components/sections/home/HomeView.vue'
import ContactView from '@/components/sections/contact/ContactView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/contact', name: 'contact', component: ContactView },
  {
    path: '/hire-me',
    name: 'hire-me',
    component: () => import('@/components/sections/hire/HireView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
