<template>
  <div class="hire-view">
    <!-- Loading state -->
    <div v-if="isLoading" class="container py-5 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="container py-5">
      <div class="alert alert-danger text-center" role="alert">
        <i class="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
        {{ t('errors.contentLoadFailed') }}
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <ProfileSummary
        v-if="profileData?.profile"
        :profile="profileData.profile"
      />

      <CoreStack
        v-if="skillsData?.categories?.length"
        :categories="skillsData.categories"
      />

      <!-- Skills before Experience: this is a technical profile, and the stack
           is what a recruiter screens on first. Mirrors the CV ordering. -->
      <SkillsSection
        v-if="skillsData?.categories?.length"
        :categories="skillsData.categories"
      />

      <ExperienceSection
        v-if="experienceData?.experience?.length"
        :entries="experienceData.experience"
      />

      <EducationSection
        v-if="educationData?.education?.length"
        :entries="educationData.education"
      />

      <ProjectsSection
        v-if="projectsData?.projects?.length"
        :projects="projectsData.projects"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useYamlContent } from '@/composables/useYamlContent'
import ProfileSummary from './ProfileSummary.vue'
import CoreStack from './CoreStack.vue'
import ExperienceSection from './ExperienceSection.vue'
import SkillsSection from './SkillsSection.vue'
import EducationSection from './EducationSection.vue'
import ProjectsSection from './ProjectsSection.vue'

const { t } = useI18n()

const { data: profileData, loading: profileLoading, error: profileError } = useYamlContent('/content/cv/profile')
const { data: experienceData, loading: experienceLoading, error: experienceError } = useYamlContent('/content/cv/experience')
const { data: skillsData, loading: skillsLoading, error: skillsError } = useYamlContent('/content/cv/skills')
const { data: educationData, loading: educationLoading, error: educationError } = useYamlContent('/content/cv/education')
const { data: projectsData, loading: projectsLoading, error: projectsError } = useYamlContent('/content/cv/projects')

const isLoading = computed(() =>
  profileLoading.value || experienceLoading.value || skillsLoading.value ||
  educationLoading.value || projectsLoading.value
)

const hasError = computed(() =>
  profileError.value || experienceError.value || skillsError.value ||
  educationError.value || projectsError.value
)
</script>
