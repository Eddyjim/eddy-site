<template>
  <div class="filter-bar d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter options">
    <button
      type="button"
      class="btn btn-sm rounded-pill filter-pill px-3"
      :class="isAllActive ? 'filter-pill-active' : 'filter-pill-inactive'"
      @click="clearFilters"
    >
      {{ t('filters.all') }}
    </button>
    <button
      v-for="category in categories"
      :key="category"
      type="button"
      class="btn btn-sm rounded-pill filter-pill px-3"
      :class="isActive(category) ? 'filter-pill-active' : 'filter-pill-inactive'"
      @click="toggle(category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => value.every((item) => typeof item === 'string')
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const isAllActive = computed(() => props.modelValue.length === 0)

const isActive = (category) => props.modelValue.includes(category)

const toggle = (category) => {
  const current = [...props.modelValue]
  const index = current.indexOf(category)
  if (index === -1) {
    current.push(category)
  } else {
    current.splice(index, 1)
  }
  emit('update:modelValue', current)
}

const clearFilters = () => {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.filter-pill {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.4em 1em;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.filter-pill-active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
}

.filter-pill-active:hover {
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  color: #fff;
}

.filter-pill-inactive {
  background: var(--color-background-mute);
  color: var(--color-text);
  border-color: var(--color-border);
}

.filter-pill-inactive:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.06);
}
</style>
