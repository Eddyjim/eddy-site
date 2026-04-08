<template>
  <section class="project-highlights">
    <h2 class="text-center section-heading">{{ t('sections.projects') }}</h2>
    <div class="row g-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="fresh-card h-100 project-card">
          <div class="p-3 d-flex flex-column h-100">
            <h3 class="h5 fw-semibold mb-2">{{ project.title }}</h3>
            <p class="text-muted small flex-grow-1">{{ project.description }}</p>
            <div class="d-flex flex-wrap gap-1 mb-3">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="badge tech-badge"
              >
                {{ tech }}
              </span>
            </div>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-outline-indigo align-self-start"
            >
              <i class="bi bi-box-arrow-up-right me-1" aria-hidden="true"></i>
              {{ t('actions.viewProject') }}
            </a>
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

.btn-outline-indigo {
  color: var(--color-primary);
  border-color: var(--color-primary);
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-outline-indigo:hover {
  background: var(--gradient-primary);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}
</style>
