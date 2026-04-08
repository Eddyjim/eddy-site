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
    :title="locale === 'en' ? 'Cambiar a Espa\u00f1ol' : 'Switch to English'"
    @click="toggleLanguage"
  >
    <i class="bi bi-globe2 me-1" aria-hidden="true"></i>{{ locale.toUpperCase() }}
  </button>
</template>

<style scoped>
button {
  font-size: 0.9rem;
  color: var(--color-text);
  min-width: 44px;
  min-height: 44px;
  text-align: center;
}

button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
