<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="site-footer">
    <div class="container py-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div class="social-links d-flex gap-3">
          <a href="https://github.com/Eddyjim" target="_blank" rel="noopener" aria-label="GitHub" class="social-link">
            <i class="bi bi-github"></i>
          </a>
          <a href="https://linkedin.com/in/eddyjim" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
            <i class="bi bi-linkedin"></i>
          </a>
        </div>
        <p class="mb-0 small text-body-tertiary">
          Eddyjim &copy; {{ currentYear }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: 3rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  color: var(--color-text-muted, var(--color-text));
  background: var(--color-background-mute);
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.social-link:hover {
  color: #fff;
  background: var(--gradient-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}
</style>
