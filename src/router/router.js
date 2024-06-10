import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '@/components/sections/home/HomeView.vue'
import TechieView from "@/components/sections/techie/TechieView.vue";
import ContactView from "@/components/sections/contact/ContactView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/contact', component: ContactView },
    { path: '/techie', component: TechieView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router