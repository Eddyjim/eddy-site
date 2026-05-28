<template>
  <section class="profile-summary">
    <div class="profile-bg" aria-hidden="true">
      <div class="profile-blob profile-blob-1"></div>
      <div class="profile-blob profile-blob-2"></div>
    </div>
    <div class="container text-center position-relative py-5">
      <div
        v-if="profile.available && profile.availability_note"
        class="availability-pill mb-3"
      >
        <span class="availability-dot" aria-hidden="true"></span>
        <span>{{ profile.availability_note }}</span>
      </div>

      <h1 class="display-4 fw-bold text-gradient mb-2">{{ profile.name }}</h1>
      <h2 class="fs-4 text-body-secondary fw-normal mb-2">{{ profile.title }}</h2>
      <p v-if="profile.tagline" class="profile-tagline mb-4">{{ profile.tagline }}</p>
      <p class="lead mx-auto mb-4 profile-text">{{ profile.summary }}</p>

      <div
        v-if="hasGlance"
        class="glance-row d-flex flex-wrap justify-content-center gap-3 mb-4"
      >
        <span v-if="profile.contact?.location" class="glance-item">
          <i class="bi bi-geo-alt" aria-hidden="true"></i>
          {{ profile.contact.location }}
        </span>
        <span v-if="profile.timezone" class="glance-item">
          <i class="bi bi-clock" aria-hidden="true"></i>
          {{ profile.timezone }}
        </span>
        <span v-if="profile.work_mode" class="glance-item">
          <i class="bi bi-laptop" aria-hidden="true"></i>
          {{ profile.work_mode }}
        </span>
        <span
          v-for="lang in profile.languages || []"
          :key="lang.code"
          class="glance-item"
        >
          <i class="bi bi-translate" aria-hidden="true"></i>
          {{ lang.label }}
          <span v-if="lang.level" class="text-body-tertiary glance-level">
            ({{ lang.level }})
          </span>
        </span>
      </div>

      <div class="action-row d-flex flex-wrap justify-content-center align-items-center gap-3">
        <a
          v-if="cvVersions.length === 1"
          :href="cvVersions[0].path"
          download
          class="btn btn-download btn-lg px-4"
        >
          <i class="bi bi-download me-2" aria-hidden="true"></i>
          {{ t('actions.downloadCv') }}
        </a>

        <div
          v-else-if="cvVersions.length > 1"
          ref="cvDropdownRef"
          class="cv-dropdown"
        >
          <button
            type="button"
            class="btn btn-download btn-lg px-4 cv-dropdown-toggle"
            aria-haspopup="menu"
            :aria-expanded="cvMenuOpen"
            :aria-label="t('cv.chooseVersion')"
            @click.stop="toggleCvMenu"
          >
            <i class="bi bi-download me-2" aria-hidden="true"></i>
            {{ t('actions.downloadCv') }}
            <i
              class="bi bi-chevron-down ms-2 cv-chevron"
              :class="{ 'cv-chevron-open': cvMenuOpen }"
              aria-hidden="true"
            ></i>
          </button>
          <Transition name="cv-menu">
            <ul v-if="cvMenuOpen" class="cv-menu" role="menu">
              <li v-for="version in cvVersions" :key="version.id" role="none">
                <a
                  :href="version.path"
                  download
                  class="cv-menu-item"
                  role="menuitem"
                  @click="closeCvMenu"
                >
                  {{ t(`cv.${version.id}`) }}
                </a>
              </li>
            </ul>
          </Transition>
        </div>

        <div v-else>
          <span class="btn btn-outline-secondary btn-lg px-4 btn-unavailable">
            <i class="bi bi-download me-2" aria-hidden="true"></i>
            {{ t('actions.downloadCv') }}
          </span>
          <p class="text-body-secondary mt-2 mb-0 small">
            ({{ t('errors.pdfUnavailable') }})
          </p>
        </div>

        <div v-if="hasContactLinks" class="contact-links d-flex gap-2">
          <a
            v-if="profile.contact?.linkedin"
            :href="profile.contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-icon"
            :aria-label="t('social.linkedin')"
          >
            <i class="bi bi-linkedin" aria-hidden="true"></i>
          </a>
          <a
            v-if="profile.contact?.github"
            :href="profile.contact.github"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-icon"
            :aria-label="t('social.github')"
          >
            <i class="bi bi-github" aria-hidden="true"></i>
          </a>
          <a
            v-if="profile.contact?.email"
            :href="'mailto:' + profile.contact.email"
            class="btn-icon"
            :aria-label="t('social.email')"
          >
            <i class="bi bi-envelope" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
    validator: (value) => value && typeof value.name === 'string'
  }
})

