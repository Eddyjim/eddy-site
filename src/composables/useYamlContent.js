import { ref, watch, toValue } from 'vue'
import yaml from 'js-yaml'
import { useLocale } from './useLocale'

export function useYamlContent(basePath) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const { locale } = useLocale()

  async function fetchContent(loc) {
    const path = toValue(basePath)
    loading.value = true
    error.value = null
    data.value = null

    try {
      // Try locale-specific file first
      let response = await fetch(`${path}.${loc}.yaml`)

      // Fallback to English if locale file not found
      if (!response.ok && loc !== 'en') {
        response = await fetch(`${path}.en.yaml`)
      }

      if (!response.ok) {
        throw new Error(`Failed to load content from ${path}`)
      }

      const text = await response.text()
      data.value = yaml.load(text)
    } catch (e) {
      error.value = e.message || 'Failed to load content'
    } finally {
      loading.value = false
    }
  }

  // Watch locale changes and re-fetch
  watch(locale, (newLocale) => {
    fetchContent(newLocale)
  }, { immediate: true })

  return { data, loading, error }
}
