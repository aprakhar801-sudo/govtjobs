# GovtJobsPortal – Setup Guide

## Tech Stack
- **Next.js 14** (static export) → deployed to GitHub Pages
- **Tailwind CSS** for styling
- **Python + BeautifulSoup** for scraping official recruitment sites
- **Claude API (Haiku)** for AI content generation
- **GitHub Actions** for automated daily content + deployment

---

## 1. First-Time Setup

```bash
# Install Node dependencies
npm install

# Test local dev server
npm run dev
# → Open http://localhost:3000
```

---

## 2. GitHub Repository Setup

1. Create a new GitHub repo (e.g. `govtjobsportal`)
2. Push this folder to that repo
3. Go to **Settings → Pages → Source** → select **GitHub Actions**

---

## 3. Set GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `ANTHROPIC_API_KEY` | Your Claude API key from console.anthropic.com |

That's all you need. The `GITHUB_TOKEN` is auto-provided.

---

## 4. How the Automation Works

```
GitHub Actions runs 3x daily (7am, 1pm, 7pm IST):
  ↓
scraper.py      → scrapes official sites → data/scraped_raw.json
  ↓
generate_content.py → Claude API → adds to data/jobs.json
  ↓
deploy.yml      → npm build → pushes to GitHub Pages
  ↓
Site is live with fresh content!
```

### Trigger manually
Go to **Actions → 🤖 Auto Content Generator → Run workflow**

---

## 5. Custom Domain Setup

1. Buy domain (e.g. govtjobsportal.com) from any registrar
2. Add a CNAME file in `public/` with your domain:
   ```
   govtjobsportal.com
   ```
3. In GitHub → Settings → Pages → Custom domain → enter your domain
4. In your DNS: add `CNAME` record pointing to `yourusername.github.io`
5. Update `BASE_URL` in `scripts/generate-sitemap.js`
6. Update `metadataBase` in `src/app/layout.tsx`

---

## 6. Adding Jobs Manually

Edit `data/jobs.json` and add a new job object following the schema in `src/lib/types.ts`.

Required fields: `id`, `slug`, `title`, `organization`, `shortOrg`, `sector`, `totalVacancies`, `qualifications`, `ageMin`, `ageMax`, `applicationStart`, `applicationEnd`, `officialUrl`, `status`, `lastUpdated`, `summary`, `highlights`, `eligibility`, `howToApply`, `selectionProcess`, `faqs`, `importantDates`, `tags`, `metaDescription`

---

## 7. Adding New Scrapers

Edit `scripts/scraper.py` — add a new function like `scrape_yoursite()` and call it in `main()`.

---

## 8. Content Tips for SEO

Each job page automatically gets:
- **JobPosting** schema.org structured data (helps Google Jobs)
- **FAQPage** schema (shows FAQs directly in Google search)
- Dynamic `<title>` and meta description
- Breadcrumbs

Target keywords: `[exam name] [year] notification`, `[exam] eligibility`, `[exam] last date`, `[exam] salary`, `can [X] apply for [exam]`.

---

## 9. Monetization Options

1. **Google AdSense** — add AdSense script in `src/app/layout.tsx`
2. **Coaching institute affiliate links** — add banners in sector pages
3. **Push notification service** (OneSignal) — add to layout for subscriber alerts
4. **Email newsletter** — add a form, use Mailchimp or Resend

---

## Folder Structure

```
├── .github/workflows/
│   ├── content-generator.yml   ← scrape + AI generate (runs 3x/day)
│   └── deploy.yml              ← build + deploy to GitHub Pages
├── data/
│   └── jobs.json               ← ALL job data (auto-updated by GitHub Actions)
├── scripts/
│   ├── scraper.py              ← scrapes official recruitment sites
│   ├── generate_content.py     ← Claude API content generator
│   ├── generate-sitemap.js     ← sitemap + robots.txt generator
│   └── requirements.txt        ← Python dependencies
├── src/
│   ├── app/                    ← Next.js pages
│   │   ├── page.tsx            ← Home
│   │   ├── banking/page.tsx
│   │   ├── central-govt/page.tsx
│   │   ├── railways/page.tsx
│   │   ├── state-govt/page.tsx
│   │   ├── state-govt/[state]/page.tsx
│   │   ├── teaching/page.tsx
│   │   ├── psu/page.tsx
│   │   ├── defence/page.tsx
│   │   ├── police/page.tsx
│   │   ├── jobs/page.tsx       ← All jobs listing
│   │   ├── jobs/[slug]/page.tsx ← Individual job detail + SEO
│   │   ├── results/page.tsx
│   │   └── admit-cards/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── SectorPage.tsx
│   └── lib/
│       ├── types.ts            ← TypeScript types & sector config
│       └── jobs.ts             ← Data access functions
```
