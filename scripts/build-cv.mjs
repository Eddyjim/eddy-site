#!/usr/bin/env node
/**
 * CV generator — public/content/cv/*.yaml is the single source of truth.
 *
 * Emits LaTeX into cv/generated/, builds it with pdflatex, and copies the
 * PDFs into public/content/cv/ where the site serves them.
 *
 *   npm run cv              build every configured variant
 *   npm run cv -- en        build only English variants
 *   npm run cv -- en:short  build one specific variant
 *
 * The .tex files are generated output. Never hand-edit them — edit the YAML.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
// Shared with the site's CoreStack.vue so the PDF and /hire-me cannot disagree.
import { coreStack } from '../src/lib/coreStack.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = `${ROOT}/public/content/cv`
const GEN = `${ROOT}/cv/generated`
const OUT = `${ROOT}/cv`
const PUBLIC = `${ROOT}/public/content/cv`
const PDFLATEX = '/Library/TeX/texbin/pdflatex'

// ---------------------------------------------------------------- brand

// Accent is #4f46e5, not the site's #6366f1: as text on white the darker
// indigo measures 6.29:1 versus 4.47:1, so it clears WCAG AA. Cyan #06b6d4
// is 2.43:1 on white and is therefore only ever used as a rule, never text.
const BRAND = {
  accent: '4F46E5',
  rule: '6366F1',
  ruleAlt: '06B6D4',
  ink: '0F172A',
  muted: '475569'
}

// ---------------------------------------------------------------- helpers

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
}

const WORDS = {
  en: { present: 'Present', earlier: 'Earlier', roles: 'roles', impact: 'Selected Impact', experience: 'Experience', stack: 'Stack', education: 'Education', summary: 'Summary', projects: 'Projects', tech: 'Tech', available: 'Available' },
  es: { present: 'Presente', earlier: 'Anterior', roles: 'roles', impact: 'Logros Destacados', experience: 'Experiencia', stack: 'Stack', education: 'Educación', summary: 'Resumen', projects: 'Proyectos', tech: 'Tecnologías', available: 'Disponible' }
}

/** Both spellings are accepted so a translated data file cannot break the logic. */
const isCurrent = (v) => /^(present|presente)$/i.test(String(v ?? '').trim())

function tex (s) {
  return String(s ?? '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}

function monthYear (value, locale) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(value ?? '').trim())
  if (!m) return tex(value)
  return `${MONTHS[locale][Number(m[2]) - 1]} ${m[1]}`
}

function year (value) {
  const m = /^(\d{4})/.exec(String(value ?? '').trim())
  return m ? m[1] : null
}

function range (entry, locale, { compact = false } = {}) {
  const w = WORDS[locale]
  const end = isCurrent(entry.end_date) ? w.present : (compact ? year(entry.end_date) : monthYear(entry.end_date, locale))
  const start = compact ? year(entry.start_date) : monthYear(entry.start_date, locale)
  return `${start}–${end}`
}

function load (name, locale) {
  const path = `${CONTENT}/${name}.${locale}.yaml`
  const doc = yaml.load(readFileSync(path, 'utf8'))
  return doc[Object.keys(doc)[0]]
}

function loadAll (locale) {
  const profile = yaml.load(readFileSync(`${CONTENT}/profile.${locale}.yaml`, 'utf8')).profile
  return {
    profile,
    experience: load('experience', locale),
    education: load('education', locale),
    projects: load('projects', locale),
    skills: yaml.load(readFileSync(`${CONTENT}/skills.${locale}.yaml`, 'utf8')).categories
  }
}

// ---------------------------------------------------------------- preamble

function preamble ({ margin = '1.35cm', fontSize = '10pt', atsSafe = false } = {}) {
  // The designed variant uses a chevron marker; the ATS variant uses a plain
  // bullet, because decorative glyphs extract as replacement characters.
  const label = atsSafe
    ? '\\textbullet'
    : '\\textcolor{rulecol}{\\small$\\blacktriangleright$}'

  return `\\documentclass[${fontSize},letterpaper]{article}
\\usepackage[margin=${margin}]{geometry}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
${atsSafe
    // A Helvetica metric-clone rather than Inter. Note this is a conservatism
    // judgement, not a measured parsing win: pdfTeX encodes inter-word space as
    // a TJ displacement regardless of font, so NEITHER font emits literal space
    // characters. Parsers recover words from the gap size (~-278 for a space
    // versus ~20 for an intra-word kern), which every mainstream extractor does.
    // What this does buy: two embedded font programs instead of four, and no
    // math/symbol fonts at all. Brand typography stays on the designed variant.
    ? '\\usepackage{helvet}\n\\renewcommand{\\familydefault}{\\sfdefault}'
    : '\\usepackage[sfdefault]{inter}'}
\\usepackage{amssymb}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
${atsSafe ? '% microtype omitted: its inter-word adjustments turn spaces into\n% positioning offsets, so text extraction loses word boundaries.' : '\\usepackage{microtype}'}

\\definecolor{accent}{HTML}{${BRAND.accent}}
\\definecolor{rulecol}{HTML}{${BRAND.rule}}
\\definecolor{rulealt}{HTML}{${BRAND.ruleAlt}}
\\definecolor{ink}{HTML}{${BRAND.ink}}
\\definecolor{muted}{HTML}{${BRAND.muted}}

\\color{ink}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{leftmargin=1.1em,itemsep=0.5pt,parsep=0pt,topsep=1.5pt,label=${label}}
`
}

