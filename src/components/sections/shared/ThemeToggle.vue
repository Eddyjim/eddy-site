<script setup>
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'

const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    class="btn btn-link nav-link p-1"
    :aria-label="t('theme.toggle')"
    @click="toggle"
  >
    <i :class="isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'" />
  </button>
</template>

<style scoped>
button {
  font-size: 1.2rem;
  color: var(--color-text);
  min-width: 44px;
  min-height: 44px;
}

button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
