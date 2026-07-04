# Design Review — wt-frontend (WorshipTool / chvalotce.cz)

> Datum: 2026-07-04
> Rozsah: celý frontend repozitář — architektura, UI/design systém, datová vrstva, tooling/CI/testy/výkon/bezpečnost.
> Stav v době review: Next.js 14 (App Router) + MUI 5 + TypeScript, ~784 TS/TSX souborů, 48 stránek, 220 souborů s `'use client'`.

## Celkový verdikt

Na malý multi-tenant projekt jde o **nadprůměrně dobře udělaný frontend**: striktní TypeScript, všechny obrázky přes `next/image`, `next/font`, lazy-loading analytiky, tiered e2e suity (smoke/critical/full), preview deploye per PR a vlastní typovaná routovací vrstva. Technický dluh se ale nasbíral v několika systémových věcech: bezpečnost auth, roztříštěná struktura `src/`, trojitý zdroj pravdy pro design tokeny a chybějící brzdy v CI.

---

## 1. Kritické nálezy (bezpečnost)

| # | Nález | Kde | Závažnost |
|---|-------|-----|-----------|
| 1 | Commitnutý Google API klíč ve veřejném statickém souboru (+ routing přes třetístranný `corsproxy.io`) | `public/sites/13ka-multitracks.html:505` | 🔴 Vysoká |
| 2 | JWT token uložený v cookie čitelné z JS — nastavuje ji klient, tj. bez `httpOnly`, `secure` i `sameSite`; XSS ho může ukrást | `src/hooks/auth/useAuth.tsx:101-104`, čte `middleware.ts`, `getServerUser.ts` | 🔴 Vysoká |
| 3 | Google One Tap: credential se dekóduje v prohlížeči (`jwt-decode`) a backendu se posílají už jen claims (`sub`, e-mail, jméno) místo podepsaného tokenu — pokud backend podpis neověřuje, identita je podvrhnutelná | `useAuth.tsx` (`loginWithGoogle`) | 🔴 Vysoká (ověřit backend) |
| 4 | Potenciální stored XSS: text písně jde do `dangerouslySetInnerHTML` bez escapování (escapují se jen akordy regexem) | `src/common/components/SheetDisplay/styles/SmartStyle.tsx:138` | 🟠 Střední–vysoká |
| 5 | GDPR/consent: Hotjar + Mixpanel + Statsig (vč. session replay a autocapture) se inicializují na každé stránce a po loginu dostávají e-mail, jméno i roli; consent banner nikde | `Analytics.tsx`, `HotjarAnalytics.tsx`, `MixPanelAnalytics.tsx`, `FeatureFlagsProvider.tsx` | 🟠 Střední–vysoká |

Doporučení: klíč rotovat a omezit na doménu (ideálně proxovat přes backend); auth cookie nastavovat serverem jako `httpOnly + Secure + SameSite`; na backend posílat raw Google credential a ověřovat podpis; escapovat text před chord-transformací; session replay a identify volání schovat za consent.

## 2. Architektura a struktura

### Co funguje
- `src/tech` je koherentní, framework-agnostická utility vrstva — nejčistší část kódu.
- Vlastní typovaná routovací vrstva (`src/routes` nad `nextjs-routes`) dává typové jistoty pro ~45 pojmenovaných rout.
- Multi-tenant/white-label design (chvalotce / chwalmy / hallelujahhub) přes `content/*.json` a subdomain rewriting.