/** Section heading: an indigo bar plus letterspaced small caps. */
const sectionMacro = `\\newcommand{\\cvsection}[1]{%
  \\vspace{2.2mm}%
  {\\color{rulecol}\\rule[-0.18em]{2.4pt}{0.95em}}\\hspace{0.45em}%
  {\\bfseries\\footnotesize\\MakeUppercase{#1}}\\par
  \\vspace{1.2mm}%
}
`

// ---------------------------------------------------------------- designed

function designedHeader (profile, locale) {
  const w = WORDS[locale]
  const c = profile.contact ?? {}
  const bits = [
    c.email && `\\href{mailto:${c.email}}{${tex(c.email)}}`,
    c.linkedin && `\\href{${c.linkedin}}{in/eddyjim}`,
    c.github && `\\href{${c.github}}{gh/eddyjim}`,
    c.website && `\\href{${c.website}}{eddyjim.com}`,
    c.location && tex(c.location)
  ].filter(Boolean)

  const badge = profile.available
    ? `\\hfill{\\color{accent}\\small$\\bullet$}~{\\footnotesize\\color{muted}${tex(w.available)}}`
    : ''

  return `{\\fontsize{21}{23}\\selectfont\\bfseries ${tex(profile.name)}}${badge}\\par
\\vspace{0.6mm}
{\\footnotesize\\bfseries\\color{accent}\\MakeUppercase{${tex(profile.title)}}}\\par
\\vspace{1.4mm}
{\\color{rulecol}\\rule{\\linewidth}{1.1pt}}\\par
\\vspace{0.5mm}
{\\color{rulealt}\\rule{\\linewidth}{0.5pt}}\\par
\\vspace{1.6mm}
{\\footnotesize\\color{muted}${bits.join('\\ \\ \\textperiodcentered\\ \\ ')}}\\par
\\vspace{2.4mm}
`
}

/** Strongest achievement from each of the N most recent roles. */
function impactLines (experience, n = 3) {
  return experience.slice(0, n)
    .map((e) => (e.achievements ?? [])[0])
    .filter(Boolean)
}

