import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const STORAGE_KEY = 'eddy-site-locale'
const SUPPORTED_LOCALES = ['en', 'es']
const DEFAULT_LOCALE = 'en'

function detectBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage || ''
  return browserLang.startsWith('es') ? 'es' : DEFAULT_LOCALE
}

function getSavedLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved
  } catch (e) {
    /* localStorage unavailable */
  }
  return null
}

export function useLocale() {
  const { locale: i18nLocale, t } = useI18n()

  // Initialize locale on first use
  if (!getSavedLocale()) {
    const detected = detectBrowserLocale()
    i18nLocale.value = detected
    try {
      localStorage.setItem(STORAGE_KEY, detected)
    } catch (e) {
      /* localStorage unavailable */
    }
  } else {
    i18nLocale.value = getSavedLocale()
  }

  const locale = computed({
    get: () => i18nLocale.value,
    set: (val) => setLocale(val)
  })

  function setLocale(newLocale) {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return
    i18nLocale.value = newLocale
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  return { locale, setLocale, t }
}