### Problémy (podle závažnosti)
1. **`'use server'` zneužité jako značka „serverový soubor“** (~15 souborů: `pisen/[hex]/[alias]/page.tsx:1`, `AppProviders.tsx:1`, `useServerApi.tsx:1`, …). Direktiva dělá z každého exportu Server Action — server komponenty jsou default a direktivu nepotřebují. `useServerApi` navíc není hook → přejmenovat na `getServerApi`.
2. **Roztříštěné domovy komponent a hooků**: `src/components` je prakticky mrtvý (2 soubory), reálné komponenty žijí v `src/common/components` (~90 souborů) a `src/app/components` — kde je navíc zdvojené vnoření `src/app/components/components/`. Hooky: `src/hooks` (49 souborů), `src/common/hooks` (1 soubor), plus ad-hoc `hooks/` složky v routách a komponentách.
3. **`src/interfaces` a `src/types` jsou tatáž vrstva rozseknutá vejpůl** s obousměrnými importy (`interfaces/song/song.ts:1` ↔ `types/song/song.types.ts:2`); `SongGuid` má dvě importní cesty.
4. **Middleware (`src/middleware.ts`, 248 řádků) dělá blokující fetche na backend na skoro každý request** — kontrola expirace tokenu (ř. 153–204) a lookup team aliasu (ř. 206–247). Latence na hot path; výpadek backendu odhlásí všechny uživatele. Expiraci JWT lze ověřit lokálně, aliasy cachovat.
5. **139 hlubokých relativních importů** (4–11× `../`; rekord 11 úrovní v `(submodules)/(teams)/.../EditButtonsPanel.tsx:16`), přestože aliasy `@/*` existují a míchají se s nimi i v rámci jednoho souboru.
6. **Klient-first fetching**: 35 ze 48 stránek je `'use client'` (včetně homepage); `useApi` v 78 souborech vs. `useServerApi` ve 13. Serverové renderování App Routeru se využívá jen menšinově.
7. **Debug/dev routy jdou do produkce**: `/storybook`, `/test`, `/sub/test`, `/sub/admin/ml-trenink`; mrtvé soubory `src/components/DraggableList`, `src/components/examples/`, `Test.tsx`, `ServerComponent.tsx`.
8. URL prostor `/sub/tymy` je rozdělený mezi route groups `(layout)` (index) a `(submodules)/(teams)` (podstránky) — matoucí navigace.
9. Barrel exporty jsou nekonzistentní (`common/components/index.ts` exportuje 4 z ~90 modulů).

## 3. UI / design systém

### Co funguje
- Dvouvrstvá knihovna: `src/common/ui` (primitiva s barrel exporty a Storybook stories) + `src/common/components` (kompozity — Popup, Toolbar, SheetDisplay, …).
- `Image` wrapper vynucuje `alt`; `Button`/`IconButton` auto-generují `aria-label` z `alt || tooltip`.
- i18n přes next-intl reálně adoptované: 345 použití ve 161 souborech; multi-brand katalogy `content/{chvalotce,chwalmy,hallelujahhub}.json`; marketingové stránky (`o-nas/**`) bez hardcoded textů.

### Problémy (podle závažnosti)
1. **Trojitý zdroj pravdy pro barvy/tokeny** bez propagace: `src/common/constants/theme.ts` (MUI palette — jen primary/secondary/success), `src/app/globals.css` `:root` (tytéž hexy + grey škála `--color-grey-100..900` a `--spacing-1..6`, které v JS theme nejsou) a `src/tech/theme/theme.tech.ts` (`basicColors` + **ručně přepsané MUI breakpointy**). K tomu 59 hardcoded hexů ve 24 souborech a 55 `rgb()/rgba()` ve 37 souborech.
2. **Dark mode na úrovni theme neexistuje** — jen lokální `darkMode` boolean v team sidebaru (`useTeamSideBar.tsx`), který ručně přehazuje `grey.900/100` v několika panelech.
3. **`primary.dark = #532EE7` je fialová** (kvůli gradientu), ne tmavší modrá — ovlivní vše, co MUI standardně ztmavuje (hover stavy).
4. **Skeleton na stránce písně je vyřazený** — reálné skeletony v `pisen/[hex]/[alias]/loading.tsx` jsou zakomentované, renderuje se 30 generických pruhů; `/playlist` nemá `loading/error/not-found` vůbec.
5. **`SkeletonLoaderCore.tsx:72` při chybě vypíše na obrazovku raw `JSON.stringify(data)`** (když caller nezadá `renderError`), plus hardcoded české texty v generickém loaderu.
6. **Dva systémy modalů**: custom `Popup` (většina) vs. raw MUI `Dialog` (`PlaylistItemRow.tsx`, `MySongItem.tsx`). `Popup` nemá `role="dialog"`, `aria-modal` ani focus trap.
7. **Žádné `theme.components` overrides** — defaulty (radius tlačítek atd.) se opakují inline v každém wrapperu.
8. **Slabá přístupnost**: 58 aria/alt výskytů ve 34 souborech na celý projekt; kontrastní rizika (`grey.500/600` na bílé, žlutá `secondary #EBBC1E` jako popředí).
9. **Hardcoded čeština v user-facing fallbackech**: `pisen/.../not-found.tsx:13`, `CannotEditOnPhone.tsx:18`, `SkeletonLoaderCore.tsx` (admin sekce je obhajitelná výjimka).
10. Čtyři stylovací idiomy bez pravidla (712× `sx`, 32× `styled()`, 115× inline `style`, 21 CSS souborů); redundantní props (`small`/`outlined`/`contained` vedle `size`/`variant` u `Button`, ~6 překrývajících se props u `Typography`); rozbitý `Masonry` export; `useResponsiveValue` spouští 5 media queries na jedno volání.

