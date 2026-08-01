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
from urllib.parse import quote_plus

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


def deduplicate(items: list[dict], existing: list[dict]) -> list[dict]:
    existing_ids    = {j["id"] for j in existing}
    existing_slugs  = {j["slug"] for j in existing}

    def key_terms(title: str) -> set:
        words = re.findall(r'\b\w+\b', title.lower())
        return {w for w in words if len(w) >= 3}

    existing_term_sets = [key_terms(j["title"]) for j in existing]

    seen_slugs = set(existing_slugs)
    new_items  = []

    for item in items:
        slug = make_slug(item["title"])
        if slug in seen_slugs:
            continue
        if item["id"] in existing_ids:
            continue

        # Fuzzy title match
        item_terms = key_terms(item["title"])
        duplicate  = False
        if item_terms:
            for ex_terms in existing_term_sets:
                if not ex_terms:
                    continue
                overlap = len(item_terms & ex_terms) / max(len(item_terms), len(ex_terms))
                if overlap >= 0.80:
                    duplicate = True
                    break

        if not duplicate:
            seen_slugs.add(slug)
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
            all_scraped.append({
                "id":           slug,
                "slug":         slug,
                "title":        title,
                "organization": org,
                "shortOrg":     org.split("/")[0],
                "sector":       sector,
                "officialUrl":  item["url"],
                "sourceUrl":    item["url"],
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
