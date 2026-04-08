<template>
  <section class="education-section py-5">
    <div class="container">
      <h2 class="section-heading">{{ t('sections.education') }}</h2>

      <div class="education-timeline">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="fresh-card mb-3 education-card"
        >
          <div
            class="card-body-area cursor-pointer p-3"
            role="button"
            tabindex="0"
            :aria-expanded="isExpanded(entry.id)"
            :aria-controls="'education-' + entry.id"
            @click="toggleExpand(entry.id)"
            @keydown.enter.prevent="toggleExpand(entry.id)"
            @keydown.space.prevent="toggleExpand(entry.id)"
          >
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="h5 mb-1 fw-semibold">{{ entry.institution }}</h3>
                <p class="mb-1">
                  {{ entry.degree }}
                  <span v-if="entry.field"> &mdash; {{ entry.field }}</span>
                </p>
                <p class="small text-body-tertiary mb-0">
                  {{ formatDate(entry.start_date) }} &ndash; {{ formatEndDate(entry.end_date) }}
                </p>
              </div>
              <i
                class="bi bi-chevron-down fs-5 ms-3 text-body-secondary chevron-icon"
                :class="{ 'chevron-expanded': isExpanded(entry.id) }"
                aria-hidden="true"
              ></i>
            </div>

            <Transition name="slide">
              <div
                v-if="isExpanded(entry.id) && entry.details?.length"
                :id="'education-' + entry.id"
              >
                <hr class="my-3">
                <ul class="mb-0">
                  <li v-for="(detail, index) in entry.details" :key="index">
                    {{ detail }}
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
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
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.education-timeline {
  border-left: 3px solid var(--color-primary);
  padding-left: 1.5rem;
}

.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-expanded {
  transform: rotate(-180deg);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
