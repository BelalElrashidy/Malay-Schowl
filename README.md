# Malay Schowl

My personal Malay study kit: three interactive study apps behind one home page.

| Page | What it is |
| --- | --- |
| [`lessons.html`](site/lessons.html) | **Jalan ke Fasih**: 23 lessons in 4 stages (sounds → sentences → word-building → sounding natural), each with a quiz |
| [`phrases.html`](site/phrases.html) | **Frasa Harian**: 190 everyday phrases for 19 real situations in Malaysia |
| [`vocabulary.html`](site/vocabulary.html) | **Kata Asas**: 333 core words as picture flashcards with example sentences |

Every page has text-to-speech audio (it uses a Malay voice when your device has one), a quiz mode, and saves your progress in the browser.

**Flashcard keys:** `←` `→` move · `L` listen · `T` quiz mode · `Enter` reveal

## Run it

### Anywhere: GitHub Pages
Every push to `main` publishes `site/` to GitHub Pages:
`https://<your-username>.github.io/Malay-Schowl/`

One-time setup: **Settings → Pages → Source: GitHub Actions**.

### Locally with Docker (always on)
```bash
docker compose up -d --build
```
Open <http://localhost:8080>. The container restarts automatically with Docker, so it stays available.

Friendly URLs work too: `/lessons`, `/phrases`, `/vocabulary`.

Stop it with `docker compose down`.

### Prebuilt image from GHCR
Each push to `main` also publishes a multi-arch image (amd64 + arm64):
```bash
docker run -d --name malay-schowl -p 8080:80 --restart unless-stopped ghcr.io/<your-username>/malay-schowl:latest
```

### No Docker
Open `site/index.html` directly in a browser, or run `python3 -m http.server -d site 8080`.

## Layout
```
site/                 the website (plain HTML, no build step)
  index.html          home page linking the three apps
  lessons.html        course
  phrases.html        phrase flashcards
  vocabulary.html     vocabulary flashcards
Dockerfile            nginx image serving site/
nginx.conf            caching, friendly URLs, /healthz
docker-compose.yml    local always-on container on :8080
.github/workflows/    Pages deploy + GHCR image publish
```

## Notes
- Progress is stored per browser and per address, so `localhost:8080` and the GitHub Pages site keep separate progress.
- Fonts load from Google Fonts. Offline, the pages fall back to system fonts and still work.
