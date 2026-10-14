# Malay Schowl

My personal Malay study kit: three interactive study apps behind one home page.

| Page | What it is |
| --- | --- |
| [`lessons.html`](site/lessons.html) | **Jalan ke Fasih**: 23 lessons in 4 stages (sounds → sentences → word-building → sounding natural), each with a quiz |
| [`phrases.html`](site/phrases.html) | **Frasa Harian**: 190 everyday phrases for 19 real situations in Malaysia |
| [`vocabulary.html`](site/vocabulary.html) | **Kata Asas**: 333 core words as picture flashcards with example sentences |

Every page has a light/dark theme switch, text-to-speech audio (it uses a Malay voice when your device has one), a quiz mode, and saves your progress in the browser.

**Flashcard keys:** `←` `→` move · `L` listen · `T` quiz mode · `Enter` reveal

## Where it lives

| | URL |
| --- | --- |
| Schowl server | <https://malay.schowl.com> |
| GitHub Pages | <https://belalelrashidy.github.io/Malay-Schowl/> |
| Docker image | `ghcr.io/belalelrashidy/malay-schowl:latest` |

Every push to `main` runs the [CI/CD pipeline](.github/workflows/ci-cd.yml): it builds and tests the container, then publishes GitHub Pages, publishes the Docker image, and deploys to the Schowl server. Details are in [DEPLOY.md](DEPLOY.md).

## Run it yourself

**Docker (local, always on):**
```bash
docker compose up -d --build
```
Open <http://localhost:8080>. Friendly URLs work: `/lessons`, `/phrases`, `/vocabulary`. Stop with `docker compose down`.

**Prebuilt image (amd64 + arm64):**
```bash
docker run -d --name malay-schowl -p 8080:80 --restart unless-stopped ghcr.io/belalelrashidy/malay-schowl:latest
```

**No Docker:** open `site/index.html` in a browser, or run `python3 -m http.server -d site 8080`.

## Layout
```
site/                 the website (plain HTML, no build step)
  index.html          home page linking the three apps
  lessons.html        course
  phrases.html        phrase flashcards
  vocabulary.html     vocabulary flashcards
  theme.js            light/dark switcher shared by all pages
Dockerfile            nginx image serving site/
nginx.conf            caching, friendly URLs, /healthz
docker-compose.yml    local always-on container on :8080
compose.prod.yml      server container, bound to 127.0.0.1:3900
deploy/               server deploy script + nginx site for malay.schowl.com
.github/workflows/    CI/CD: test -> Pages + GHCR image + server deploy
```

## Notes
- Progress and theme are stored per browser and per address, so each URL above keeps its own progress.
- Fonts load from Google Fonts. Offline, the pages fall back to system fonts and still work.
