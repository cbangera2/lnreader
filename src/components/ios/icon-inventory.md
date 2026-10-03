# iOS icon inventory + SF Symbols plan

Source of truth for `ISIcon.tsx` (props: Material icon `name: string`,
`size?`, `color?`, `weight?`). Scanned October 2026 against `src/`.

## 1. Package decision: `expo-symbols` (Expo SDK 57)

- `expo-symbols` is the official Expo SDK 57 library for native symbols:
  SF Symbols on iOS/tvOS, Material Symbols on Android/web. Docs:
  https://docs.expo.dev/versions/latest/sdk/symbols/
- Pin to the SDK 57 line: **`expo-symbols@57.0.3`** (latest 57.x; 58.x targets
  the next SDK — do NOT install it).
- Native side is fully managed: autolinked native module, **no app.json
  plugin config, no entitlements, no extra native setup**. SF Symbols render
  via the system `UIImage(systemName:)` API, which works with free Apple
  sideloading / ad-hoc signing.
- Runtime deps it pulls in are fonts/types only
  (`@expo-google-fonts/material-symbols`, `sf-symbols-typescript`).

### Install steps (lead — NOT run yet, do not run in this branch)

```sh
# from repo root (pnpm project; expo install resolves SDK-compatible version)
pnpm dlx expo install expo-symbols
# or: npx expo install expo-symbols
npx expo prebuild --clean   # regenerates ios/ with the autolinked module
```

No `app.json` changes needed — verify with `npx expo config --type introspect`
that no new plugin appears. Android build is untouched: `ISIcon` renders the
Material icon on Android via the existing
`@react-native-vector-icons/material-design-icons` dependency.

### Why `ISIcon.tsx` uses a lazy require

`expo-symbols` is not installed yet, so a static `import ... from
'expo-symbols'` would break `tsc` and Metro for everyone (including Android).
`ISIcon` therefore resolves `SymbolView` via an indirected `require()` inside
try/catch (module-scope cached). Metro cannot statically resolve a
non-literal require, so the bundle builds with or without the package;
after the lead runs the install above, iOS automatically starts rendering
SF Symbols with zero code changes. Before that — and for any unmapped name —
iOS renders the Material icon, same as Android.

## 2. Icon inventory (distinct Material names in `src/`)

### Tab bar (`src/navigators/BottomNavigator.tsx` → `BottomTabBar`)

| Material | SF | Screen |
|---|---|---|
| `bookmark-box-multiple` | `books.vertical.fill` | Library |
| `alert-decagram-outline` | `bell.badge.fill` | Updates |
| `history` | `clock.arrow.circlepath` | History |
| `compass-outline` | `safari` | Browse |
| `dots-horizontal` | `ellipsis` | More |
| `circle` | `circle` | fallback (unknown route) |

### Headers (`Appbar` consumers via `SearchbarV2` `leftIcon`/`rightIcons[].iconName`)

`arrow-left` → `arrow.left`, `arrow-right` → `arrow.right`,
`magnify` → `magnifyingglass`, `close` → `xmark`,
`dots-vertical` → `ellipsis`, `refresh` → `arrow.clockwise`,
`reload` → `arrow.clockwise`, `earth` → `globe`,
`book-search` → `text.magnifyingglass`,
`filter-variant` → `line.3.horizontal.decrease.circle`,
`tune` → `sliders.horizontal.3`, `select-all` → `checkmark.square.fill`,
`delete-sweep-outline` → `trash`, `compass-outline` → `safari`,
`book-arrow-up-outline` → `arrow.up.doc.fill`,
`puzzle-outline` → `puzzlepiece.fill`,
`source-repository` → `archivebox.fill`.
Consumers: `LibraryScreen`, `UpdatesScreen`, `HistoryScreen`, `BrowseScreen`
(`SourcesTab`, `PluginsTab`), `BrowseSourceScreen`, `AniListTopNovels`,
`MalTopNovels`, `ReaderScreen` (error/empty states), `NovelScreen`,
`GlobalSearchScreen` (`leftIcon="magnify"`), `WebviewScreen` Appbar
(`close`, `arrow-left`, `arrow-right`, `dots-vertical`).

### Searchbars (`SearchbarV2`, reader `ReaderSearchbar`)

`close` → `xmark`, `dots-vertical` → `ellipsis`, `arrow-left` → `arrow.left`,
`magnify` → `magnifyingglass`, `chevron-up` → `chevron.up`,
`chevron-down` → `chevron.down`.

### Reader chrome (`ReaderAppbar`, `ReaderFooter`, `ReaderSearchbar`)

`arrow-left` → `arrow.left`, `close` → `xmark`, `magnify` → `magnifyingglass`,
`bookmark` → `bookmark.fill`, `bookmark-outline` → `bookmark`,
`dots-vertical` → `ellipsis`, `chevron-left` → `chevron.left`,
`chevron-right` → `chevron.right`,
`arrow-collapse-up` → `arrow.up.to.line`,
`format-list-bulleted` → `list.bullet`, `cog-outline` → `gearshape`,
`chevron-up`/`chevron-down` → `chevron.up`/`chevron.down`.

### Novel detail actions (`NovelScreen`, `NovelScreenButtonGroup`, `NovelInfoHeader`, `ChapterDownloadButtons`, `NovelBottomSheet`, `TrackSearchDialog`)

