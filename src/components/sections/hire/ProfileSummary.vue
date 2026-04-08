<template>
  <section class="profile-summary">
    <div class="profile-bg" aria-hidden="true">
      <div class="profile-blob profile-blob-1"></div>
      <div class="profile-blob profile-blob-2"></div>
    </div>
    <div class="container text-center position-relative py-5">
      <h1 class="display-4 fw-bold text-gradient mb-2">{{ profile.name }}</h1>
      <h2 class="fs-4 text-body-secondary fw-normal mb-4">{{ profile.title }}</h2>
      <p class="lead mx-auto mb-4 profile-text">{{ profile.summary }}</p>
      <a
        v-if="profile.pdf_path"
        :href="profile.pdf_path"
        download
        class="btn btn-download btn-lg px-4"
      >
        <i class="bi bi-download me-2" aria-hidden="true"></i>
        {{ t('actions.downloadCv') }}
      </a>
      <button
        v-else
        type="button"
        class="btn btn-download btn-lg px-4"
        disabled
        :title="t('errors.pdfUnavailable')"
      >
        <i class="bi bi-download me-2" aria-hidden="true"></i>
        {{ t('actions.downloadCv') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  profile: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.name === 'string'
  }
})

const { t } = useI18n()
</script>

<style scoped>
.profile-summary {
  position: relative;
  overflow: hidden;
  padding: 3rem 0;
}

.profile-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.profile-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}

.profile-blob-1 {
  width: 400px;
  height: 400px;
  background: #6366f1;
  top: -20%;
  left: -5%;
}

.profile-blob-2 {
  width: 350px;
  height: 350px;
  background: #06b6d4;
  bottom: -20%;
  right: -5%;
}

.profile-text {
  max-width: 700px;
  color: var(--color-text);
}

.btn-download {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
  color: #fff;
}

.btn-download:disabled {
  opacity: 0.5;
  transform: none;
  box-shadow: none;
}
</style>