function designedShort (data, locale) {
  const w = WORDS[locale]
  const { profile, experience, education, skills } = data
  const recent = experience.slice(0, 3)
  const older = experience.slice(3)

  const impact = impactLines(experience)
    .map((line) => `  \\item ${tex(line)}`)
    .join('\n')

  const roles = recent.map((e) => {
    const company = tex(String(e.company).split('—')[0].trim())
    // Skip index 0: it has already been promoted into Selected Impact, and
    // repeating it here would burn scarce one-page space on duplicate text.
    const achievements = (e.achievements ?? []).slice(1, 3)
      .map((a) => `  \\item ${tex(a)}`).join('\n')
    return `{\\small\\bfseries ${company}}\\hfill{\\scriptsize\\color{muted}${range(e, locale, { compact: true })}}\\par
{\\footnotesize\\color{accent}${tex(e.role)}}\\par
\\vspace{0.4mm}
{\\footnotesize\\begin{itemize}
${achievements}
\\end{itemize}}
\\vspace{1.6mm}
`
  }).join('')

  let earlier = ''
  if (older.length) {
    const from = year(older[older.length - 1].start_date)
    const to = year(older[0].end_date)
    const label = locale === 'es'
      ? `${older.length} ${w.roles} · arquitectura y consultoría`
      : `${older.length} ${w.roles} · architecture \\& consulting`
    earlier = `{\\footnotesize\\color{muted}\\textbf{${tex(w.earlier)}}\\ ${from}–${to}\\ \\textperiodcentered\\ ${label}}\\par\n`
  }

  // Full width, every category, every skill. An earlier revision put this in a
  // 34%-wide sidebar filtered to `featured: true`, which silently dropped 32 of
  // 52 skills — including half the AI stack and all the AWS detail. Never solve
  // a fitting problem by deleting content the reader came for.
  const stack = skills.map((cat) =>
    `{\\scriptsize\\bfseries ${tex(cat.name)}}\\ {\\scriptsize\\color{muted}${cat.skills.map((s) => tex(s.name)).join(' \\textperiodcentered\\ ')}}\\par
\\vspace{0.75mm}
`).join('')

  const edu = education.map((e) =>
    `{\\footnotesize\\bfseries ${tex(e.degree)}}\\par
{\\scriptsize\\color{muted}${tex(e.institution)}\\ \\textperiodcentered\\ ${year(e.end_date) ?? ''}}\\par
\\vspace{1.2mm}
`).join('')

  const langs = (profile.languages ?? []).length
    ? `\\cvsection{${tex(locale === 'es' ? 'Idiomas' : 'Languages')}}
${(profile.languages ?? []).map((l) =>
      `{\\footnotesize\\bfseries ${tex(l.label)}}{\\scriptsize\\color{muted}\\ \\textperiodcentered\\ ${tex(l.level)}}\\par`
    ).join('\n')}
`
    : ''

  // Core strip sits above the summary so the keyword scan is satisfied in the
  // first seconds, while Selected Impact keeps the prime reading position.
  const core = coreStack(skills)
  const coreStrip = core.length
    ? `{\\scriptsize\\bfseries\\color{accent}${tex(locale === 'es' ? 'STACK PRINCIPAL' : 'CORE STACK')}}\\ \\ {\\footnotesize ${core.map(tex).join(' \\textperiodcentered\\ ')}}\\par
\\vspace{1.3mm}
{\\color{rulealt}\\rule{\\linewidth}{0.4pt}}\\par
\\vspace{1.8mm}
`
    : ''

  return `${preamble({ margin: '1.35cm', fontSize: '10pt' })}${sectionMacro}
\\begin{document}
${designedHeader(profile, locale)}${coreStrip}{\\small ${tex(profile.summary)}}\\par
\\vspace{1.2mm}

\\cvsection{${tex(w.impact)}}
{\\footnotesize\\begin{itemize}
${impact}
\\end{itemize}}

\\vspace{1.2mm}
\\noindent
\\begin{minipage}[t]{0.635\\linewidth}
\\cvsection{${tex(w.experience)}}
${roles}${earlier}\\end{minipage}%
\\hfill%
\\begin{minipage}[t]{0.325\\linewidth}
\\cvsection{${tex(w.education)}}
${edu}${langs}\\end{minipage}

\\vspace{1.5mm}
\\cvsection{${tex(w.stack)}}
${stack}
\\end{document}
`
}

/**
 * Brand-styled long form: single column, every role in full.
 *
 * Deliberately has no Selected Impact section. In the short variant that block
 * earns its space by surfacing three achievements the reader would otherwise
 * miss; here every achievement is already printed under its role, so an Impact
 * block would only duplicate text.
 */
