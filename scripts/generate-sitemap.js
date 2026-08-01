/**
 * generate-sitemap.js
 * Generates /out/sitemap.xml and /out/robots.txt after the Next.js build.
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs')
const path = require('path')

const BASE_URL = 'https://www.govtjobsportal.com'
const OUT_DIR  = path.join(__dirname, '..', 'out')
const JOBS_PATH = path.join(__dirname, '..', 'data', 'jobs.json')

const jobs = JSON.parse(fs.readFileSync(JOBS_PATH, 'utf-8'))

const SECTORS = [
  'banking', 'central-govt', 'railways', 'state-govt',
  'teaching', 'psu', 'defence', 'police',
]

const STATES = [
  'gujarat', 'uttar-pradesh', 'maharashtra', 'rajasthan', 'bihar',
  'madhya-pradesh', 'karnataka', 'tamil-nadu', 'andhra-pradesh',
  'telangana', 'kerala', 'west-bengal', 'punjab', 'haryana', 'delhi',
]

function url(path, priority = '0.7', changefreq = 'daily') {
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`
}

const urls = [
  url('/', '1.0', 'hourly'),
  url('/jobs/', '0.9', 'hourly'),
  url('/results/', '0.8', 'daily'),
  url('/admit-cards/', '0.8', 'daily'),
  ...SECTORS.map((s) => url(`/${s}/`, '0.9', 'daily')),
  ...STATES.map((s) => url(`/state-govt/${s}/`, '0.7', 'daily')),
  ...jobs.map((j) => url(`/jobs/${j.slug}/`, '0.8', 'weekly')),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap)
fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots)

console.log(`✅ sitemap.xml generated with ${urls.length} URLs`)
console.log(`✅ robots.txt generated`)
