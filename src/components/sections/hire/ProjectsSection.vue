<template>
  <section class="projects-section py-5">
    <div class="container">
      <h2 class="section-heading">{{ t('sections.projects') }}</h2>

      <div class="row g-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="fresh-card h-100 project-card">
            <div class="p-3 d-flex flex-column h-100">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h3 class="h5 fw-semibold mb-0">{{ project.title }}</h3>
                <a
                  v-if="project.url"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="project-link ms-2"
                  :aria-label="project.title + ' - external link'"
                >
                  <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                </a>
              </div>
              <p class="text-body-secondary flex-grow-1">{{ project.description }}</p>
              <div class="d-flex flex-wrap gap-2 mt-auto">
                <span
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="badge rounded-pill tech-badge"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  projects: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()
</script>

<style scoped>
.projects-section {
  background: var(--color-background-soft);
}

.project-card {
  position: relative;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 0.75rem 0.75rem 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

.project-link {
  color: var(--color-primary);
  transition: color 0.2s ease;
}

.project-link:hover {
  color: var(--color-secondary);
}
</style>