function designedDetailed (data, locale) {
  const w = WORDS[locale]
  const { profile, experience, education, projects, skills } = data

  const roles = experience.map((e) => {
    const items = (e.achievements ?? []).map((a) => `  \\item ${tex(a)}`).join('\n')
    const stack = (e.technologies ?? []).length
      ? `\\vspace{0.7mm}\n{\\scriptsize\\color{muted}\\textbf{${tex(w.tech)}:} ${(e.technologies ?? []).map(tex).join(' \\textperiodcentered\\ ')}}\\par`
      : ''
    return `{\\small\\bfseries ${tex(e.role)}}\\hfill{\\scriptsize\\color{muted}${range(e, locale)}}\\par
{\\footnotesize\\color{accent}${tex(e.company)}}${e.location ? `{\\scriptsize\\color{muted}\\ \\textperiodcentered\\ ${tex(e.location)}}` : ''}\\par
\\vspace{0.6mm}
{\\footnotesize ${tex(e.summary)}}\\par
\\vspace{0.6mm}
{\\footnotesize\\begin{itemize}
${items}
\\end{itemize}}
${stack}
\\vspace{2.6mm}
`
  }).join('')

  const stackAll = skills.map((cat) =>
    `{\\footnotesize\\bfseries ${tex(cat.name)}}\\ {\\footnotesize\\color{muted}${cat.skills.map((s) => tex(s.name)).join(' \\textperiodcentered\\ ')}}\\par\\vspace{1mm}`
  ).join('\n')

  const proj = projects.map((p) =>
    `{\\footnotesize\\bfseries ${tex(p.title)}}\\par
{\\footnotesize ${tex(p.description)}}\\par
${(p.technologies ?? []).length ? `{\\scriptsize\\color{muted}${(p.technologies ?? []).map(tex).join(' \\textperiodcentered\\ ')}}\\par` : ''}
\\vspace{1.8mm}
`).join('')

  const edu = education.map((e) =>
    `{\\footnotesize\\bfseries ${tex(e.degree)}}${e.field ? `{\\footnotesize , ${tex(e.field)}}` : ''}\\hfill{\\scriptsize\\color{muted}${year(e.start_date) ?? ''}–${year(e.end_date) ?? ''}}\\par
{\\scriptsize\\color{muted}${tex(e.institution)}${e.details ? ` \\textperiodcentered\\ ${tex(e.details)}` : ''}}\\par
\\vspace{1.6mm}
`).join('')

  return `${preamble({ margin: '1.5cm', fontSize: '10pt' })}${sectionMacro}
\\begin{document}
${designedHeader(profile, locale)}
{\\small ${tex(profile.summary)}}\\par

% Stack precedes Experience deliberately: this is a technical profile, and when
% it sat after seven roles it landed on page 2, out of sight during the initial
% keyword screen.
\\cvsection{${tex(w.stack)}}
${stackAll}

\\vspace{1.5mm}
\\cvsection{${tex(w.experience)}}
${roles}
\\cvsection{${tex(w.projects)}}
${proj}
\\cvsection{${tex(w.education)}}
${edu}
\\end{document}
`
}

// ---------------------------------------------------------------- ATS

/**
 * Single column, no multi-column constructs, no icon glyphs, no tabular
 * text. Everything flows top-to-bottom so a parser reads it in order.
 * Length is unconstrained: a parser does not care, and more content means
 * better keyword coverage.
 */
function atsPlain (data, locale) {
  const w = WORDS[locale]
  const { profile, experience, education, projects, skills } = data
  const c = profile.contact ?? {}

  const head = [c.email, c.linkedin, c.github, c.location].filter(Boolean).map(tex).join(' | ')

  const heading = (t) => `\\vspace{3mm}{\\large\\bfseries ${tex(t)}}\\par\\vspace{1mm}{\\color{rulecol}\\rule{\\linewidth}{0.6pt}}\\par\\vspace{1.5mm}`

  const roles = experience.map((e) => {
    const items = (e.achievements ?? []).map((a) => `  \\item ${tex(a)}`).join('\n')
    const stack = (e.technologies ?? []).length
      ? `\\textbf{${tex(w.tech)}:} ${(e.technologies ?? []).map(tex).join(', ')}\\par`
      : ''
    return `{\\bfseries ${tex(e.role)}}\\par
${tex(e.company)}\\par
${range(e, locale)}${e.location ? ` | ${tex(e.location)}` : ''}\\par
\\vspace{0.8mm}
${tex(e.summary)}\\par
\\vspace{0.8mm}
\\begin{itemize}
${items}
\\end{itemize}
${stack}
\\vspace{2.5mm}
`
  }).join('')

  const stackAll = skills.map((cat) =>
    `\\textbf{${tex(cat.name)}:} ${cat.skills.map((s) => tex(s.name)).join(', ')}\\par\\vspace{0.6mm}`
  ).join('\n')

  const edu = education.map((e) =>
    `{\\bfseries ${tex(e.degree)}}${e.field ? `, ${tex(e.field)}` : ''}\\par
${tex(e.institution)}\\par
${year(e.start_date) ?? ''}–${year(e.end_date) ?? ''}\\par
\\vspace{2mm}
`).join('')

  const proj = projects.map((p) =>
    `{\\bfseries ${tex(p.title)}}\\par
${tex(p.description)}\\par
${(p.technologies ?? []).length ? `\\textbf{${tex(w.tech)}:} ${(p.technologies ?? []).map(tex).join(', ')}\\par` : ''}
\\vspace{2mm}
`).join('')

  return `${preamble({ margin: '1.8cm', fontSize: '11pt', atsSafe: true })}
\\begin{document}
% Ragged right, not justified: justification stretches inter-word space into
% glyph-positioning offsets, which extraction tools cannot read back as spaces.
\\raggedright
{\\LARGE\\bfseries ${tex(profile.name)}}\\par
\\vspace{1mm}
${tex(profile.title)}\\par
\\vspace{1mm}
${head}\\par

${heading(w.summary)}
${tex(profile.summary)}\\par

${heading(w.stack)}
${stackAll}

${heading(w.experience)}
${roles}
${heading(w.projects)}
${proj}
${heading(w.education)}
${edu}
\\end{document}
`
}

