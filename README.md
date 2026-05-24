# Rohit Lal - Portfolio

Personal portfolio at **[rohitlal.com](https://rohitlal.com/)**.

Jekyll site driven by a single layout, [`_layouts/portfolio.html`](_layouts/portfolio.html). All content lives in YAML under [`_data/`](_data/) - no code changes needed for content updates. Each YAML file has inline comments explaining its fields.

---

## TODO

- [ ] **Travel map hover photos.** [`_data/travel.yml`](_data/travel.yml) currently uses Wikipedia placeholder images for ~12 cities and parks. Replace each with a personal photo: drop a JPG/WebP into [`img/photos/`](img/photos/), point `image:` at the local path, set `image_credit: Rohit Lal`, and remove `image_credit_url:`. Tooltip is fixed at 320 x ~340 px with `object-fit: cover`, so any aspect ratio works.
- [ ] **Clean up the dead-block publications.** [`_data/publications.yml`](_data/publications.yml) has commented-out entries from earlier template versions. Either re-enable or delete them.
- [ ] **Delete legacy template assets** under [`vendor/`](vendor/), [`css/`](css/), [`scss/`](scss/), [`js/`](js/), [`mail/`](mail/), [`_includes/scripts.html`](_includes/scripts.html). These are Bootstrap "Freelancer" leftovers from the original template and aren't referenced by [`_layouts/portfolio.html`](_layouts/portfolio.html).

---

## Run locally

```bash
brew install ruby                       # macOS - skip if already installed
gem install bundler
bundle install
bundle exec jekyll serve                # http://localhost:4000/
# bundle exec jekyll serve --port 4002  # if 4000 is busy
```

Windows: install [Ruby+Devkit](https://rubyinstaller.org/) first, then the same `bundle` commands.

If `bundle install` complains about platform, run `bundle lock --add-platform arm64-darwin` (or your platform) and retry.

---

## Edit content

All content is in [`_data/*.yml`](_data/). Jekyll rebuilds automatically while `jekyll serve` is running. Open each file - the comments at the top of each describe the schema.

| File | What it drives |
|---|---|
| [`aboutme.yml`](_data/aboutme.yml) | Hero: name, photo, bio, social links, stats |
| [`news.yml`](_data/news.yml) | News & Updates feed |
| [`publications.yml`](_data/publications.yml) | Publications list (papers, patents, abstracts) |
| [`patents.yml`](_data/patents.yml) | Patents (referenced from publications) |
| [`experience.yml`](_data/experience.yml) | Experience timeline |
| [`projects.yml`](_data/projects.yml) | Projects carousel |
| [`skills.yml`](_data/skills.yml) | Categorized skill pills |
| [`achievements.yml`](_data/achievements.yml) | Awards & recognition carousel |
| [`travel.yml`](_data/travel.yml) | US travel map (cities + parks) |
| [`courses.yml`](_data/courses.yml) | Courses (currently unused on page) |

Writing rules (also in [`CLAUDE.md`](CLAUDE.md)):

- **No em dashes** anywhere. Use ` - ` (ASCII hyphen with spaces).
- **`travel.yml` descriptions are capped at 8 words** and must be specific. No `year:` field.

---

## Deploy

Production deploys to **[rohitlal.com](https://rohitlal.com/)** via [`.github/workflows/jekyll.yml`](.github/workflows/jekyll.yml) on every push to `main`.

Preview/staging lives in the separate [`take2rohit/portfolio-preview`](https://github.com/take2rohit/portfolio-preview) repo and deploys to [rohitlal.com/portfolio-preview/](https://rohitlal.com/portfolio-preview/). Use it to QA before merging to `main`.

---

License: MIT (see [`LICENSE`](LICENSE)).
