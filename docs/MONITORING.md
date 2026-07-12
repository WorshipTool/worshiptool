# Monitoring, logování chyb a analytika

## Sentry

Chyby se hlásí do [Sentry](https://sentry.io). Bez nastaveného
`NEXT_PUBLIC_SENTRY_DSN` je Sentry vypnuté a všechna volání jsou no-op.

### Env proměnné

| Proměnná | Povinná | Popis |
| --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | ne | DSN projektu ze Sentry. Bez ní se nic neposílá. |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | ne | Název prostředí. Default je `NODE_ENV`. |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | ne | Jen pro upload source maps při buildu. Bez tokenu se upload přeskočí. |

Inicializace: `sentry.client.config.ts`, `sentry.server.config.ts`,
`sentry.edge.config.ts` (root) + `src/instrumentation.ts`. Build obaluje
`withSentryConfig` v `next.config.mjs`.

### Co se hlásí

- **Error boundaries** — `src/app/error.tsx`, `src/app/global-error.tsx`
  a `src/common/components/app/ErrorBoundary.tsx` posílají zachycené render
  chyby do Sentry (tag `errorBoundary` říká, která vrstva chybu chytla).
- **API chyby** — `handleApiCall` (client) hlásí odpovědi 5xx,
  `handleServerApiCall` (server) hlásí 5xx i síťové chyby směrem na backend.
  Očekávané klientské chyby (401/403/404) se nehlásí.
- **Server chyby** — `logServerError()` posílá do Sentry a zároveň forwarduje
  na backend logger (`POST /error`).
- **React Server Components** — `onRequestError` v `src/instrumentation.ts`.

Session replay v Sentry je vypnutý — nahrávání session řeší Statsig/Hotjar.

## Analytika (Mixpanel)

Eventy se trackují přes typovaný facade
`src/app/components/components/analytics/analytics.tech.ts`:

```ts
Analytics.track('VISIT_SONG', { songGuid, packGuid, title, hasChords })
```

Nový event přidáš rozšířením `AnalyticsTrackData`
v `analytics.types.ts` — název i payload jsou pak typově kontrolované.

### Aktuálně trackované eventy

| Event | Kde se posílá |
| --- | --- |
| `VISIT_SONG` | zobrazení písně (`SongAnalyze.tsx`) |
| `SEARCH` | vyhledávání po debounce (`SearchedSongsList.tsx`) |
| `SMART_SEARCH_TOGGLE` | přepnutí smart search (`MainSearchInput.tsx`) |
| `LOGIN` / `SIGNUP` / `LOGOUT` | auth flow (`useAuth.tsx`), `method` rozlišuje heslo/Google |
| `CREATE_PLAYLIST` | založení playlistu (`usePlaylistsGeneral.ts`) |
| `ADD_SONG_TO_PLAYLIST` / `REMOVE_SONG_FROM_PLAYLIST` | práce s playlistem (`usePlaylistsGeneral.ts`) |

Identifikace uživatele (identify + people.set) probíhá
v `MixPanelAnalytics.tsx` po přihlášení.