## 4. Datová vrstva a state management

### Co funguje
- Generovaný OpenAPI klient (`generate_api.sh`, generator 7.5.0) s reflektivním wrapperem (`api-wrapper.ts`) — unwrap `AxiosResponse`, per-metoda mapování, jednotné error eventy (`networkErrorEvent`, `unauthorizedEvent`, …) → snackbary.
- `ApiState` je malý, srozumitelný state machine (`{data, loading, success, error, isDispatched}`).
- Vrstvené error boundaries: `global-error.tsx`, `error.tsx`, class `ErrorBoundary`.
- Token není v localStorage (jen věci jako `currentPlaylist` guid).

### Problémy (podle závažnosti)
1. **Žádný caching/dedup na klientu** — není react-query/SWR, každý hook fetchuje nezávisle. `fetchCommonDataServer.ts` sériově čeká na 3 backend cally při každém prvním renderu (vlastní TODO „optimize it!“). Cache pro flagy (`getFlagWithCache`/`saveFlagToCache` ve `flags.tech.ts`) existuje, ale **nikdy se nevolá**.
2. **Race conditions**: `useApiStateEffect.ts` vytváří `isMounted`, ale nikdy ho nekontroluje; žádný `AbortController`. `usePlaylist.ts` — rychlé přepnutí `guid` může doresolvovat ve špatném pořadí (last-to-resolve wins) + setState po unmountu.
3. **Socket bug**: `useLiveMessage.ts:64` volá `socket.off(groupName)` bez reference na handler → odregistruje **všechny** posluchače skupiny; dvě komponenty na stejné skupině si navzájem ruší odběr. Socket je modulový singleton připojující se hned při importu (ř. 9).
4. **Nememoizované context values** — `AuthProvider` (konzumovaný téměř všude) vrací nový objekt při každém renderu; podobně `BottomPanel`, `Favourites`, `Permissions`, `CommonData`. Navíc `getApiClass` v `useAuth` **znovu instancuje všech ~35 API tříd při každém auth renderu** (na rozdíl od memoizovaného `useApi`).
5. **Chyby na klientu se nikam nereportují** — `ErrorBoundary.componentDidCatch` jen `console.error`, `app/error.tsx` má TODO; **snackbar o síťové chybě vidí jen admin** (`ErrorHandlerProvider` gatuje na `isAdmin()`), běžný uživatel se o výpadku nedozví.
6. Provider pyramida ~18 vnořených providerů v `AppClientProviders.tsx`.
7. Playlist sync mezi hooky jede přes `window` `CustomEvent` (`usePlaylistChangeSubscription.ts`) — jen v rámci tabu, ne mezi klienty.
8. Drobnosti: `crypto-js` deklarovaný, ale nikde neimportovaný; mrtvý `js-cookie` import v `useAuth.tsx`; typo `STATSTIG_SERVER_SECRET_KEY` (`statsig.config.ts`); fragile parsování axios erroru v `useApiState.ts`; `useServerApi` s `'use server'` vrací neserializovatelné API objekty.

## 5. Tooling, CI/CD, testy, výkon

### Co funguje
- `tsconfig`: `strict: true`, dobře definované aliasy. Ručně psaný kód má jen ~146 `any` (509 z 557 je v generovaném klientu), ~15 non-null assertions, žádný `@ts-nocheck`.
- `next.config.mjs`: standalone output, AVIF/WebP, `optimizePackageImports` pro 15 balíků, PDF renderer server-only, custom polyfill-stripping (~11 KiB), SVG povolené jen s tvrdým CSP sandboxem.
- Raw `<img>` prakticky nula — vše přes `next/image` wrapper; fonty přes `next/font` (`display: swap`).
- Analytika chvályhodně lazy (Mixpanel/Hotjar/Statsig pluginy dynamicky importované); `@mui/x-charts` route-split.
- Testy: ~426 unit testů (38 souborů; routing/subdomény, tech utility, hooky, feature flags) + ~58 e2e ve 3 suitách s page-object helpery a preview deployi per PR. `isSafeUrl()` SSRF allowlist ve `fetch.ts`.
- Docker: multi-stage, non-root user, standalone trace; produkční `.env` není v repu.

