# Writing rules for this repo

## No em dashes, ever

Never use em dashes (the long dash character, U+2014) in any file in this
repo, including YAML content, HTML/Jekyll templates, commit messages, PR
descriptions, or chat responses about this project.

### What to use instead

The preferred replacement is a plain ASCII hyphen with spaces around it,
which keeps the same rhythm as the original sentence:

```
foo - bar
```

This is encouraged, not just allowed. Do not reach for semicolons or commas
just to avoid an em dash; use them only when that punctuation is the right
choice on its own merits.

Other acceptable options when they fit naturally:

- A new sentence
- Parentheses for an aside
- A colon when introducing something
- A comma when the pause is light

### Quick reference

- Em dash (forbidden): the long dash character, U+2014
- En dash (also avoid): the medium dash, U+2013; use ASCII hyphens for
  ranges like `2024-2026`
- ASCII hyphen-minus (preferred): `-`

This rule applies both to text written into files and to text generated in
chat about this project.
