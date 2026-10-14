# Deployment

```
push to main ─▶ test (build container, check every URL returns 200)
                 ├─▶ pages   ─▶ https://belalelrashidy.github.io/Malay-Schowl/
                 ├─▶ image   ─▶ ghcr.io/belalelrashidy/malay-schowl:latest
                 └─▶ deploy  ─▶ SSH to the Schowl server ─▶ https://malay.schowl.com
```

Pull requests run only the test job.

## On the Schowl server

| | |
| --- | --- |
| CI user | an unprivileged deploy user in the `docker` group |
| Checkout | `/srv/malay-schowl/app` (public repo cloned over HTTPS, so no GitHub key lives on the server) |
| Deploy script | `/usr/local/bin/malay-schowl-deploy`, a root-owned copy of [`deploy/server-deploy.sh`](deploy/server-deploy.sh) |
| Container | `malay-schowl`, bound to `127.0.0.1:3900` only ([`compose.prod.yml`](compose.prod.yml)) |
| nginx site | [`deploy/nginx-malay.schowl.com.conf`](deploy/nginx-malay.schowl.com.conf), TLS via the `*.schowl.com` Cloudflare origin certificate |
| DNS | Cloudflare `malay` record, proxied |

The GitHub Actions key is pinned to the deploy script in the deploy user's `authorized_keys`:

```
command="/usr/local/bin/malay-schowl-deploy",no-agent-forwarding,no-port-forwarding,no-pty,no-user-rc,no-X11-forwarding ssh-ed25519 AAAA... github-actions@malay-schowl
```

Whatever command CI sends, that key can only run the deploy script: no shell and no tunnels.

**Deploy by hand** (from a machine with server access): run `malay-schowl-deploy` on the server.

## Repository settings

Settings → Secrets and variables → Actions.

**Secrets**

| Name | What it holds |
| --- | --- |
| `DEPLOY_HOST` | server IP or hostname |
| `DEPLOY_PORT` | server SSH port |
| `DEPLOY_USER` | deploy user name |
| `DEPLOY_SSH_KEY` | private half of the `github-actions@malay-schowl` ed25519 key |
| `DEPLOY_KNOWN_HOSTS` | the server's `ssh-ed25519` host key line, so CI refuses an impostor server |

**Variables**

| Name | Value |
| --- | --- |
| `SITE_URL` | `https://malay.schowl.com` (also the switch: the deploy job is skipped while it's unset) |

**GitHub Pages:** Settings → Pages → Source: **GitHub Actions**.

## Rotating the deploy key

```bash
ssh-keygen -t ed25519 -N "" -C github-actions@malay-schowl -f /tmp/malay_deploy
# on the server: replace the old line in the deploy user's authorized_keys with the new .pub,
# keeping the command="..." prefix
gh secret set DEPLOY_SSH_KEY -R BelalElrashidy/Malay-Schowl < /tmp/malay_deploy
rm /tmp/malay_deploy /tmp/malay_deploy.pub
```
