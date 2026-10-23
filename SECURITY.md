# Security policy

## Reporting a vulnerability

Please use GitHub's **private vulnerability reporting** on this repository
(Security → Report a vulnerability) rather than opening a public issue. That
keeps the report private until there is a fix.

If private reporting is unavailable, open an issue that describes the *kind* of
problem without including a working exploit.

## Scope

Daily Bodh is a static website plus an offline Android app. That shape is the
main security property, and it is deliberate:

- **The website is static files.** No server, no database, no accounts, no user
  input handling, and no third-party requests. There is nothing to inject into
  and no session to steal.
- **The offline Android build declares no `INTERNET` permission**, so it
  physically cannot reach the network.
- **No secrets ship in the site or the app.** A static page cannot hide a
  credential — anything in `docs/` is readable by anyone.

In scope:

- a way to make the site or the app send data anywhere it should not
- a leaked credential in the repository or its history
- a dependency vulnerability that affects the shipped app
- XSS in the site's own rendering of its bundled data

Out of scope:

- the accuracy of astrological content — see `docs/data/sources.json`
- anything requiring a modified browser or a rooted device

## Handling credentials

This repository is **public**. Never commit a key, token or password. GitHub
secret scanning and push protection are enabled, which blocks detectable secrets
at push time, but do not rely on that alone: a key committed to a public repo
should be treated as compromised and rotated immediately, because it stays in
the git history even after the file is deleted.

Credentials a workflow needs belong in **Settings → Secrets and variables →
Actions**, referenced as `${{ secrets.NAME }}`.

## Supported versions

The Android app and the website are both deployed from `main`. Only the current
`main` is supported.
