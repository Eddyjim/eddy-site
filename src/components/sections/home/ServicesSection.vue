<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  services: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()
</script>

<template>
  <section class="services-section">
    <h2 class="section-heading text-center">{{ t('sections.services') }}</h2>
    <div class="row g-4">
      <div
        v-for="(service, index) in services"
        :key="service.slug"
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="service-card h-100 p-4">
          <div class="service-icon-wrapper mb-3">
            <i :class="[service.icon]" aria-hidden="true"></i>
          </div>
          <h3 class="h5 fw-semibold mb-2">{{ service.name }}</h3>
          <p class="text-body-secondary mb-0 small">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.service-card {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.1);
}

.service-card:hover::before {
  opacity: 1;
}

.service-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1));
  font-size: 1.5rem;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.service-card:hover .service-icon-wrapper {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2));
  transform: scale(1.1);
}
</style>
