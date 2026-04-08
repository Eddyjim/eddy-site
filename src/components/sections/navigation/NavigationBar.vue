<script setup>
import { useI18n } from 'vue-i18n'
import ThemeToggle from '@/components/sections/shared/ThemeToggle.vue'
import LanguageSwitcher from '@/components/sections/shared/LanguageSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <RouterLink to="/" class="nav-link" active-class="active" exact>
        {{ t('nav.home') }}
      </RouterLink>
      <RouterLink to="/hire-me" class="nav-link" active-class="active">
        {{ t('nav.hireMe') }}
      </RouterLink>
      <RouterLink to="/contact" class="nav-link" active-class="active">
        {{ t('nav.contact') }}
      </RouterLink>
    </div>
    <div class="nav-controls">
      <ThemeToggle />
      <LanguageSwitcher />
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.5rem 0;
  flex-basis: 55%;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-background-mute);
  border-radius: 0.75rem;
  padding: 0.25rem;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  color: var(--color-text-muted, var(--color-text));
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-heading, var(--color-text));
  background-color: rgba(99, 102, 241, 0.05);
}

.nav-link.active {
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
