"""
scraper.py
----------
Uses Google News RSS feeds to find new Indian government job notifications.
Works reliably from GitHub Actions — no IP blocks, no CAPTCHAs.

Google News RSS format:
  https://news.google.com/rss/search?q=QUERY&hl=en-IN&gl=IN&ceid=IN:en

Usage:
  python scripts/scraper.py
  → writes data/scraped_raw.json
"""

import json
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote_plus, urlparse

import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; GovtJobsBot/1.0)"
}
TIMEOUT = 20
OUTPUT_PATH = Path("data/scraped_raw.json")

# ──────────────────────────────────────────────
# Search queries — one per sector/org
# Each query targets fresh notifications only
# ──────────────────────────────────────────────

QUERIES = [
    # Banking
    {"q": "IBPS recruitment notification 2026", "sector": "banking", "org": "IBPS"},
    {"q": "SBI recruitment 2026 vacancy", "sector": "banking", "org": "SBI"},
    {"q": "RBI recruitment 2026", "sector": "banking", "org": "RBI"},
    {"q": "NABARD recruitment 2026", "sector": "banking", "org": "NABARD"},
    {"q": "bank recruitment notification 2026 India", "sector": "banking", "org": "Various Banks"},

    # Central Govt
    {"q": "SSC CGL CHSL recruitment 2026 notification", "sector": "central-govt", "org": "SSC"},
    {"q": "UPSC recruitment notification 2026", "sector": "central-govt", "org": "UPSC"},
    {"q": "central government job vacancy 2026", "sector": "central-govt", "org": "Central Govt"},

    # Railways
    {"q": "RRB railway recruitment notification 2026", "sector": "railways", "org": "RRB"},
    {"q": "Indian Railways vacancy 2026", "sector": "railways", "org": "Indian Railways"},

    # State Govt
    {"q": "GPSC Gujarat recruitment 2026", "sector": "state-govt", "org": "GPSC"},
    {"q": "UPPSC recruitment notification 2026", "sector": "state-govt", "org": "UPPSC"},
    {"q": "state PSC recruitment 2026 India", "sector": "state-govt", "org": "State PSC"},
    {"q": "state government job vacancy 2026", "sector": "state-govt", "org": "State Govt"},

    # Teaching
    {"q": "KVS TGT PGT recruitment 2026", "sector": "teaching", "org": "KVS"},
    {"q": "NVS teacher recruitment 2026", "sector": "teaching", "org": "NVS"},
    {"q": "CTET teacher job vacancy 2026", "sector": "teaching", "org": "Teaching"},

    # PSU
    {"q": "ONGC BHEL NTPC recruitment 2026", "sector": "psu", "org": "PSU"},
    {"q": "PSU government job vacancy 2026 GATE", "sector": "psu", "org": "PSU"},

    # Defence
    {"q": "Indian Army Navy Air Force recruitment 2026", "sector": "defence", "org": "Defence"},
    {"q": "DRDO ISRO recruitment 2026", "sector": "defence", "org": "DRDO/ISRO"},

    # Police
    {"q": "CRPF BSF CISF constable recruitment 2026", "sector": "police", "org": "Paramilitary"},
    {"q": "police constable SI recruitment 2026 India", "sector": "police", "org": "Police"},
]

# Keywords that must appear for a result to be valid
MUST_CONTAIN = [
    "recruitment", "vacancy", "notification", "apply", "post",
    "job", "hiring", "admit card", "result", "selection"
]

# Skip these — not actual job listings
OFFICIAL_URLS = {
    "IBPS":          "https://www.ibps.in",
    "SBI":           "https://sbi.co.in/web/careers",
    "RBI":           "https://www.rbi.org.in/Scripts/Opportunities.aspx",
    "NABARD":        "https://www.nabard.org/careers.aspx",
    "SSC":           "https://ssc.nic.in",
    "UPSC":          "https://upsc.gov.in",
    "RRB":           "https://www.rrbapply.gov.in",
    "Indian Railways": "https://www.indianrailways.gov.in",
    "GPSC":          "https://gpsc.gujarat.gov.in",
    "UPPSC":         "https://uppsc.up.nic.in",
    "KVS":           "https://kvsangathan.nic.in",
    "NVS":           "https://navodaya.gov.in",
    "PSU":           "https://www.india.gov.in/topics/employment",
    "Defence":       "https://joinindianarmy.nic.in",
    "Paramilitary":  "https://crpf.gov.in",
    "Police":        "https://www.india.gov.in",
    "State PSC":     "https://www.india.gov.in",
    "State Govt":    "https://www.india.gov.in",
    "Various Banks": "https://www.ibps.in",
    "Teaching":      "https://ctet.nic.in",
    "Central Govt":  "https://ssc.nic.in",
    "DRDO/ISRO":     "https://www.drdo.gov.in/careers",
}

