<template>
  <section class="experience-section py-5">
    <div class="container">
      <h2 class="section-heading">{{ t('sections.experience') }}</h2>

      <FilterBar
        :categories="filterCategories"
        v-model="activeFilters"
      />

      <div class="experience-list">
        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="fresh-card mb-3 experience-card"
        >
          <div
            class="card-header-area d-flex justify-content-between align-items-start cursor-pointer p-3"
            role="button"
            tabindex="0"
            :aria-expanded="isExpanded(entry.id)"
            :aria-controls="'experience-' + entry.id"
            @click="toggleExpand(entry.id)"
            @keydown.enter.prevent="toggleExpand(entry.id)"
            @keydown.space.prevent="toggleExpand(entry.id)"
          >
            <div class="flex-grow-1">
              <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h3 class="h5 mb-0 fw-semibold">{{ entry.role }}</h3>
                <span
                  v-if="entry.end_date === 'present'"
                  class="badge badge-present"
                >
                  {{ t('labels.present') }}
                </span>
              </div>
              <p class="mb-1 text-body-secondary">
                {{ entry.company }}
                <span class="mx-1">&middot;</span>
                {{ entry.location }}
              </p>
              <p class="mb-1 small text-body-tertiary">
                {{ formatDate(entry.start_date) }} &ndash; {{ formatEndDate(entry.end_date) }}
              </p>
              <p class="mb-0 mt-2">{{ entry.summary }}</p>
            </div>
            <i
              class="bi bi-chevron-down fs-5 ms-3 mt-1 text-body-secondary chevron-icon"
              :class="{ 'chevron-expanded': isExpanded(entry.id) }"
              aria-hidden="true"
            ></i>
          </div>

          <Transition name="slide">
            <div
              v-if="isExpanded(entry.id)"
              :id="'experience-' + entry.id"
              class="card-body-area px-3 pb-3 pt-0"
            >
              <hr class="my-3">

              <!-- Responsibilities -->
              <div v-if="entry.responsibilities?.length" class="mb-3">
                <h4 class="h6 fw-semibold">{{ t('labels.responsibilities') }}</h4>
                <ul class="mb-0">
                  <li v-for="(item, index) in entry.responsibilities" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Achievements -->
              <div v-if="entry.achievements?.length" class="mb-3">
                <h4 class="h6 fw-semibold achievements-heading">
                  <i class="bi bi-trophy me-1" aria-hidden="true"></i>
                  {{ t('labels.achievements') }}
                </h4>
                <ul class="mb-0">
                  <li v-for="(item, index) in entry.achievements" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>

              <!-- Technologies -->
              <div v-if="entry.technologies?.length">
                <h4 class="h6 fw-semibold">{{ t('labels.technologies') }}</h4>
                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="tech in entry.technologies"
                    :key="tech"
                    class="badge rounded-pill tech-badge"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <p v-if="filteredEntries.length === 0" class="text-body-secondary text-center py-3">
        {{ t('filters.noResults') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import FilterBar from './FilterBar.vue'

const props = defineProps({
  entries: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()
const { locale } = useLocale()

const expandedIds = ref([])
const activeFilters = ref([])

/**
 * Extract unique role types from entries and map to locale-aware labels.
 * The raw type value is used internally; the label is for display.
 */
const filterCategories = computed(() => {
  const types = [...new Set(props.entries.map((e) => e.type))]
  return types.map((type) => t('filters.' + type))
})

/**
 * Map a display label back to its raw type value for filtering.
 */
const typeFromLabel = (label) => {
  const types = [...new Set(props.entries.map((e) => e.type))]
  return types.find((type) => t('filters.' + type) === label) || null
}

const filteredEntries = computed(() => {
  if (activeFilters.value.length === 0) {
    return props.entries
  }
  const activeTypes = activeFilters.value.map(typeFromLabel).filter(Boolean)
  return props.entries.filter((entry) => activeTypes.includes(entry.type))
})

const isExpanded = (id) => expandedIds.value.includes(id)

const toggleExpand = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index === -1) {
    expandedIds.value.push(id)
  } else {
    expandedIds.value.splice(index, 1)
  }
}

/**
 * Format "YYYY-MM" date string to a locale-aware short format (e.g., "Jan 2022").
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr + '-01')
  return date.toLocaleDateString(locale.value, { month: 'short', year: 'numeric' })
}

const formatEndDate = (dateStr) => {
  if (dateStr === 'present') {
    return t('labels.present')
  }
  return formatDate(dateStr)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.card-header-area {
  transition: background-color 0.2s ease;
  border-radius: 0.75rem;
}

.card-header-area:hover {
  background-color: rgba(99, 102, 241, 0.04);
}

.badge-present {
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.75rem;
}

.achievements-heading {
  color: var(--color-primary);
}

.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-expanded {
  transform: rotate(-180deg);
}

/* Slide transition for expand/collapse (GPU-accelerated) */
.slide-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
