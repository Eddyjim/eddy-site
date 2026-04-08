<template>
  <section class="skills-section py-5">
    <div class="container">
      <h2 class="section-heading">{{ t('sections.skills') }}</h2>

      <FilterBar
        :categories="categoryNames"
        v-model="activeFilters"
      />

      <div class="row g-4">
        <div
          v-for="category in filteredCategories"
          :key="category.slug"
          class="col-12 col-md-6"
        >
          <div class="fresh-card h-100">
            <div class="p-4">
              <h3 class="h5 fw-semibold mb-3">{{ category.name }}</h3>
              <div
                v-for="skill in category.skills"
                :key="skill.name"
                class="mb-3"
              >
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-medium">{{ skill.name }}</span>
                  <small class="text-body-secondary">
                    {{ skill.years }} {{ t('labels.yearsExperience') }}
                  </small>
                </div>
                <div
                  class="progress"
                  role="progressbar"
                  :aria-label="skill.name + ': ' + (skill.proficiency * 20) + '% ' + t('labels.proficiency')"
                  :aria-valuenow="skill.proficiency * 20"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="progress-bar skill-progress"
                    :style="{ width: skill.proficiency * 20 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="filteredCategories.length === 0" class="text-body-secondary text-center py-3">
        {{ t('filters.noResults') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FilterBar from './FilterBar.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()

const activeFilters = ref([])

const categoryNames = computed(() => props.categories.map((c) => c.name))

const filteredCategories = computed(() => {
  if (activeFilters.value.length === 0) {
    return props.categories
  }
  return props.categories.filter((c) => activeFilters.value.includes(c.name))
})
</script>

<style scoped>
.skill-progress {
  background: var(--gradient-hero);
  border-radius: 0.5rem;
}

.skills-section {
  background: var(--color-background-soft);
}

.progress {
  height: 8px;
  background-color: var(--color-background-mute);
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
