"""
scraper.py
----------
Scrapes official Indian recruitment websites for new job notifications.
Returns a list of raw scraped items (not yet AI-enhanced).

Sources covered:
  - IBPS (ibps.in)
  - SBI Careers
  - SSC (ssc.nic.in)
  - RRB (indianrailways.gov.in)
  - UPSC
  - Employment News (employmetnews.gov.in) — catches many departments

Usage:
  python scripts/scraper.py
  → writes data/scraped_raw.json
"""

import json
import re
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; GovtJobsBot/1.0; "
        "+https://www.govtjobsportal.com/bot)"
    )
}
TIMEOUT = 15
OUTPUT_PATH = Path("data/scraped_raw.json")


# ──────────────────────────────────────────────
# Helper utilities
# ──────────────────────────────────────────────

def get_soup(url: str) -> BeautifulSoup | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"  [WARN] Could not fetch {url}: {e}")
        return None


def make_slug(title: str, year: int | None = None) -> str:
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_]+", "-", slug).strip("-")
    if year:
        slug = f"{slug}-{year}"
    return slug[:80]


def make_id(slug: str) -> str:
    return slug


def today_iso() -> str:
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


# ──────────────────────────────────────────────
# Individual scrapers
# ──────────────────────────────────────────────

def scrape_ibps() -> list[dict]:
    """Scrape IBPS recruitment notifications."""
    print("Scraping IBPS...")
    items = []
    soup = get_soup("https://www.ibps.in")
    if not soup:
        return items

    # IBPS lists notifications in a "What's New" / "Recruitment" section
    for link in soup.find_all("a", href=True):
        text = link.get_text(strip=True)
        href = link["href"]
        if not text or len(text) < 10:
            continue
        if any(kw in text.lower() for kw in ["recruitment", "notification", "vacancy", "apply", "crp"]):
            full_url = urljoin("https://www.ibps.in", href) if not href.startswith("http") else href
            slug = make_slug(text, datetime.utcnow().year)
            items.append({
                "id": make_id(slug),
                "slug": slug,
                "title": text[:200],
                "organization": "Institute of Banking Personnel Selection",
                "shortOrg": "IBPS",
                "sector": "banking",
                "officialUrl": "https://www.ibps.in",
                "notificationUrl": full_url if full_url.endswith(".pdf") else None,
                "sourceUrl": full_url,
                "status": "active",
                "lastUpdated": today_iso(),
                "raw": True,
            })

    print(f"  → {len(items)} IBPS items")
    return items[:5]  # Limit to latest 5


def scrape_ssc() -> list[dict]:
    """Scrape SSC latest notifications."""
    print("Scraping SSC...")
    items = []
    soup = get_soup("https://ssc.nic.in/Portal/LatestNews")
    if not soup:
        return items

    for row in soup.find_all(["tr", "li", "div"], limit=50):
        links = row.find_all("a", href=True)
        for link in links:
            text = link.get_text(strip=True)
            href = link["href"]
            if len(text) < 15:
                continue
            if any(kw in text.lower() for kw in ["recruitment", "notification", "vacancy", "examination"]):
                full_url = urljoin("https://ssc.nic.in", href)
                slug = make_slug(text, datetime.utcnow().year)
                items.append({
                    "id": make_id(slug),
                    "slug": slug,
                    "title": text[:200],
                    "organization": "Staff Selection Commission",
                    "shortOrg": "SSC",
                    "sector": "central-govt",
                    "officialUrl": "https://ssc.nic.in",
                    "notificationUrl": full_url if ".pdf" in full_url else None,
                    "sourceUrl": full_url,
                    "status": "active",
                    "lastUpdated": today_iso(),
                    "raw": True,
                })

    print(f"  → {len(items)} SSC items")
    return items[:5]