const { t } = useI18n()

const cvMenuOpen = ref(false)
const cvDropdownRef = ref(null)

const cvVersions = computed(() => {
  const versions = props.profile.cv_versions
  if (Array.isArray(versions) && versions.length > 0) return versions
  if (props.profile.pdf_path) {
    return [{ id: 'default', path: props.profile.pdf_path }]
  }
  return []
})

const toggleCvMenu = () => {
  cvMenuOpen.value = !cvMenuOpen.value
}

const closeCvMenu = () => {
  cvMenuOpen.value = false
}

const handleOutsideClick = (event) => {
  if (cvDropdownRef.value && !cvDropdownRef.value.contains(event.target)) {
    closeCvMenu()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') closeCvMenu()
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleEscape)
})

const hasGlance = computed(() => {
  const p = props.profile
  return Boolean(
    p.contact?.location ||
    p.timezone ||
    p.work_mode ||
    (Array.isArray(p.languages) && p.languages.length)
  )
})

const hasContactLinks = computed(() => {
  const c = props.profile.contact
  return Boolean(c?.linkedin || c?.github || c?.email)
})
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
  background: var(--color-primary);
  top: -20%;
  left: -5%;
}

.profile-blob-2 {
  width: 350px;
  height: 350px;
  background: var(--color-secondary);
  bottom: -20%;
  right: -5%;
}

.profile-text {
  max-width: 700px;
  color: var(--color-text);
}

.profile-tagline {
  font-style: italic;
  color: var(--color-text-soft, var(--color-text));
  font-size: 1rem;
  opacity: 0.85;
}

.availability-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.10);
  color: rgb(21, 128, 61);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.availability-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(34, 197, 94);
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.glance-row {
  font-size: 0.9rem;
}

.glance-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-secondary, var(--color-text));
  opacity: 0.85;
}

.glance-item i {
  color: var(--color-primary);
}

.glance-level {
  font-size: 0.8rem;
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

.btn-unavailable {
  opacity: 0.6;
  cursor: default;
  pointer-events: none;
}

.cv-dropdown {
  position: relative;
  display: inline-block;
}

.cv-dropdown-toggle {
  cursor: pointer;
}

.cv-chevron {
  display: inline-block;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85em;
}

.cv-chevron-open {
  transform: rotate(-180deg);
}

.cv-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
  background: var(--color-background, #fff);
  border: 1px solid var(--color-border, rgba(99, 102, 241, 0.25));
  border-radius: 0.75rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
  z-index: 50;
  text-align: left;
}

.cv-menu-item {
  display: block;
  padding: 0.55rem 1rem;
  color: var(--color-text, #1f2937);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.cv-menu-item:hover,
.cv-menu-item:focus-visible {
  background-color: rgba(99, 102, 241, 0.10);
  color: var(--color-primary);
}

.cv-menu-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.cv-menu-enter-active,
.cv-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.cv-menu-enter-from,
.cv-menu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

.cv-menu-enter-to,
.cv-menu-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.contact-links {
  align-items: center;
}

.btn-icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--color-border, rgba(99, 102, 241, 0.25));
  color: var(--color-text-secondary, var(--color-text));
  background: transparent;
  font-size: 1.15rem;
  text-decoration: none;
  transition: transform 0.2s ease, color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.btn-icon:hover,
.btn-icon:focus-visible {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: rgba(99, 102, 241, 0.08);
  transform: translateY(-2px);
}

.btn-icon:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .profile-blob,
  .profile-blob-1,
  .profile-blob-2 {
    animation: none;
  }
  .availability-dot {
    animation: none;
  }
  .btn-download:hover,
  .btn-icon:hover,
  .btn-icon:focus-visible {
    transform: none;
  }
  .cv-chevron,
  .cv-menu-enter-active,
  .cv-menu-leave-active {
    transition: none;
  }
}
</style>
