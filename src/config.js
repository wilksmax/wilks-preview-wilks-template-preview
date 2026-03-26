import cfg from '../site.config.json'

// Apply all theme tokens as CSS custom properties on :root
const t = cfg.theme || {}
const root = document.documentElement

const map = {
  '--color-primary':     t.primaryColor   || '#f06422',
  '--color-primary-dk':  t.primaryDark    || '#c04d0f',
  '--color-bg':          t.bgColor        || '#0c0c0c',
  '--color-surface':     t.surfaceColor   || '#141414',
  '--color-surface-alt': t.surfaceAlt     || '#1a1a1a',
  '--color-text':        t.textColor      || '#f0ede8',
  '--color-muted':       t.mutedColor     || '#888480',
  '--color-border':      t.borderColor    || '#2a2a2a',
  '--font-heading':      `'${t.headingFont || 'Barlow Condensed'}', sans-serif`,
  '--font-body':         `'${t.bodyFont   || 'DM Sans'}', sans-serif`,
  '--font-heading-wt':   t.headingWeight  || '700',
  '--radius':            t.borderRadius   || '4px',
  '--radius-card':       t.cardRadius     || '8px',
}

Object.entries(map).forEach(([k, v]) => root.style.setProperty(k, v))

// Set document title and meta description
if (cfg.meta?.siteTitle)   document.title = cfg.meta.siteTitle
if (cfg.meta?.description) {
  let m = document.querySelector('meta[name="description"]')
  if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
  m.content = cfg.meta.description
}
if (cfg.meta?.themeColor) {
  let m = document.querySelector('meta[name="theme-color"]')
  if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m) }
  m.content = cfg.meta.themeColor
}

// Inject Google Fonts for heading + body
const fonts = [...new Set([t.headingFont || 'Barlow Condensed', t.bodyFont || 'DM Sans'])]
const families = fonts.map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700&`).join('')
const link = document.createElement('link')
link.rel  = 'stylesheet'
link.href = `https://fonts.googleapis.com/css2?${families}display=swap`
document.head.appendChild(link)

export default cfg
