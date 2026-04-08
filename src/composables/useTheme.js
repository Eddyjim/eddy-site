import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'eddy-site-theme'

function getSystemPreference() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch (e) {
    return null
  }
}

// Shared singleton state so all components see the same value
const isDark = ref(false)

// Initialize from saved preference or system preference
const saved = getSavedTheme()
if (saved !== null) {
  isDark.value = saved === 'dark'
} else {
  isDark.value = getSystemPreference()
}

// Apply Bootstrap 5.3 theme attribute reactively
watchEffect(() => {
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', theme)
})

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch (e) {
      /* localStorage unavailable */
    }
  }

  return { isDark, toggle }
}
