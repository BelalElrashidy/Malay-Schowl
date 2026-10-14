#!/usr/bin/env bash
# Malay Schowl: pull and deploy. Installed on the server as
# /usr/local/bin/malay-schowl-deploy and run by GitHub Actions over SSH as `deploy`
# (forced command in ~deploy/.ssh/authorized_keys), or by hand.
set -euo pipefail

if [ "$(id -u)" = 0 ]; then
  echo "==> running as root; re-executing as 'deploy'"
  exec sudo -u deploy -H "$0" "$@"
fi

REPO=https://github.com/BelalElrashidy/Malay-Schowl.git
APP=/srv/malay-schowl/app
PORT=3900

if [ ! -d "$APP/.git" ]; then
  echo "==> first deploy: cloning $REPO"
  git clone --quiet "$REPO" "$APP"
fi
cd "$APP"

echo "==> fetch + reset to origin/main"
git fetch --quiet --prune origin
git reset --quiet --hard origin/main
echo "    now at $(git log -1 --format='%h %s')"

echo "==> docker compose up"
APP_PORT=$PORT docker compose -f compose.prod.yml up -d --build --remove-orphans
docker image prune -f >/dev/null

echo "==> health check"
for i in $(seq 1 15); do
  if curl -fs "http://127.0.0.1:$PORT/healthz" >/dev/null; then
    echo "==> deployed OK ($(git log -1 --format=%h))"
    exit 0
  fi
  sleep 2
done
docker logs --tail 50 malay-schowl
echo "ERROR: health check failed"
exit 1
