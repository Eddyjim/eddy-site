<template>
  <div class="home-view">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="container py-5">
      <div class="alert alert-danger text-center" role="alert">
        {{ t('errors.contentLoadFailed') }}
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <HeroSection
        v-if="profile"
        :name="profile.name"
        :title="profile.title"
        :tagline="profile.tagline"
      />

      <div class="container mb-5 mt-5">
        <ServicesSection
          v-if="servicesList"
          :services="servicesList"
        />
      </div>

      <div class="container mb-5">
        <SkillsPreview
          v-if="featuredCategories.length"
          :categories="featuredCategories"
        />
      </div>

      <div class="container mb-5">
        <ProjectHighlights
          v-if="featuredProjects.length"
          :projects="featuredProjects"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useYamlContent } from '@/composables/useYamlContent'
import HeroSection from '@/components/sections/home/HeroSection.vue'
import ServicesSection from '@/components/sections/home/ServicesSection.vue'
import SkillsPreview from '@/components/sections/home/SkillsPreview.vue'
import ProjectHighlights from '@/components/sections/home/ProjectHighlights.vue'

const { t } = useI18n()

const { data: profileData, loading: profileLoading, error: profileError } = useYamlContent('/content/cv/profile')
const { data: servicesData, loading: servicesLoading, error: servicesError } = useYamlContent('/content/cv/services')
const { data: skillsData, loading: skillsLoading, error: skillsError } = useYamlContent('/content/cv/skills')
const { data: projectsData, loading: projectsLoading, error: projectsError } = useYamlContent('/content/cv/projects')

const isLoading = computed(() =>
  profileLoading.value || servicesLoading.value || skillsLoading.value || projectsLoading.value
)

const hasError = computed(() =>
  profileError.value || servicesError.value || skillsError.value || projectsError.value
)

const profile = computed(() => profileData.value?.profile ?? null)

const servicesList = computed(() => servicesData.value?.services ?? null)

// Filter each category to only include featured skills, then exclude empty categories
const featuredCategories = computed(() => {
  const categories = skillsData.value?.categories ?? []
  return categories
    .map((category) => ({
      ...category,
      skills: category.skills.filter((skill) => skill.featured)
    }))
    .filter((category) => category.skills.length > 0)
})

const featuredProjects = computed(() => {
  const projects = projectsData.value?.projects ?? []
  return projects.filter((project) => project.featured)
})
</script>

<style scoped>
.text-primary {
  color: #0891b2 !important;
}
</style>
