<template>
  <section class="experience-section py-5">
    <div class="container">
      <h2 class="section-heading">{{ t('sections.experience') }}</h2>

      <div class="experience-list">
        <article
          v-for="entry in entries"
          :key="entry.id"
          class="fresh-card mb-3 experience-card"
          :class="{ 'experience-card-current': entry.end_date === 'present' }"
        >
          <div class="p-3">
            <header class="experience-header">
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
                <span class="tenure-divider mx-1">&middot;</span>
                <span class="tenure-text">{{ tenureLabel(entry.start_date, entry.end_date) }}</span>
              </p>
              <p class="mb-0 mt-2">{{ entry.summary }}</p>
            </header>

            <div v-if="entry.achievements?.length" class="mt-3">
              <h4 class="h6 fw-semibold achievements-heading mb-2">
                <i class="bi bi-trophy me-1" aria-hidden="true"></i>
                {{ t('labels.achievements') }}
              </h4>
              <ul class="mb-0">
                <li v-for="(item, index) in entry.achievements" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>

            <div v-if="entry.technologies?.length" class="mt-3">
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

            <div v-if="entry.responsibilities?.length" class="mt-3">
              <button
                type="button"
                class="responsibilities-toggle"
                :aria-expanded="isExpanded(entry.id)"
                :aria-controls="'responsibilities-' + entry.id"
                @click="toggleExpand(entry.id)"
              >
                <span>{{ t('labels.responsibilities') }}</span>
                <i
                  class="bi bi-chevron-down ms-1 chevron-icon"
                  :class="{ 'chevron-expanded': isExpanded(entry.id) }"
                  aria-hidden="true"
                ></i>
              </button>

              <Transition name="slide">
                <div
                  v-if="isExpanded(entry.id)"
                  :id="'responsibilities-' + entry.id"
                  class="mt-2"
                >
                  <ul class="mb-0">
                    <li v-for="(item, index) in entry.responsibilities" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </Transition>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'

defineProps({
  entries: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()
const { locale } = useLocale()

const expandedIds = ref([])

const isExpanded = (id) => expandedIds.value.includes(id)

const toggleExpand = (id) => {
  const index = expandedIds.value.indexOf(id)
  if (index === -1) {
    expandedIds.value.push(id)
  } else {
    expandedIds.value.splice(index, 1)
  }
}

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

const tenureLabel = (startStr, endStr) => {
  const start = new Date(startStr + '-01')
  const end = endStr === 'present' ? new Date() : new Date(endStr + '-01')
  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (totalMonths < 1) totalMonths = 1
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years === 0) return `${months}m`
  if (months === 0) return `${years}y`
  return `${years}y ${months}m`
}
</script>

<style scoped>
.experience-card {
  position: relative;
  transition: box-shadow 0.2s ease;
}

.experience-card-current::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  border-radius: 0.75rem 0.75rem 0 0;
}

.badge-present {
  background: var(--gradient-primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.75rem;
}

.tenure-divider {
  opacity: 0.6;
}

.tenure-text {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.achievements-heading {
  color: var(--color-primary);
}

.responsibilities-toggle {
  background: none;
  border: none;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary, var(--color-text));
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;
}

.responsibilities-toggle:hover,
.responsibilities-toggle:focus-visible {
  color: var(--color-primary);
}

.responsibilities-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-expanded {
  transform: rotate(-180deg);
}

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

@media (prefers-reduced-motion: reduce) {
  .chevron-icon,
  .responsibilities-toggle {
    transition: none;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
