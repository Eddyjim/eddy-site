<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
</script>

<template>
  <section class="hero-section">
    <div class="hero-bg-decoration" aria-hidden="true">
      <div class="hero-blob hero-blob-1"></div>
      <div class="hero-blob hero-blob-2"></div>
    </div>
    <div class="container text-center position-relative py-5">
      <p class="hero-greeting text-uppercase fw-semibold letter-spacing-wide mb-3">
        {{ t('hero.greeting') }} <span aria-hidden="true">👋</span>
      </p>
      <h1 class="display-2 fw-bold text-gradient mb-3">{{ name }}</h1>
      <p class="fs-4 fw-medium text-body-secondary mb-2">{{ title }}</p>
      <p class="fs-5 text-body-tertiary mb-4 mx-auto hero-tagline">{{ tagline }}</p>
      <RouterLink
        to="/hire-me"
        class="btn btn-hero btn-lg px-5 py-3 fw-semibold"
      >
        {{ t('hero.cta') }}
        <i class="bi bi-arrow-right ms-2"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4rem 0;
  position: relative;
}

.hero-bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.hero-blob-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary);
  top: -10%;
  right: -5%;
  animation: float 8s ease-in-out infinite;
}

.hero-blob-2 {
  width: 400px;
  height: 400px;
  background: var(--color-secondary);
  bottom: -10%;
  left: -5%;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-10px, 15px) scale(0.95); }
}

.hero-greeting {
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--color-primary);
}

.hero-tagline {
  max-width: 600px;
  line-height: 1.6;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-hero {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-hero:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  color: #fff;
}

.btn-hero:active {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero-blob,
  .hero-blob-1,
  .hero-blob-2 {
    animation: none;
  }
}
</style>
