#!/usr/bin/env python3
"""Refresh the Google Scholar stats in _data/aboutme.yml.

Fetches the citation count and h-index from the SerpApi Google Scholar Author
API, rounds citations down to the nearest 50 (rendered as "NNN+"), and writes
both numbers back into the Stats block of _data/aboutme.yml.

The Scholar author id is read from the Scholar URL already in aboutme.yml, so
there is a single source of truth. The SerpApi key is read from the SERPAPI_KEY
environment variable (set as a repository secret in CI).

Run:  SERPAPI_KEY=... python scripts/update_citations.py
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request

# Repo root is the parent of this script's directory, so the tool works no
# matter what the current working directory is when it runs.
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ABOUTME = os.path.join(REPO_ROOT, "_data", "aboutme.yml")

CITATION_BUCKET = 50  # citations are rounded down to a multiple of this


def log(msg):
    print(msg, flush=True)


def fail(msg):
    log("ERROR: " + msg)
    sys.exit(1)


def coerce_int(value):
    """Turn a SerpApi count into an int, tolerating strings like '1,234'."""
    return int(str(value).replace(",", "").strip())


def read_author_id(text):
    """Pull the Scholar author id out of the Scholar: URL in aboutme.yml."""
    m = re.search(r"Scholar\s*:\s*\S*[?&]user=([A-Za-z0-9_-]+)", text)
    if not m:
        fail("could not find a Scholar user id in " + ABOUTME)
    return m.group(1)


def fetch_stats(author_id, api_key):
    """Return (citations_all, h_index_all) from the SerpApi author API."""
    params = {
        "engine": "google_scholar_author",
        "author_id": author_id,
        "api_key": api_key,
        "hl": "en",
    }
    url = "https://serpapi.com/search.json?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "take2rohit-site-bot"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:  # network error, timeout, bad JSON
        fail("SerpApi request failed: %r" % exc)

    if data.get("error"):
        fail("SerpApi returned an error: %s" % data["error"])

    table = data.get("cited_by", {}).get("table")
    if not isinstance(table, list):
        fail("unexpected SerpApi response: no cited_by.table")

    # The isinstance guards keep a shape change (a scalar where a dict is
    # expected) on the graceful fail() path rather than a raw traceback.
    citations = h_index = None
    for row in table:
        if isinstance(row, dict) and isinstance(row.get("citations"), dict):
            citations = row["citations"].get("all")
        if isinstance(row, dict) and isinstance(row.get("h_index"), dict):
            h_index = row["h_index"].get("all")

    if citations is None or h_index is None:
        fail("could not read citations/h_index from SerpApi response")

    try:
        return coerce_int(citations), coerce_int(h_index)
    except (ValueError, TypeError) as exc:
        fail("SerpApi returned non-numeric citation values: %r" % exc)


def set_stat(text, label, new_value):
    """Replace the number: value on the line just above `label: <label>`.

    Only the entry whose label matches is touched, so Citations, h-index and
    Top Venues never bleed into each other. Returns (new_text, old_value).
    """
    pattern = re.compile(
        r"(-\s*number:\s*)([^\n]*)(\n\s*label:\s*" + re.escape(label) + r"\b)"
    )
    m = pattern.search(text)
    if not m:
        fail("could not find a Stats entry labelled '%s' in %s" % (label, ABOUTME))
    old_value = m.group(2).strip()
    replacement = m.group(1) + "'" + new_value + "'" + m.group(3)
    return text[: m.start()] + replacement + text[m.end():], old_value


def emit_output(changed, summary):
    """Expose results to the GitHub Actions job via $GITHUB_OUTPUT."""
    out = os.environ.get("GITHUB_OUTPUT")
    if not out:
        return
    with open(out, "a", encoding="utf-8") as f:
        f.write("changed=%s\n" % ("true" if changed else "false"))
        f.write("summary=%s\n" % summary)


def main():
    api_key = os.environ.get("SERPAPI_KEY")
    if not api_key:
        fail("SERPAPI_KEY is not set (add it as a repository secret)")

    with open(ABOUTME, encoding="utf-8") as f:
        text = f.read()

    author_id = read_author_id(text)
    citations, h_index = fetch_stats(author_id, api_key)
    log("Fetched from Scholar (%s): citations=%d h-index=%d"
        % (author_id, citations, h_index))

    citations_str = "%d+" % ((citations // CITATION_BUCKET) * CITATION_BUCKET)
    h_index_str = "%d" % h_index

    text, old_citations = set_stat(text, "Citations", citations_str)
    text, old_h_index = set_stat(text, "h-index", h_index_str)

    changes = []
    if old_citations != "'%s'" % citations_str:
        changes.append("Citations %s -> '%s'" % (old_citations, citations_str))
    if old_h_index != "'%s'" % h_index_str:
        changes.append("h-index %s -> '%s'" % (old_h_index, h_index_str))

    if not changes:
        log("No change: Citations already '%s', h-index already '%s'."
            % (citations_str, h_index_str))
        emit_output(False, "no change")
        return

    with open(ABOUTME, "w", encoding="utf-8") as f:
        f.write(text)

    summary = "; ".join(changes)
    log("Updated: " + summary)
    emit_output(True, summary)


if __name__ == "__main__":
    main()