def scrape_employment_news() -> list[dict]:
    """
    Employment News (www.employmentnews.gov.in) aggregates govt notifications
    from almost every department — very useful.
    """
    print("Scraping Employment News...")
    items = []
    soup = get_soup("https://www.employmentnews.gov.in/NewMain.aspx")
    if not soup:
        return items

    for link in soup.find_all("a", href=True):
        text = link.get_text(strip=True)
        if len(text) < 20:
            continue
        if any(kw in text.lower() for kw in ["recruitment", "vacancy", "post", "apply"]):
            href = link["href"]
            full_url = urljoin("https://www.employmentnews.gov.in", href)
            # Try to guess sector
            sector = "central-govt"
            if any(k in text.lower() for k in ["bank", "ibps", "rbi", "nabard"]):
                sector = "banking"
            elif any(k in text.lower() for k in ["railway", "rrb"]):
                sector = "railways"
            elif any(k in text.lower() for k in ["teacher", "kvs", "nvs", "school"]):
                sector = "teaching"
            elif any(k in text.lower() for k in ["army", "navy", "air force", "defence", "drdo"]):
                sector = "defence"
            elif any(k in text.lower() for k in ["police", "crpf", "bsf", "cisf"]):
                sector = "police"
            elif any(k in text.lower() for k in ["ongc", "bhel", "ntpc", "sail", "psu"]):
                sector = "psu"

            slug = make_slug(text, datetime.utcnow().year)
            items.append({
                "id": make_id(slug),
                "slug": slug,
                "title": text[:200],
                "organization": "Various",
                "shortOrg": "Govt",
                "sector": sector,
                "officialUrl": full_url,
                "sourceUrl": full_url,
                "status": "active",
                "lastUpdated": today_iso(),
                "raw": True,
            })

    print(f"  → {len(items)} Employment News items")
    return items[:10]


def scrape_upsc() -> list[dict]:
    """Scrape UPSC recruitment notifications."""
    print("Scraping UPSC...")
    items = []
    soup = get_soup("https://upsc.gov.in/recruitment-notices")
    if not soup:
        return items

    for link in soup.find_all("a", href=True):
        text = link.get_text(strip=True)
        href = link["href"]
        if len(text) < 15:
            continue
        full_url = urljoin("https://upsc.gov.in", href)
        slug = make_slug(text, datetime.utcnow().year)
        items.append({
            "id": make_id(slug),
            "slug": slug,
            "title": text[:200],
            "organization": "Union Public Service Commission",
            "shortOrg": "UPSC",
            "sector": "central-govt",
            "officialUrl": "https://upsc.gov.in",
            "notificationUrl": full_url if ".pdf" in full_url else None,
            "sourceUrl": full_url,
            "status": "active",
            "lastUpdated": today_iso(),
            "raw": True,
        })

    print(f"  → {len(items)} UPSC items")
    return items[:5]


# ──────────────────────────────────────────────
# Deduplication
# ──────────────────────────────────────────────

def deduplicate(items: list[dict], existing: list[dict]) -> list[dict]:
    """Filter out items that already exist in jobs.json."""
    existing_ids = {j["id"] for j in existing}
    existing_titles = {j["title"].lower()[:50] for j in existing}

    # Extract key terms from existing titles for fuzzy matching
    # e.g. "ibps", "po", "2026" from "IBPS PO 2026"
    def key_terms(title: str) -> set:
        words = re.findall(r'\b\w+\b', title.lower())
        return {w for w in words if len(w) >= 3}

    existing_term_sets = [key_terms(j["title"]) for j in existing]

    new_items = []
    for item in items:
        # Block 1: exact ID match
        if item["id"] in existing_ids:
            continue
        # Block 2: exact title prefix match
        if item["title"].lower()[:50] in existing_titles:
            continue
        # Block 3: fuzzy — if 80%+ of key terms overlap with any existing title
        item_terms = key_terms(item["title"])
        if item_terms:
            for ex_terms in existing_term_sets:
                if not ex_terms:
                    continue
                overlap = len(item_terms & ex_terms) / max(len(item_terms), len(ex_terms))
                if overlap >= 0.8:
                    break
            else:
                new_items.append(item)
                continue
            continue  # duplicate found via fuzzy match
        new_items.append(item)

    return new_items


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    print("=" * 50)
    print("GovtJobsPortal Scraper")
    print("=" * 50)

    # Load existing jobs to avoid duplicates
    existing_path = Path("data/jobs.json")
    existing = json.loads(existing_path.read_text()) if existing_path.exists() else []

    # Load previously scraped raw items too
    prev_raw = json.loads(OUTPUT_PATH.read_text()) if OUTPUT_PATH.exists() else []

    all_scraped = []

    scrapers = [
        scrape_ibps,
        scrape_ssc,
        scrape_upsc,
        scrape_employment_news,
    ]

    for scraper in scrapers:
        try:
            results = scraper()
            all_scraped.extend(results)
        except Exception as e:
            print(f"  [ERROR] {scraper.__name__}: {e}")
        time.sleep(2)  # Be polite to servers

    # Deduplicate against existing
    new_items = deduplicate(all_scraped, existing + prev_raw)

    print(f"\n✅ {len(new_items)} new items to process (from {len(all_scraped)} scraped)")

    # Save raw scraped items
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(new_items, ensure_ascii=False, indent=2))
    print(f"📝 Saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
