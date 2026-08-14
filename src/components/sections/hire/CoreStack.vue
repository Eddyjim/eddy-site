<template>
  <section v-if="core.length" class="core-stack-section" :aria-label="t('sections.coreStack')">
    <div class="container">
      <div class="core-stack d-flex flex-wrap align-items-center gap-2">
        <span class="core-label">{{ t('sections.coreStack') }}</span>
        <span
          v-for="name in core"
          :key="name"
          class="core-chip"
        >{{ name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// .mjs so Node treats it as ESM without needing "type": "module" in
// package.json, which would reclassify every .js file in the project.
import { coreStack } from '@/lib/coreStack.mjs'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value)
  }
})

const { t } = useI18n()

// Same derivation the CV generator uses, so the printed PDF and this page can
// never advertise a different core stack.
const core = computed(() => coreStack(props.categories))
</script>

<style scoped>
.core-stack-section {
  padding: 1.25rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.core-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  /* --color-text, not --color-primary (4.47:1 light / 4.00:1 dark, both failing)
     and not --color-text-muted either: on --color-background-soft that measures
     4.55:1, clearing the 4.5:1 threshold by 0.05 on an 11px label. Hierarchy
     here comes from size, weight and letterspacing rather than low contrast. */
  color: var(--color-text);
  white-space: nowrap;
}

.core-chip {
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.25rem 0.65rem;
  border-radius: var(--bs-border-radius-pill, 50rem);
  background: rgba(99, 102, 241, 0.1);
  /* Foreground is the neutral text token rather than the indigo used by
     .tech-badge. Measured against this chip's actual composited surface
     (#e9ebfb light / #2a345c dark): --color-text gives 8.75:1 and 8.11:1,
     where --color-primary would give only 3.77:1 and 2.70:1. */
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

[data-bs-theme='dark'] .core-chip {
  background: rgba(99, 102, 241, 0.18);
}
</style>
