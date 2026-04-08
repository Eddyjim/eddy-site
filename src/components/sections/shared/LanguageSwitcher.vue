<script setup>
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale, t } = useLocale()

function toggleLanguage() {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}
</script>

<template>
  <button
    class="btn btn-link nav-link p-1 fw-bold"
    :aria-label="t('language.switch')"
    @click="toggleLanguage"
  >
    {{ locale.toUpperCase() }}
  </button>
</template>

<style scoped>
button {
  font-size: 0.9rem;
  color: var(--color-text);
  border: none;
  min-width: 2rem;
  text-align: center;
}
</style>
