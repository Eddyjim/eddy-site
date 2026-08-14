/**
 * Headline technologies for a six-second keyword scan.
 *
 * Shared by the site (`CoreStack.vue`) and the CV generator
 * (`scripts/build-cv.mjs`) so the printed CV and the /hire-me page can never
 * advertise different core stacks.
 */

/**
 * Reads the explicit `core: true` flag rather than deriving a ranking.
 *
 * This was previously derived — highest (proficiency, years) featured skill per
 * category. That silently changed the headline as an unrelated side effect:
 * featuring S3 for the homepage gave it (5, 6y) against AWS Lambda's (5, 5y),
 * so S3 displaced Lambda in the strip. The rule behaved correctly and produced
 * the wrong marketing outcome, which is the signal that this should be an
 * editorial choice rather than a sort.
 *
 * The flag lives in the YAML rather than a list of names in this file, because
 * skill names are translated: `MCP server design` is `Diseño de servidores MCP`
 * in Spanish, so an English list would silently yield nothing for `es`. A flag
 * is locale-independent by construction, and the existing EN/ES parity check
 * catches it if the two files disagree.
 *
 * @param {Array<{slug: string, skills: Array<{name: string, core?: boolean}>}>} categories
 * @returns {string[]} core skill names, in the category order of the data
 */
export function coreStack (categories) {
  if (!Array.isArray(categories)) return []

  return categories
    .flatMap((category) => (Array.isArray(category.skills) ? category.skills : []))
    .filter((skill) => skill?.core === true)
    .map((skill) => skill.name)
}