// ---------------------------------------------------------------- build

const VARIANTS = {
  'en:short': { locale: 'en', out: 'cv.en', render: designedShort, maxPages: 1 },
  'en:detailed': { locale: 'en', out: 'cv.en.detailed', render: designedDetailed, maxPages: 3 },
  'en:ats': { locale: 'en', out: 'cv.en.ats', render: atsPlain, maxPages: null },
  'es:short': { locale: 'es', out: 'cv.es', render: designedShort, maxPages: 1 },
  'es:detailed': { locale: 'es', out: 'cv.es.detailed', render: designedDetailed, maxPages: 3 },
  'es:ats': { locale: 'es', out: 'cv.es.ats', render: atsPlain, maxPages: null }
}

/**
 * Every variant must print every skill and every category label.
 *
 * This exists because an earlier short-CV layout filtered the sidebar to
 * `featured: true` to make it fit, silently dropping 32 of 52 skills — half the
 * AI stack and all the AWS detail — and nothing in the build complained. A
 * fitting problem must be solved with typography, not by discarding content.
 */
function assertFullCoverage (key, data, source) {
  const expected = [
    ...data.skills.map((c) => c.name),
    ...data.skills.flatMap((c) => c.skills.map((s) => s.name))
  ]
  // Escape via tex() so this check can never drift from how content is emitted.
  const missing = expected.filter((name) => !source.includes(tex(name)))
  if (missing.length) {
    throw new Error(
      `${key} omits ${missing.length}/${expected.length} stack entries: ${missing.join(', ')}`
    )
  }
}

function buildVariant (key) {
  const v = VARIANTS[key]
  const data = loadAll(v.locale)
  const source = v.render(data, v.locale)
  assertFullCoverage(key, data, source)
  const texPath = `${GEN}/${v.out}.tex`
  writeFileSync(texPath, source, 'utf8')

  let log = ''
  try {
    log = execFileSync(PDFLATEX, ['-interaction=nonstopmode', '-halt-on-error', `-output-directory=${GEN}`, texPath], { encoding: 'utf8' })
  } catch (err) {
    const out = (err.stdout ?? '') + (err.stderr ?? '')
    const errLines = out.split('\n').filter((l) => l.startsWith('!')).slice(0, 5)
    throw new Error(`pdflatex failed for ${key}:\n${errLines.join('\n') || out.slice(-1200)}`)
  }

  // pdflatex hard-wraps log lines at ~79 chars and does so mid-token, e.g.
  // "(3 page\ns, 30272 bytes)". Newlines must be removed outright, not turned
  // into spaces, or the token cannot be reassembled. An unreadable count is a
  // failure: letting it default to zero would silently pass the page budget.
  const flat = log.replace(/\r?\n/g, '')
  const match = /Output written on \S+ \((\d+) pages?,/.exec(flat)
  if (!match) throw new Error(`Could not read page count for ${key} from pdflatex log`)
  const pages = Number(match[1])

  copyFileSync(`${GEN}/${v.out}.pdf`, `${OUT}/${v.out}.pdf`)
  copyFileSync(`${GEN}/${v.out}.pdf`, `${PUBLIC}/${v.out}.pdf`)

  const over = v.maxPages !== null && pages > v.maxPages
  return { key, pages, over, budget: v.maxPages }
}

function main () {
  const filter = process.argv.slice(2)
  const keys = Object.keys(VARIANTS).filter((k) =>
    filter.length === 0 || filter.some((f) => k === f || k.startsWith(`${f}:`)))

  if (!keys.length) {
    console.error(`No variants matched. Available: ${Object.keys(VARIANTS).join(', ')}`)
    process.exit(1)
  }

  if (existsSync(GEN)) rmSync(GEN, { recursive: true, force: true })
  mkdirSync(GEN, { recursive: true })

  const results = keys.map(buildVariant)

  console.log('')
  for (const r of results) {
    const budget = r.budget === null ? 'unconstrained' : `budget ${r.budget}`
    console.log(`  ${r.over ? 'OVER ' : 'ok   '} ${r.key.padEnd(10)} ${String(r.pages).padStart(2)} page(s)  (${budget})`)
  }
  console.log('')

  const failed = results.filter((r) => r.over)
  if (failed.length) {
    console.error(`Page budget exceeded: ${failed.map((r) => r.key).join(', ')}`)
    process.exit(1)
  }
}

main()
