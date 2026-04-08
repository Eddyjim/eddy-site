<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/sections/shared/ThemeToggle.vue'
import LanguageSwitcher from '@/components/sections/shared/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const isMenuOpen = ref(false)

// Close menu on route change
router.afterEach(() => {
  isMenuOpen.value = false
})
</script>

<template>
  <nav class="site-nav">
    <!-- Desktop nav -->
    <div class="nav-links d-none d-md-flex">
      <RouterLink to="/" class="nav-link" active-class="active">
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
      <!-- Mobile hamburger -->
      <button
        class="btn btn-link nav-toggle d-md-none"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <i :class="isMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'" />
      </button>
    </div>

    <!-- Mobile dropdown -->
    <Transition name="slide-down">
      <div v-if="isMenuOpen" class="mobile-menu d-md-none">
        <RouterLink to="/" class="mobile-link" active-class="active">
          {{ t('nav.home') }}
        </RouterLink>
        <RouterLink to="/hire-me" class="mobile-link" active-class="active">
          {{ t('nav.hireMe') }}
        </RouterLink>
        <RouterLink to="/contact" class="mobile-link" active-class="active">
          {{ t('nav.contact') }}
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.site-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.5rem 0;
  flex-basis: 55%;
  flex-wrap: wrap;
  position: relative;
}

.nav-links {
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

/* Mobile hamburger button */
.nav-toggle {
  font-size: 1.5rem;
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  line-height: 1;
}

.nav-toggle:hover {
  color: var(--color-primary);
}

/* Mobile dropdown menu */
.mobile-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.5rem;
  gap: 0.25rem;
}

.mobile-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-muted, var(--color-text));
  text-decoration: none;
  transition: all 0.2s ease;
}

.mobile-link:hover {
  background-color: rgba(99, 102, 241, 0.05);
  color: var(--color-heading, var(--color-text));
}

.mobile-link.active {
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
}

/* Slide-down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
