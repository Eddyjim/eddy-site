/**
 * Date helpers for CV content.
 *
 * Shared by the site components and scripts/build-cv.mjs so the page and the
 * generated PDFs agree on what counts as a current role.
 */

/**
 * Is this `end_date` the "still going" sentinel?
 *
 * `experience.en.yaml` uses `present` and `experience.es.yaml` uses `presente`.
 * Both are accepted, because a strict `=== 'present'` check meant the Spanish
 * edition never matched: the current role lost its badge and accent, and
 * `new Date('presente-01')` produced an invalid date that made the tenure
 * calculation negative — a four-year role rendered as "1m".
 *
 * Accepting both spellings is the tolerant fix. The robust fix is a
 * `current: true` boolean in the YAML, which removes the magic string
 * altogether and cannot be broken by translating a data file; that is a schema
 * change across both locales and all consumers, worth doing separately.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isCurrent (value) {
  return /^(present|presente)$/i.test(String(value ?? '').trim())
}

/**
 * Months between two `YYYY-MM` dates, treating the current sentinel as today.
 *
 * Returns null for unparseable input rather than clamping to a floor. The
 * previous implementation forced any value below 1 up to 1, which is precisely
 * what disguised the bug above: malformed data produced a plausible-looking
 * "1m" instead of an obvious failure.
 *
 * @param {string} startStr `YYYY-MM`
 * @param {string} endStr `YYYY-MM` or the current sentinel
 * @returns {number|null} whole months, or null if either date is unusable
 */
export function monthsBetween (startStr, endStr) {
  const start = new Date(`${startStr}-01`)
  const end = isCurrent(endStr) ? new Date() : new Date(`${endStr}-01`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

  return months < 0 ? null : months
}
