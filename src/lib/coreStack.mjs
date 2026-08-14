/**
 * Headline technologies for a six-second keyword scan.
 *
 * Shared by the site (`CoreStack.vue`) and the CV generator
 * (`scripts/build-cv.mjs`) so the printed CV and the /hire-me page can never
 * advertise different core stacks.
 */

/**
 * One technology is taken from each of these categories, in this order.
 *
 * One-per-category is deliberate: ranking all skills by proficiency and taking
 * the top eight returns eight programming languages and says nothing about
 * cloud or agents. Breadth is the point.
 */
export const CORE_CATEGORIES = [
  'languages',
  'cloud-aws',
  'agent-engineering',
  'ai-llm-tooling',
  'backend-frameworks',
  'frontend-frameworks',
  'devops-cicd',
  'databases'
]

/**
 * @param {Array<{slug: string, skills: Array<{name: string, proficiency: number, years: number, featured: boolean}>}>} categories
 * @returns {string[]} one skill name per category, in CORE_CATEGORIES order
 */
export function coreStack (categories) {
  if (!Array.isArray(categories)) return []

  return CORE_CATEGORIES.map((slug) => {
    const category = categories.find((c) => c.slug === slug)
    if (!category || !Array.isArray(category.skills)) return null

    // Prefer featured skills; fall back to the whole category so a category
    // with nothing featured still contributes rather than silently vanishing.
    const featured = category.skills.filter((s) => s.featured)
    const ranked = (featured.length ? featured : category.skills)
      .slice()
      .sort((a, b) => (b.proficiency - a.proficiency) || (b.years - a.years))

    return ranked[0]?.name ?? null
  }).filter(Boolean)
}
