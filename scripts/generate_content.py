"""
generate_content.py
-------------------
Takes raw scraped job items and uses Claude API to:
1. Extract structured data (vacancies, dates, eligibility, salary)
2. Generate AI content (summary, highlights, FAQs, how-to-apply, meta description)
3. Write the complete job objects to data/jobs.json

Usage:
  ANTHROPIC_API_KEY=sk-... python scripts/generate_content.py

Environment variables:
  ANTHROPIC_API_KEY   — required
  MAX_TO_PROCESS      — max jobs to process per run (default: 10)
"""

import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────

RAW_PATH      = Path("data/scraped_raw.json")
JOBS_PATH     = Path("data/jobs.json")
MODEL         = "gemini-2.0-flash"   # Free tier: 1,500 requests/day
MAX_TO_PROCESS = int(os.getenv("MAX_TO_PROCESS", "10"))

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


# ──────────────────────────────────────────────
# Prompt
# ──────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert at Indian government job recruitment.
You extract structured information from job notification titles and URLs,
and generate helpful, accurate content for job seekers.

Always respond with valid JSON only. No markdown, no explanation outside the JSON."""


def build_user_prompt(raw_item: dict) -> str:
    return f"""
A new Indian government job notification was found. Here is the raw data:

Title: {raw_item.get('title', '')}
Organization: {raw_item.get('organization', '')}
Sector: {raw_item.get('sector', '')}
Source URL: {raw_item.get('sourceUrl', '')}
Notification URL: {raw_item.get('notificationUrl', '')}

Today's date: {datetime.utcnow().strftime('%Y-%m-%d')}

Generate a complete job listing object. Return ONLY a JSON object with these exact fields:

{{
  "id": "unique-slug-2026",
  "slug": "unique-slug-2026",
  "title": "Official job title (concise, e.g. 'IBPS PO 2026')",
  "organization": "Full organization name",
  "shortOrg": "Short abbreviation (e.g. IBPS, SSC, RRB)",
  "sector": "{raw_item.get('sector', 'central-govt')}",
  "subsector": "Sub-organization if applicable",
  "state": "State name only if state-govt sector",
  "totalVacancies": 0,
  "qualifications": ["Graduate (Any Stream)"],
  "ageMin": 18,
  "ageMax": 35,
  "salaryLabel": "Salary range string or 'As per 7th CPC'",
  "salaryMin": null,
  "salaryMax": null,
  "applicationStart": "YYYY-MM-DD or null",
  "applicationEnd": "YYYY-MM-DD or null",
  "examDate": "YYYY-MM-DD or null",
  "officialUrl": "{raw_item.get('officialUrl', '')}",
  "notificationUrl": "{raw_item.get('notificationUrl', '') or ''}",
  "status": "active",
  "lastUpdated": "{datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')}",
  "summary": "2-3 sentence plain English summary of what this notification is about and who should apply.",
  "highlights": [
    "Key point 1 (vacancies, salary, or eligibility)",
    "Key point 2",
    "Key point 3",
    "Key point 4"
  ],
  "eligibility": "Detailed eligibility paragraph covering education, age, nationality, and other requirements.",
  "howToApply": "1. Step one\\n2. Step two\\n3. Step three\\n4. Step four\\n5. Step five",
  "selectionProcess": ["Stage 1", "Stage 2", "Stage 3"],
  "faqs": [
    {{"question": "Common question 1 about this job?", "answer": "Clear, specific answer."}},
    {{"question": "Common question 2 about eligibility or exam?", "answer": "Clear answer."}},
    {{"question": "Common question 3 about salary or joining?", "answer": "Clear answer."}}
  ],
  "importantDates": [
    {{"label": "Notification Released", "date": "YYYY-MM-DD"}},
    {{"label": "Application End", "date": "YYYY-MM-DD"}}
  ],
  "tags": ["Sector tag", "Organization", "Post type", "Qualification required"],
  "metaDescription": "SEO meta description ~150 chars: mention vacancies, organization, deadline, key eligibility."
}}

Rules:
- If you don't know a numeric field, use 0 or null.
- Dates must be YYYY-MM-DD format or null.
- Generate realistic, helpful content based on the title and organization — make reasonable assumptions based on similar past notifications.
- The summary, eligibility, howToApply and FAQs must be genuinely useful to job seekers.
- Tags should be 4-6 relevant strings.
- metaDescription must be under 160 characters.
"""


# ──────────────────────────────────────────────
# Processing
# ──────────────────────────────────────────────

def process_item(raw_item: dict) -> dict | None:
    """Call Gemini API to generate a complete job object from a raw scraped item."""
    try:
        prompt = SYSTEM_PROMPT + "\n\n" + build_user_prompt(raw_item)
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )
        content = response.text.strip()

        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip().rstrip("```").strip()

        job = json.loads(content)
        print(f"  ✓ Generated: {job.get('title', 'Unknown')}")
        return job

    except json.JSONDecodeError as e:
        print(f"  ✗ JSON parse error for '{raw_item.get('title')}': {e}")
        return None
    except Exception as e:
        print(f"  ✗ API error for '{raw_item.get('title')}': {e}")
        return None


def main():
    print("=" * 50)
    print("GovtJobsPortal Content Generator")
    print("=" * 50)

    if not os.getenv("GEMINI_API_KEY"):
        print("ERROR: GEMINI_API_KEY environment variable not set.")
        print("Get a free key at: https://aistudio.google.com/apikey")
        sys.exit(1)

    # Load raw scraped items
    if not RAW_PATH.exists():
        print(f"No raw items found at {RAW_PATH}. Run scraper.py first.")
        sys.exit(0)

    raw_items = json.loads(RAW_PATH.read_text())
    if not raw_items:
        print("No new raw items to process.")
        sys.exit(0)

    # Load existing jobs
    existing_jobs = json.loads(JOBS_PATH.read_text()) if JOBS_PATH.exists() else []
    existing_ids = {j["id"] for j in existing_jobs}

    # Filter to truly new items
    to_process = [r for r in raw_items if r.get("id") not in existing_ids]
    to_process = to_process[:MAX_TO_PROCESS]

    if not to_process:
        print("All items already in jobs.json. Nothing to process.")
        sys.exit(0)

    print(f"Processing {len(to_process)} new items...\n")

    new_jobs = []
    for i, item in enumerate(to_process, 1):
        print(f"[{i}/{len(to_process)}] {item.get('title', '')[:70]}...")
        job = process_item(item)
        if job:
            # Ensure it's not already in existing by id
            if job.get("id") not in existing_ids:
                new_jobs.append(job)
                existing_ids.add(job["id"])
        time.sleep(1)  # Rate limit protection

    if new_jobs:
        # Merge with existing (new jobs first for freshness)
        all_jobs = new_jobs + existing_jobs
        JOBS_PATH.write_text(json.dumps(all_jobs, ensure_ascii=False, indent=2))
        print(f"\n✅ Added {len(new_jobs)} new jobs. Total: {len(all_jobs)}")
    else:
        print("\n⚠️  No new jobs were successfully generated.")

    # Clear raw file after processing
    RAW_PATH.write_text("[]")
    print("🧹 Cleared raw queue.")


if __name__ == "__main__":
    main()