SKIP_WORDS = [
    "cutoff", "answer key", "syllabus", "book", "coaching",
    "mock test", "preparation", "tips", "salary after deductions",
    "rank list", "merit list"
]


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def make_slug(title: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_]+", "-", slug).strip("-")
    return slug[:80]


def today_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def fetch_rss(query: str) -> list[dict]:
    """Fetch Google News RSS for a query, return list of {title, url, published}."""
    url = f"https://news.google.com/rss/search?q={quote_plus(query)}&hl=en-IN&gl=IN&ceid=IN:en"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)
        items = []
        for item in root.findall(".//item"):
            title = item.findtext("title", "").strip()
            link  = item.findtext("link", "").strip()
            pub   = item.findtext("pubDate", "").strip()
            if title and link:
                items.append({"title": title, "url": link, "published": pub})
        return items
    except Exception as e:
        print(f"  [WARN] RSS fetch failed for '{query}': {e}")
        return []


def is_relevant(title: str) -> bool:
    t = title.lower()
    if not any(kw in t for kw in MUST_CONTAIN):
        return False
    if any(kw in t for kw in SKIP_WORDS):
        return False
    return True


def key_terms(title: str) -> set:
    """Extract meaningful words, ignoring common filler words."""
    stopwords = {'the', 'for', 'and', 'out', 'here', 'check', 'details',
                 'complete', 'all', 'how', 'apply', 'online', 'begin',
                 'begins', 'from', 'with', 'this', 'that', 'are', 'has',
                 'its', 'now', 'new', 'get', 'set', 'via', 'see', 'also'}
    words = re.findall(r'\b\w+\b', title.lower())
    return {w for w in words if len(w) >= 3 and w not in stopwords}


def similarity(title1: str, title2: str) -> float:
    t1, t2 = key_terms(title1), key_terms(title2)
    if not t1 or not t2:
        return 0.0
    return len(t1 & t2) / max(len(t1), len(t2))


def deduplicate(items: list[dict], existing: list[dict]) -> list[dict]:
    existing_ids   = {j["id"] for j in existing}
    existing_slugs = {j["slug"] for j in existing}
    existing_titles = [j["title"] for j in existing]

    seen_slugs  = set(existing_slugs)
    kept_titles = list(existing_titles)  # track titles kept in this run too
    new_items   = []

    for item in items:
        slug = make_slug(item["title"])

        # Block 1: exact slug/id
        if slug in seen_slugs or item["id"] in existing_ids:
            continue

        # Block 2: fuzzy match against ALL previously seen titles
        # (both existing jobs AND items already accepted this run)
        # Threshold 0.55 — catches "IBPS Clerk 2026" vs "IBPS Clerk Notification 2026"
        duplicate = any(
            similarity(item["title"], seen) >= 0.55
            for seen in kept_titles
        )

        if not duplicate:
            seen_slugs.add(slug)
            kept_titles.append(item["title"])
            new_items.append(item)

    return new_items


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    print("=" * 50)
    print("GovtJobsPortal Scraper (Google News RSS)")
    print("=" * 50)

    # Load existing jobs to avoid duplicates
    existing_path = Path("data/jobs.json")
    existing = json.loads(existing_path.read_text()) if existing_path.exists() else []

    prev_raw = json.loads(OUTPUT_PATH.read_text()) if OUTPUT_PATH.exists() else []

    all_scraped = []

    for query_cfg in QUERIES:
        q       = query_cfg["q"]
        sector  = query_cfg["sector"]
        org     = query_cfg["org"]

        print(f"Fetching: {q[:50]}...")
        rss_items = fetch_rss(q)

        for item in rss_items:
            title = item["title"]

            # Clean up Google News title format "Title - Source"
            if " - " in title:
                title = title.rsplit(" - ", 1)[0].strip()

            if not is_relevant(title):
                continue

            slug = make_slug(title)
            official = OFFICIAL_URLS.get(org, item["url"])
            all_scraped.append({
                "id":           slug,
                "slug":         slug,
                "title":        title,
                "organization": org,
                "shortOrg":     org.split("/")[0],
                "sector":       sector,
                "officialUrl":  official,
                "sourceUrl":    item["url"],   # Google News link (for reference)
                "status":       "active",
                "lastUpdated":  today_iso(),
                "raw":          True,
            })

        time.sleep(1)  # Be polite

    # Deduplicate
    new_items = deduplicate(all_scraped, existing + prev_raw)

    print(f"\n✅ {len(new_items)} new items (from {len(all_scraped)} found across {len(QUERIES)} queries)")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(new_items, ensure_ascii=False, indent=2))
    print(f"📝 Saved to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