### Problémy (podle závažnosti)
1. **CI nikde nespouští `tsc --noEmit` ani `next lint`** — PR pipeline (`basic-testing.yml`) jede jen Jest; typové a lint regrese projdou do merge. E2e běží až po deployi na dev server (post-merge signál).
2. **`react-hooks/rules-of-hooks: "off"`** v `.eslintrc.json` — pravidlo chytá crash-class bugy (podmíněné volání hooků); vrátit. (`exhaustive-deps` off je vědomá volba, budiž.)
3. **Mrtvé/podivné závislosti**: `npm@^11` (celé npm CLI jako runtime dep, desítky MB), `i@^0.3.7`, `sheet-api@0.0.3` (používá se `@pepavlin/sheet-api`), serverový `mixpanel` (bez importu), `crypto-js` (bez importu). Vše smazatelné bez změny chování.
4. **Analytics sprawl**: Mixpanel + Statsig (vč. session replay) + Hotjar + GA současně — překryv session-replay vendorů, klientská váha, privacy surface.
5. V hlavním bundlu zbytečně: `framer-motion` (staticky v Toolbar/Popup) a `@statsig/js-client` core.
6. Housekeeping: `node:18-alpine` (blízko EOL) → 20/22; `@next/bundle-analyzer@16` vs. `next@14`; `actions/checkout@v3`; `.env` chybí v `.dockerignore` (dostane se do builder layeru); hardcoded IP + `StrictHostKeyChecking=no` v deploy workflow; mrtvý `false &&` kód v `playwright.config.ts`; `reactStrictMode: false`.

## 6. Doporučené pořadí prací

### Hned (bezpečnost + quick wins)
1. Rotovat Google API klíč (`public/sites/13ka-multitracks.html`); escapovat text písně před `dangerouslySetInnerHTML` (`SmartStyle.tsx`).
2. Auth cookie nastavovat serverem jako `httpOnly + Secure + SameSite`; na backend posílat raw Google credential a ověřovat podpis serverem.
3. Smazat mrtvé závislosti (`npm`, `i`, `crypto-js`, `sheet-api@0.0.3`, `mixpanel`) a přidat `check-types` + `lint` do PR CI.
4. Consent banner před session replay / identify (GDPR).

### Krátkodobě (stabilita)
5. `AbortController` + mounted check do `useApiState`/`useApiStateEffect`; opravit `socket.off` v `useLiveMessage` (odregistrovávat konkrétní handler, lazy connect).
6. Middleware: validovat JWT `exp` lokálně místo backend fetche; cachovat subdomain-alias lookupy.
7. Odstranit všechna ne-akční `'use server'`; přejmenovat `useServerApi` → `getServerApi`; zapnout `rules-of-hooks`.
8. Memoizovat context values (hlavně `AuthProvider`) a `getApiClasses`; reportovat klientské chyby (backend logger nebo Sentry); síťové chyby ukazovat všem, ne jen adminům.

### Střednědobě (design a struktura)
9. **Jeden zdroj design tokenů**: plná paleta (grey, error/warning/info, background, text) + spacing + radius v MUI theme; CSS vars generovat z něj (nebo MUI `cssVariables`); smazat duplicitní breakpointy v `theme.tech.ts`; `theme.components` overrides místo inline defaultů. Otevře cestu k pořádnému dark mode (`colorSchemes`).
10. Sloučit `src/interfaces` + `src/types` do jedné domain vrstvy; smazat mrtvý `src/components`; jedno pravidlo pro domovy komponent a hooků; zrušit `app/components/components/` double-nesting; krátký `ARCHITECTURE.md`, ať taxonomie znovu nedriftuje.
11. Zavést caching/dedup (react-query/SWR nebo minimální sdílená cache) a přesunout initial fetche na server u frekventovaných stránek (homepage, seznam, playlist).
12. Sjednotit modaly na jeden systém (Popup postavit na MUI `Dialog`/`Modal` kvůli focus trapu a aria zdarma); a11y + kontrastní audit; dotáhnout i18n fallbacky (404, phone-block, generický error).
13. Gatovat/odstranit debug routy (`/storybook`, `/test`, `sub/test`, `ml-trenink`); codemod 139 hlubokých relativních importů na `@/*` + lint pravidlo.

---

*Review vzniklo statickou analýzou kódu (bez spuštění aplikace). Čtyři paralelní průzkumy: architektura/struktura, UI/design systém, datová vrstva/state, tooling/testy/výkon/bezpečnost. Všechny nálezy jsou ověřené proti zdrojovým souborům na revizi `a455395`.*