`heart` → `heart.fill`, `heart-outline` → `heart`, `check` → `checkmark`,
`sync` → `arrow.triangle.2.circlepath`,
`arrow-down-circle-outline` → `arrow.down.circle`,
`check-circle` → `checkmark.circle.fill`, `bookmark` → `bookmark.fill`,
`fountain-pen-tip` → `pencil`, `palette-outline` → `paintpalette`,
`filter-variant` → `line.3.horizontal.decrease.circle`, `close` → `xmark`,
`select-all` → `checkmark.square.fill`, `chevron-right` → `chevron.right`,
status map: `clock-outline` → `clock`, `check-all` → `checkmark.circle.fill`,
`pause-circle-outline` → `pause.circle`, `cancel` → `xmark.circle.fill`,
`copyright` → `c.circle`, `book-check-outline` → `book.closed.fill`,
`help-circle-outline` → `questionmark.circle`, `help` → `questionmark`,
`book-off-outline` → `eye.slash`, `sleep` → `moon.fill`.

### Settings rows (`SettingsScreen`, `MoreScreen`, reader/appearance/library/taxonomy/repository/custom-code settings)

`tune` → `sliders.horizontal.3`, `palette-outline` → `paintpalette`,
`bookshelf` → `books.vertical.fill`, `book-open-outline` → `book.fill`,
`github` → `chevron.left.forwardslash.chevron.right`,
`code-braces`/`code-tags`/`language-javascript`/`language-css3` → same code symbol,
`sync` → `arrow.triangle.2.circlepath`,
`cloud-upload-outline` → `icloud.and.arrow.up`,
`cloud-off-outline` → `icloud.slash`,
`tag-multiple-outline` → `tag.fill`, `label-outline` → `tag`,
`glasses` → `glasses`, `incognito` → `eye.slash`,
`information-outline` → `info.circle`, `chart-line` → `chart.line.uptrend.xyaxis`,
`progress-download` → `arrow.down.circle`, `folder-download` → `folder.fill`,
`folder-outline` → `folder`, `file-export-outline` → `square.and.arrow.up`,
`format-list-bulleted` → `list.bullet`, `cog` → `gearshape.fill`,
`cog-outline` → `gearshape`, `play` → `play.fill`, `pause` → `pause.fill`,
`download-outline` → `arrow.down.to.line`, `content-save` → `square.and.arrow.down`,
`delete-sweep` → `trash`, `pencil-outline`/`pencil` → `pencil`,
`delete`/`delete-outline`/`trash-can-outline` → `trash`,
`content-copy` → `doc.on.doc`, `open-in-new` → `arrow.up.right.square`,
`file-import-outline` → `square.and.arrow.down`,
`content-save-outline` → `square.and.arrow.down`,
`content-paste` → `doc.on.clipboard`,
`book-open-page-variant`/`book-open-page-variant-outline` → `book.fill`,
`bookmark-outline` → `bookmark`, `check-outline` → `checkmark.circle`,
`trash-can-outline` → `trash`, `plus` → `plus`,
`format-align-left/center/right/justify` → `text.alignleft`/`text.aligncenter`/`text.alignright`/`text.justify`,
`format-size` → `textformat.size`, `format-color-text` → `textformat`,
`gesture-swipe-horizontal` → `arrow.left.and.right`,
`account-voice` → `speaker.wave.2.fill`,
`checkbox-blank-outline` → `square`, `checkbox-marked` → `checkmark.square.fill`,
`close-box` → `xmark.square.fill`, `pin` → `pin.fill`, `pin-outline` → `pin`,
`drag-horizontal-variant` → `line.3.horizontal`,
`chevron-up`/`chevron-down`/`chevron-right` → `chevron.*`,
`arrow-up`/`arrow-down` (sort toggles) → `arrow.up`/`arrow.down`,
`swap-vertical-variant` → `arrow.up.arrow.down`,
`chevron-double-left`/`chevron-double-right` → `chevron.left.2`/`chevron.right.2`,
`auto-fix` → `sparkles`.

### Misc (deliberately unmapped — not Material glyph names)

`Σ(ಠ_ಠ)`, `📚`, `(･o･;)`, `(･Д･。)`, `__φ(．．)` — text/emoji passed as Paper
`icon` props (novel/download empty states). They flow through the Material
fallback path unchanged, exactly as today.

## 3. Mapping coverage

- **109 Material → SF mappings** in `MATERIAL_TO_SF`, covering 100% of the
  Material names used in: `BottomTabBar`/`BottomNavigator`, `Appbar` consumers,
  `SearchbarV2`, reader chrome (`ReaderAppbar`/`ReaderFooter`/`ReaderSearchbar`),
  novel detail actions, and settings rows.
- Only the 5 text/emoji pseudo-icons above are unmapped by design.

## 4. Fallback behavior (never crash / never blank)

1. **Android**: always renders `@react-native-vector-icons/material-design-icons`
   with the same `size`/`color` semantics. Zero behavior change.
2. **iOS, unmapped name**: renders the Material icon (same as Android).
3. **iOS, `expo-symbols` not installed**: renders the Material icon.
4. **iOS, mapped + installed**: renders `SymbolView` with `size`, `tintColor`,
   `weight`, and a matching `{width, height}` style so layout matches the
   Material icon it replaces.
5. SF names were chosen conservatively (long-stable symbols only) because
   `SymbolView` renders blank for unknown names — there is no runtime
   validation, so an aggressive mapping is worse than falling back.

## 5. Adoption notes for the lead

- `ISIconCompat.tsx` (sibling-owned shim) already `require()`s `./ISIcon`
  supporting both default and named exports — `ISIcon.tsx` provides both.
- `ISRow` already renders its `icon` prop via `ISIconCompat`; swapping other
  call sites (tab bar, appbars, reader chrome) to `ISIcon` is a mechanical
  `name=`-compatible replacement — no existing screen/component file was
  touched in this change.
- Optional follow-up: map header back `arrow-left` → `chevron.left` to match
  iOS nav convention (kept faithful `arrow.left` for now).
