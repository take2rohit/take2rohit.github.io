# Rohit Lal - AI Researcher Portfolio

Personal portfolio at **[rohitlal.com](https://rohitlal.com/)**, built with [Jekyll](https://jekyllrb.com/) and a single-page React layout. All content is editable through YAML files under `_data/`. No coding required.

**Preview of the redesign:** https://rohitlal.com/portfolio-preview/ (this is the staging copy in [`take2rohit/portfolio-preview`](https://github.com/take2rohit/portfolio-preview); the production site at `rohitlal.com/` is unchanged).

---

## Architecture

The site is a single page driven by one Jekyll layout (`_layouts/portfolio.html`). That layout:

1. Reads every `_data/*.yml` file via Liquid's `| jsonify` filter and emits each one as a `<script type="application/json">` block.
2. Boots a React app (via the React + Babel-standalone CDN scripts) that pulls each JSON block on mount and renders the sections.

This keeps the editing experience YAML-only while still using the React component model from the original design.

### Page sections (rendered top to bottom)

| Section | Data source | Notes |
|---|---|---|
| Hero (photo, name, bio, social links) | `_data/aboutme.yml` | `Bio_Short` is the short blurb under the hero; `About` is the long version (unused for now). |
| News & Updates | `_data/news.yml` | Markdown links (`[text](url)` and `[[text]](url)`) are auto-rendered. |
| Publications | `_data/publications.yml` (+ `_data/patents.yml`) | Optional `image:` (180×180) and `abstract:` per paper. |
| Experience timeline | `_data/experience.yml` | |
| Projects carousel | `_data/projects.yml` | Auto-scrolls horizontally; pauses on hover. |
| Technical Skills | `_data/skills.yml` | Categorized pills (see schema below). |
| Awards & Achievements | `_data/achievements.yml` | Netflix-style auto-cycling carousel. |
| Travel Chronicles | `_data/travel.yml` | D3 + topojson Albers-USA map with hover tooltips. |
| Contact | static | Form opens a `mailto:` to your email. |

---

## Local development

```bash
# 1. Install Ruby + bundler (macOS)
brew install ruby
gem install bundler

# 2. Install gem dependencies
bundle install

# 3. Serve locally on http://localhost:4000/
bundle exec jekyll serve
# (use --port 4002 if port 4000 is busy)
```

For Windows, install [Ruby+Devkit](https://rubyinstaller.org/) first, then run the same `bundle install` and `bundle exec jekyll serve` commands.

---

## Editing content

You only need to edit YAML files in `_data/`. The page rebuilds automatically while `jekyll serve` is running.

### `aboutme.yml`

```yaml
Name: Your Name
DP_Link: img/your-photo.jpg          # path relative to repo root
Area_Of_Expertise: Computer Vision | Generative AI | NLP
Github:    https://github.com/your_id/
LinkedIn:  https://www.linkedin.com/in/your_id/
Email:     mailto:your@email.com
Twitter:   https://twitter.com/your_id
Scholar:   https://scholar.google.com/citations?user=YOUR_ID
Bio_Short: >
  One-paragraph blurb shown under the hero name.
Stats:
  - number: '269'
    label: Citations
  - number: '8'
    label: h-index
  - number: '8'
    label: i10-index
  - number: ICML, ICCV, CVPR, WACV, IJCV
    label: Top Venues
About: >
  Longer biography, currently not displayed but kept for reference.
```

### `news.yml`

```yaml
k: 10        # how many news items to show before the "See More" scroll
news:
  - date: Apr'26
    description: >
      Markdown links work: [text](https://example.com)
      …and double-bracket links render as [<a>text</a>] with literal brackets:
      [[NASA Article]](https://example.com)
```

### `publications.yml`

```yaml
- paper: Paper Title
  author: "Author One, **Rohit Lal**, Author Three"     # markdown bold in authors is fine
  pub: "Conference Name, 2025 (Spotlight)"
  type: Conference                                       # Conference | Journal | Workshop | Preprint
  paper_link:   https://arxiv.org/abs/...                # any may be left blank
  project_page: https://...
  code_link:    https://github.com/...
  bibtex:       https://scholar.googleusercontent.com/scholar.bib?...
  video:        https://youtu.be/...
  image:        img/papers/your-teaser.png               # optional, 180x180 thumbnail
  abstract: >
    Optional one-line TL;DR shown in a tinted box.
```

### `experience.yml`

```yaml
- company: Company Name
  url: https://company.example/
  title: Your Role
  date: Jan 2024 - Present
  location: City, Country
  description: >
    Markdown links work in the description too: [Lab Page](https://...).
```

### `projects.yml`

```yaml
- image: img/portfolio/your-project.webp
  title: Project Title
  abstract: >
    One- or two-line description.
  paper:  https://...     # optional
  video:  https://...     # optional
  github: https://...     # optional
  tags: [Computer Vision, Robotics]   # optional, drives the filter pills
```

### `skills.yml` (categorized for the new design)

```yaml
categories:
  - title: ML & AI Frameworks
    color: '#0d9488'
    skills: [Python, PyTorch, TensorFlow, HuggingFace, OpenCV, scikit-learn, Pandas]
  - title: Distributed Training
    color: '#8b5cf6'
    skills: [FSDP, DDP, ZeRO, LoRA, RLHF, FlashAttention, Megatron-LM]
  - title: HPC & Infrastructure
    color: '#f59e0b'
    skills: [SLURM, PBS, NASA ASC, Nvidia DGX, AWS, Docker]
  - title: Development Tools
    color: '#3b82f6'
    skills: [Git, Wandb, Matplotlib, Jupyter, VS Code, Linux, LaTeX]
```

Each category's `color` controls the pill border + hover-fill colors.

### `achievements.yml` (Awards carousel)

```yaml
- title: NASA Group Achievement Award
  description: One-line citation.
  date: January 2026
  icon: 🏆                                # any emoji
  image: img/portfolio/your-award.webp
```

### `travel.yml` (D3 US map)

```yaml
cities:
  - name: Huntsville
    lat: 34.7304
    lng: -86.5861
    description: NASA IMPACT - Research Scientist   # 8 words max, see rules
    image: img/photos/huntsville.jpg                # local path OR full URL
    image_credit: Rohit Lal                         # shown as 'Photo: <credit>' in tooltip
    image_credit_url: https://...                   # optional - wraps the credit text in a link
    type: city                                      # 'city' (concentric circles) or 'park' (triangle)
    home: true                                      # OPTIONAL - red marker + pulse + bold red label
    textAnchor: end                                 # 'start' | 'middle' | 'end' label alignment
    offsetX: -15
    offsetY: 5
```

**Writing rules** (also codified in `CLAUDE.md`):

* **No `year:` field.** The tooltip does not render it; do not reintroduce
  the field without updating the schema.
* **`description:` is hard-capped at 8 words.** Punchy and specific beats
  generic; e.g. "Misty blue ridges and 1,500 black bears" instead of
  "Beautiful national park with great views".

> **TODO**: replace the Wikipedia placeholder images with Rohit's own photos.
> Every entry in `travel.yml` currently has an `image:` pointing at a 500px
> Wikimedia-Commons thumbnail (CC-BY-SA or public domain) with `image_credit:
> Wikipedia` and `image_credit_url:` set to the relevant Wikipedia article.
> When swapping in personal photos: drop a JPG/WebP into `img/photos/`, point
> `image:` at the local path, and update `image_credit:` (e.g. to "Rohit Lal")
> and `image_credit_url:` (optional, can be removed). The tooltip is fixed at
> the centre of the map container at 320 x ~340 px - images are cropped via
> `object-fit: cover` so any aspect ratio works.

### `patents.yml`

```yaml
- patent: Patent Title
  author: Author Names
  issued: Dec 1, 2019
  number: 201921049473
  file:  https://drive.google.com/...    # optional
  video: https://youtu.be/...            # optional
```

### `courses.yml`

```yaml
- title: Course Title
  certificate: https://...               # optional
  source: Coursera
  source_url: https://www.coursera.org
  instructor: Instructor Name            # optional
  instructor_url: https://...            # optional
```

---

## Theme & design notes

* **Palette:** cream background (`#faf8f5`) with deep-navy accent (`#1e3a5f`), defined as CSS variables at the top of `_layouts/portfolio.html`. Edit those to retheme globally.
* **Typography:** Libre Baskerville (display) + Source Sans 3 (body), loaded from Google Fonts.
* **Animations:** scroll-triggered fade-in for each section via IntersectionObserver. Section titles get a `//` prefix and a small geometric shape on the right (different shape per section).
* **No dark mode.** Light theme only by design.
* **D3 + topojson** are loaded from CDNs at runtime; the US states GeoJSON is fetched from `cdn.jsdelivr.net/npm/us-atlas@3`. If you're offline, the travel map shows a "Loading map…" placeholder.

---

## Deploying

Production (`master` branch of this repo, `take2rohit/take2rohit.github.io`) deploys to **https://rohitlal.com/** via `.github/workflows/jekyll.yml`. Any push to `master` triggers a rebuild.

Preview/staging (`take2rohit/portfolio-preview` repo) deploys to **https://rohitlal.com/portfolio-preview/** via the same workflow. Use this branch to QA changes before merging into `master`.

---

## Troubleshooting

* **`bundle install` fails with platform errors** → run `bundle lock --add-platform arm64-darwin` (or your platform) before re-running.
* **`logger`/`csv`/`base64` not found on Ruby ≥ 4.0** → these are now explicit dependencies in the `Gemfile`; if you removed them, add them back.
* **Port 4000 already in use** → `bundle exec jekyll serve --port 4002`.
* **DO NOT** rename folders. Jekyll relies on `_data/`, `_layouts/`, `_includes/`, `_config.yml` being where they are.

---

## Credits

Design iterated in [Claude Design](https://claude.ai/design); ported to Jekyll + React with [Claude Code](https://claude.com/claude-code). Original template inspiration from the Start Bootstrap "Freelancer" theme (now removed from the home page but legacy assets remain under `vendor/` and `scss/`).

License: MIT (see `LICENSE`).
