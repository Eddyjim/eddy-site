<template>
  <section class="skills-preview">
    <h2 class="text-center section-heading">{{ t('sections.skills') }}</h2>
    <div class="row g-4">
      <div
        v-for="category in categories"
        :key="category.slug"
        class="col-12 col-md-6"
      >
        <h3 class="h6 fw-semibold text-muted text-uppercase mb-2">
          {{ category.name }}
        </h3>
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="skill in category.skills"
            :key="skill.name"
            class="badge tech-badge skill-badge"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="text-center mt-4">
      <RouterLink to="/hire-me" class="btn btn-outline-indigo">
        {{ t('actions.viewFullCv') }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()
</script>

<style scoped>
.skill-badge {
  font-size: 0.875rem;
  padding: 0.4em 0.75em;
  border-radius: 2rem;
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
