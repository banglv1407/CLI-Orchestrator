# US-069: Full websites through an HTTP proxy

## Current behavior

CLX has per-backend API transports but no native website browsing surface.

## Target behavior

An activity-bar Web view saves an HTTP proxy and destination URL and renders a
complete interactive website using an isolated native content WebView. Website
subresources and subsequent requests use the same proxy.

## Affected users and documents

Desktop CLX users accessing internal web applications through HTTP proxies.
Product contract: `docs/product/web-browser.md`.

## Non-goals

SSH, proxy authentication, arbitrary application protocols, browser extensions,
changes to CliProxyAI or OS proxy settings, and contacting the illustrative IPs.
