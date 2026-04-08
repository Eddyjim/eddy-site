<script setup>
import { useI18n } from 'vue-i18n'
import { useYamlContent } from '@/composables/useYamlContent'

const { t } = useI18n()
const { data: profileData, loading, error } = useYamlContent('/content/cv/profile')
</script>

<template>
  <div class="contact-view">
    <!-- Loading -->
    <div v-if="loading" class="container py-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-danger text-center">
        {{ t('errors.contentLoadFailed') }}
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="profileData?.profile">
      <!-- Hero -->
      <section class="contact-hero">
        <div class="contact-bg" aria-hidden="true">
          <div class="contact-blob contact-blob-1"></div>
          <div class="contact-blob contact-blob-2"></div>
        </div>
        <div class="container text-center position-relative py-5">
          <h1 class="display-4 fw-bold text-gradient mb-3">
            {{ t('contact.heading') }}
          </h1>
          <p class="fs-5 text-body-secondary mx-auto contact-subtitle">
            {{ t('contact.subtitle') }}
          </p>
        </div>
      </section>

      <!-- Contact Details -->
      <section class="container py-5">
        <div class="row g-4 justify-content-center">

          <!-- Info Cards -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="fresh-card p-4 h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="contact-icon-wrapper">
                  <i class="bi bi-envelope" aria-hidden="true"></i>
                </div>
                <div>
                  <small class="text-body-tertiary d-block">{{ t('contact.email') }}</small>
                  <a :href="'mailto:' + profileData.profile.contact.email" class="fw-medium">
                    {{ profileData.profile.contact.email }}
                  </a>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="contact-icon-wrapper">
                  <i class="bi bi-geo-alt" aria-hidden="true"></i>
                </div>
                <div>
                  <small class="text-body-tertiary d-block">{{ t('contact.location') }}</small>
                  <span class="fw-medium">{{ profileData.profile.contact.location }}</span>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3">
                <div class="contact-icon-wrapper">
                  <i class="bi bi-clock" aria-hidden="true"></i>
                </div>
                <div>
                  <small class="text-body-tertiary d-block">{{ t('contact.timezone') }}</small>
                  <span class="fw-medium">{{ t('contact.timezoneValue') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Connect Card -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="fresh-card p-4 h-100">
              <h2 class="h5 fw-semibold mb-4">{{ t('contact.connectHeading') }}</h2>

              <div class="d-flex flex-column gap-3">
                <a
                  :href="profileData.profile.contact.linkedin"
                  target="_blank"
                  rel="noopener"
                  class="social-card d-flex align-items-center gap-3"
                >
                  <div class="social-icon-wrapper">
                    <i class="bi bi-linkedin"></i>
                  </div>
                  <span class="fw-medium">LinkedIn</span>
                  <i class="bi bi-arrow-right ms-auto"></i>
                </a>

                <a
                  :href="profileData.profile.contact.github"
                  target="_blank"
                  rel="noopener"
                  class="social-card d-flex align-items-center gap-3"
                >
                  <div class="social-icon-wrapper">
                    <i class="bi bi-github"></i>
                  </div>
                  <span class="fw-medium">GitHub</span>
                  <i class="bi bi-arrow-right ms-auto"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability Badge + CTAs -->
        <div class="text-center mt-5">
          <span class="availability-badge mb-4 d-inline-block">
            <i class="bi bi-circle-fill text-success me-2" style="font-size: 0.5rem; vertical-align: middle;"></i>
            {{ t('contact.availability') }}
          </span>

          <div class="d-flex justify-content-center gap-3 mt-3 flex-wrap">
            <a
              :href="'mailto:' + profileData.profile.contact.email"
              class="btn btn-cta btn-lg px-4"
            >
              <i class="bi bi-envelope me-2"></i>
              {{ t('contact.sendEmail') }}
            </a>
            <RouterLink
              to="/hire-me"
              class="btn btn-outline-cta btn-lg px-4"
            >
              <i class="bi bi-file-earmark-person me-2"></i>
              {{ t('contact.hireMe') }}
            </RouterLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.contact-hero {
  position: relative;
  overflow: hidden;
  padding: 3rem 0;
}

.contact-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.contact-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}

.contact-blob-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary);
  top: -15%;
  right: -5%;
}

.contact-blob-2 {
  width: 350px;
  height: 350px;
  background: var(--color-secondary);
  bottom: -15%;
  left: -5%;
}

@media (prefers-reduced-motion: reduce) {
  .contact-blob { animation: none; }
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-subtitle {
  max-width: 550px;
  line-height: 1.7;
}

.contact-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.1));
  color: var(--color-primary);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.social-card {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  color: var(--color-text, inherit);
  transition: all 0.2s ease;
  text-decoration: none;
}

.social-card:hover {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(6, 182, 212, 0.04));
  color: var(--color-primary);
}

.social-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-background-mute);
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.social-card:hover .social-icon-wrapper {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15));
  color: var(--color-primary);
}

.availability-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.btn-cta {
  background: var(--gradient-primary);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
  color: #fff;
}

.btn-outline-cta {
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.btn-outline-cta:hover {
  background: var(--gradient-primary);
  border-color: transparent;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
}
</style>
