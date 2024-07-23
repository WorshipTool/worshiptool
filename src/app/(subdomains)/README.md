# Subdomains

## How to add a subdomain

Just create a common page, but its path should start with `sub/`. Nested subdomains are also supported.
For example: `chvalotce.cz/sub/nameA/sub/nameB`.

## How it is mapped

It is quiet straightforward. The url `nameB.nameA.chvalotce.cz` is redirecting on path `chvalotce.cz/sub/nameA/sub/nameB`

## Testing on localhost

Brave or Safari does not support localhost subdomains. Use Chrome instead.
