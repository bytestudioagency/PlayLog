# PlayLog — Feature Backlog

## Done

### 1. Image URLs for covers
Paste an image URL as an alternative to uploading a file when creating or editing a log. Implemented as an Upload / Paste link toggle in the game drawer; pasted URLs are validated server-side and rendered as plain `<img>` (not `next/image`) so an arbitrary external URL can't trigger the image optimizer to fetch it server-side.

### 4. "Dropped" status
A fourth status for games abandoned mid-way, alongside Playing / Completed / To be played. Flows automatically through the existing filter chips and drawer status buttons.

### 5. Dashboard search box (+ pagination)
Title search combined with the status/platform filters and sort, all resolved **server-side** so results stay correct across pages. Paginated at 20 games per page with Prev/Next controls. Search is debounced (300ms) and requests are sequenced so a slow response from an old filter combo can't overwrite a newer one.

### 8. Export (JSON/CSV)
One-click export of the full library from the dashboard's Download menu, as either JSON (raw fields, backup/reimport) or CSV (human-readable columns).

### 6. Stats section
Dedicated `/dashboard/stats` page, linked from the dashboard header. Scoreboard tiles for most-played game, average hours per game and drop rate, plus cards for completion rate (with a status breakdown), hours per platform, rating spread, and a 6-month "games logged" trend chart. All computed server-side in `fetchLibraryStats`.

### 2. Share pages
Public, read-only pages a user can share:
- **Backlog page** (`/u/[id]/backlog`): games with status "To be played".
- **Tier page** (`/u/[id]/tier`): completed games laid out as an S–E tier list.

Always on for every account (no per-user toggle) — reachable at a fixed, unindexed link. The **Share** menu on the dashboard has one button per page: clicking it copies the link and opens it in a new tab.

## Planned

### 3. Game search autocomplete (IGDB or RAWG)
Type a title in the drawer, pick a match, and auto-fill the official cover, release year and platforms. Removes the manual cover-image hunt and makes the share pages look better with real covers.

### 7. Steam import
Pull the user's Steam library and playtimes via the Steam Web API to seed the log. Needs API key handling, title matching and dedup logic.
