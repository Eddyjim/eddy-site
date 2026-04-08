import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import router from '@/router/router'

import en from '@/locales/en.json'
import es from '@/locales/es.json'

import './assets/scss/main.scss'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
