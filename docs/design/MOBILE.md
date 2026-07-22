# MOBILE.md — mobile app-shell rules (phones, < 700px)

The phone experience is a **native-feeling app shell**, distinct from the
desktop layout. These rules keep it consistent and calm. They apply below
`MOBILE_NAV_BREAKPOINT` (700px); desktop is unaffected.

Read this alongside `DESIGN-SYSTEM.md`, `COMPONENTS.md` and `PATTERNS.md`.
When a mobile screen looks busier or louder than its neighbours, it's wrong
even if it looks fine in isolation.

## The shell

Every app-shell screen is built from `@/common/ui`'s **`MobileAppHeader`**
(`common/components/MobileAppHeader`). It owns the whole viewport minus the
bottom tab bar and **only the middle content scrolls** — the header, an
optional top control strip, an optional bottom panel and the tab bar all stay
pinned. So the scrollbar belongs to the content, never the full height.

```
┌──────────────────────────────────────────────┐
│ ←  Title                     [ 0–2 icons ]    │  header (large → shrinks on scroll)
│    subtitle (ReactNode)                        │
├──────────────────────────────────────────────┤
│ [ controlPanel: segment / chips ]  (optional)  │  pinned under the header
├──────────────────────────────────────────────┤
│                 content scrolls                │
├──────────────────────────────────────────────┤
│ [ bottomPanel: pagination … ]      (optional)  │  pinned above the tab bar, QUIET
└──────────────────────────────────────────────┘
                (global nav — tab bar)              rendered globally, not by the page
```

Slots: `title`, `subtitle` (any node), `backTo`/`backParams` (hierarchical Up,
hidden on tab-roots), `actions` (≤ 2 icons, right of the title), `controlPanel`
(top strip), `bottomPanel` (above the tab bar), `scrollResetKey`.

**Same header height everywhere.** The header row keeps a fixed minimum height
(matching the back-arrow / action buttons) so a title-only header (Seznam,
Účet) collapses to exactly the same height as one with controls (Moje písně,
Oblíbené). The back arrow appears only when `backTo` is set — tab-roots (Domů /
Písně=Seznam / Účet) have none by design; you switch to them via the tab bar.

## Attention & layout rules

1. **Thumb zone = navigation + at most one primary.** The bottom tab bar owns
   navigation. The app's single bottom-primary is the tab bar's raised
   **search** action. **Pages never add a competing bottom FAB.**
2. **One hero blue per zone.** Primary blue is the attention colour — spend it
   on the current-tab indicator + one primary action per zone. Everything else
   (pagination, sort, secondary actions) is **neutral** (grey / tonal).
   → paginators and control strips are never blue.
3. **Placement by frequency.** Frequent / primary → bottom (thumb reach).
   Occasional / contextual (create, sort, filter, in-list search, pagination)
   → top (header / controlPanel), or a quiet bottom panel.
4. **The bottom panel is quiet.** A `bottomPanel` (e.g. pagination) is
   low-contrast and neutral so it never competes with the tab bar's primary,
   and sits **below** the tab bar's raised action in z-order.
5. **Don't stack shouters.** If two attention elements want the same spot,
   promote one and relocate / soften the other. Never stack several loud
   elements on top of each other.
6. **Consistent homes for actions.** Navigation → tab bar. Primary action →
   exactly one place (the tab bar's search); a page's own create action → the
   header (a "+ Add" pill), **not** a FAB. Contextual controls → `controlPanel`
   at the top. Content navigation (pagination) → a quiet `bottomPanel`.
7. **Never a blank screen.** A data-backed screen always renders one of four
   states — **loading** (skeletons), **empty** (icon + message), **error**
   (icon + message + a "Zkusit znovu" retry), or the **content**. A page that
   shows only its header while data is missing is a bug: the user can't tell
   loading from broken. Match the states shown by `MobileSongListView` /
   `SeznamMobile`.

## Applied (the standard)

- **Create actions** (Moje písně "Přidat", Playlisty "Nový") live in the
  header as a compact primary pill in `actions` — no FAB.
- **Pagination** uses the neutral (standard) MUI colour, pinned in a quiet
  `bottomPanel`.
- **Sort / filter** live in the `controlPanel` (segment) at the top.
- **Global search** stays the tab bar's raised centre action — the one loud
  element in the thumb zone.

Per-page shape:

| Screen | back | subtitle | header actions | controlPanel | bottomPanel |
|---|---|---|---|---|---|
| Účet | – | – | – | – | – |
| Oblíbené | → Účet | count | (in-list search) | sort | – |
| Moje písně | → Účet | count | **+ Přidat** | sort/filter | pagination |
| Playlisty | → Účet | count | **+ Nový** | sort | – |
| Písně (Seznam) | – | – | – | – | pagination |
| Playlist detail | → back | Playlist · count | **Prezentovat** + ⋮ | (mode switch) | – |

**Header actions cap holds even for custom headers.** The playlist detail
page has its own collapsing header (not `MobileAppHeader`), but still obeys
the rule: **one primary + one `⋮`**. Its primary is the blue *Prezentovat*;
everything secondary (share, print, edit) lives in a single overflow menu
(`common/components/Menu`), never as a row of inline icons. The collapsed
(slim / scrolled) header keeps the exact same two controls. In edit mode the
`⋮` becomes a `✓` to give a clear way out. Don't reintroduce inline
share/print/edit icons "because there's room" — that's the drift this rule
exists to stop.
