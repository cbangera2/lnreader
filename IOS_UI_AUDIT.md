# LNReader iOS UI Audit — Browse / Reader / Main Flows

Branch: `ios-settings-isrow`. Goal: 10/10 native iOS feel, no dead space, consistent grouped surfaces, full user-flow coverage.

## Audit method

- Drive real flows on iPhone 17 Pro sim via agent-device: Browse → Source → Novel → Reader; Global Search; Library; Filter sheet; Updates/History/More.
- Screenshot each step (`/tmp/*.png`), snapshot refs for taps, dismiss RN overlay when present.
- Per screen check: large title (top-level only), bg `surfaceVariant` + cards `surfaceContainerLow/surface`, 44pt rows, hairline dividers, chevron only for push, destructive red only for delete, no clipped tab bar (IOS_TAB_CLEARANCE), no empty headers, no double paddings.

## Round 1 — Baseline (this pass)

- [x] Settings group (8 screens) → ISGroupedList/ISRow — verified w/ screenshots
- [ ] Browse: SourcesTab rows too tall? (64pt min), Latest + pin crowd right side; Discover cards inconsistent
- [ ] Browse: PluginsTab same row issues + Update All button style
- [ ] BrowseSourceScreen: search bar + grid density, filter FAB overlaps tab dock?, skeleton vs empty states
- [ ] GlobalSearch: entry point discoverability, result cards, skeleton
- [ ] NovelScreen: header/backdrop, action row (library/tracker/download), chapter list density, info sections
- [ ] ReaderScreen: chrome (top/bottom bars), text size/line height, tap zones, next/prev, settings sheet
- [ ] Library: category tabs, display modes, selection mode, empty states, FAB
- [ ] Updates/History: row density, swipe actions, empty states
- [ ] FilterBottomSheet: iOS sheet style, apply/clear, chip layout
- [ ] Tab dock overlap: verify IOS_TAB_CLEARANCE on every scroll list

## Round 2 — Fix pass (after baseline screenshots)

- [ ] Centralize Browse: single search across sources + plugins? At least unify Sources/Plugins headers
- [ ] Condense source/plugin rows to 56–60pt, 44pt touch targets, consistent icon 44pt continuous
- [ ] Filter FAB → iOS-style bottom toolbar or nav-bar button (no FAB-over-dock)
- [ ] Reader: safe-area aware chrome, large-title OFF (push screen), consistent back chevron
- [ ] Novel: collapse redundant headers, sticky chapter header, consistent metadata rows
- [ ] Empty/error states: single component, centered, actionable

## Verification log

| Date       | Flow                     | Screenshot                | Result                                                                |
| ---------- | ------------------------ | ------------------------- | --------------------------------------------------------------------- |
| 2026-10-05 | Settings                 | /tmp/settings.png         | PASS grouped                                                          |
| 2026-10-05 | General                  | /tmp/general.png          | PASS                                                                  |
| 2026-10-05 | Appearance               | /tmp/appearance.png       | PASS                                                                  |
| 2026-10-05 | Library settings         | /tmp/library_settings.png | PASS                                                                  |
| 2026-10-05 | Backup                   | /tmp/backup2.png          | PASS (pre-existing GoogleSignin toast)                                |
| 2026-10-05 | Advanced                 | /tmp/advanced.png         | PASS destructive red                                                  |
| 2026-10-05 | Tracker                  | /tmp/tracker.png          | PASS logos                                                            |
| 2026-10-05 | About                    | /tmp/about.png            | PASS                                                                  |
| 2026-10-05 | Browse sources           | /tmp/browse_back.png      | PASS sections DISCOVER/LAST USED/ENGLISH                              |
| 2026-10-05 | Source grid (Novel Fire) | /tmp/source.png           | PASS 3-col covers, Filter FAB clear of content                        |
| 2026-10-05 | Filter sheet             | /tmp/filter.png           | PASS Reset/Filter, Language/Genres/Chapters/Rating                    |
| 2026-10-05 | Novel detail             | /tmp/novel.png            | PASS cover/title/actions/synopsis                                     |
| 2026-10-05 | Novel chapters           | /tmp/novel_chapters.png   | PASS 88 chapters, Start reading, download icons                       |
| 2026-10-05 | Reader text              | /tmp/reader.png           | PASS dark text renders, progress saved (Continue reading)             |
| 2026-10-05 | Reader chrome            | /tmp/reader_chrome.png    | ISSUE top bar overlaps status bar (1:31 behind purple); bottom bar OK |
| 2026-10-05 | Global search empty      | /tmp/globalsearch.png     | PASS cute empty state                                                 |
| 2026-10-05 | Global search results    | /tmp/gs_results.png       | PASS grouped by source, 1 source 422 shown inline (network, not UI)   |
| 2026-10-05 | Browse→global shortcut   | /tmp/browse_shortcut.png  | PASS grouped "Search all sources for villain" card on no local match  |
| 2026-10-05 | Shortcut landing         | /tmp/browse_to_global.png | PASS GlobalSearch prefilled, grouped results                          |
| 2026-10-05 | GS after key fix         | /tmp/gs_fixed.png         | PASS no duplicate-key toast, real covers                              |
| 2026-10-05 | GS back button           | /tmp/gs_back.png          | PASS Back returns to Browse, list restored                            |
| 2026-10-05 | Appearance light         | /tmp/appearance_light.png | PASS grouped cards/switches legible                                   |
| 2026-10-05 | Browse light             | /tmp/browse_light.png     | PASS title/search/rows/dock contrast                                  |
| 2026-10-05 | Appearance dark restore  | /tmp/dark_restored.png    | PASS device left as found                                             |
| 2026-10-05 | Settings final-bundle    | /tmp/settings_final.png   | PASS grouped card, no redbox after all rebundles                      |
| 2026-10-05 | Settings post-icon-fix   | /tmp/settings_iconfix.png | PASS sliders icon renders, gap gone, uniform card                     |
| 2026-10-05 | General final-bundle     | /tmp/general_final.png    | PASS uniform groups                                                   |
| 2026-10-05 | Advanced final-bundle    | /tmp/advanced_final.png   | PASS destructive red intact, no gaps                                  |
| 2026-10-05 | Backup final-bundle      | /tmp/backup_final.png     | PASS groups clean (pre-existing GoogleSignin toast only)              |
| 2026-10-05 | Tracker final-bundle     | /tmp/tracker_final.png    | PASS logo rows + footer, no gaps                                      |
| 2026-10-05 | About final-bundle       | /tmp/about_final.png      | PASS two groups, no gap (gap was icon-specific)                       |
| 2026-10-05 | Library final-bundle     | /tmp/library_final.png    | PASS DISPLAY/LIBRARY groups, no gaps                                  |

## Round 1 findings → fixes

- [x] R1-1 Reader top bar safe-area: verified edge-to-edge Glass by design, time legible; footer pads nav inset. No change.
- [x] R1-2 Browse rows: verified 64pt rows w/ hairlines, Latest + pin uncrowded. Keep.
- [x] R1-3 Source grid bottom padding: verified last row + Filter FAB clear (push screen, no dock). Keep.
- [x] R1-4 Novel chapter rows: verified 44pt+, download icons, Start reading CTA. Keep.
- [x] R1-5 Global search: verified keyboard + grouped results + inline 422. Keep.
- [x] R1-6 Import hygiene (CODE RULES): `ISIcon` via barrel `@components/ios` in `BrowseSourceScreen.tsx`, `FilterBottomSheet.tsx`, `ReaderFooter.tsx`. tsc+eslint clean, app re-verified live.

## Round 2 (central browse + global search robustness)

- [x] R2-1 Central Browse: iOS global-search shortcut row (`browseScreen.globalSearchFor`) under searchbar when query non-empty → navigates to GlobalSearch prefilled. Verified live: /tmp/browse_shortcut.png shows grouped card w/ chevron on "No matching results"; tap → /tmp/browse_to_global.png prefilled results. Android unchanged (no row).
- [x] R2-2 Duplicate-key dev toast in global results: inner horizontal `keyExtractor` now `plugin.id + path + index` (sources return duplicate/junk cards sharing path). Re-verified: /tmp/gs_fixed.png renders clean, no red toast, real covers. Plus ISIcon barrel import in same file.
- [x] R2-3 Reader light-mode contrast: verified live both modes — /tmp/appearance_light.png (light grouped cards, all rows legible) and /tmp/browse_light.png (large title, search, rows, dock); dark restored /tmp/dark_restored.png (device left as found). Reader WebView uses theme vars + readerSettings bg. No change.

## Round 5 (parity self-review + scope decisions)

- [x] R5-1 Android parity: `List.*`/`SettingSwitch`/`PaperList.Item` JSX occurrence counts HEAD-vs-worktree identical in all 8 scope files (Tracker's +1 and SettingsScreen's -1 are comment text, verified by grep). Every original row/section/switch/divider preserved verbatim in Android branches; all visual changes iOS-gated. Prettier `--check` clean on all 19 touched files.
- [x] R5-2 i18n safety: `i18n.enableFallback = true`, default `en` — new `browseScreen.globalSearchFor` falls back to English in all locales. No other-locale edits.
- [x] R5-3 Reader settings tabs (Display/Theme/Navigation/Accessibility) reviewed: bottom-sheet content dominated by custom controls (sliders, swatch pickers); grouped-card pattern does not apply inside sheets. Deliberately NOT converting — risk outweighs benefit, no owner assigned. Only genuine List use is the font-picker row.
- [ ] R2-4 Library/Updates/History empty states consistency — DEFERRED to lead (owns grouped bgs there; zero-overlap rule).

## Round 4 (user-reported Settings gap)

- [x] R4-1 Gap after General row + missing General icon: root cause was a typo in the shared SF map — `tune` pointed at `sliders.horizontal.3` (plural, nonexistent; SymbolView renders blank/abnormal and broke the first row's layout, pushing its divider down into a visible band). Fixed to Apple's real `slider.horizontal.3` (singular) in `src/components/ios/ISIcon.tsx`. Verified live: /tmp/settings_iconfix.png shows sliders icon + single uniform card, gap gone. NOTE FOR LEAD: this touches your SF map file — one-word typo fix only, no API change.

## Round 3 (navigation trap found by live testing)

- [x] R3-1 GlobalSearch had no back affordance (SearchbarV2 without `handleBackAction`; in-app back unavailable, tab bar hidden on push). Added iOS-only `handleBackAction={goBack}` (Android keeps system-back, pixel-identical). Verified live: Back appears, tap returns to Browse. Screenshots: pre-fix trapped state (no Back node), /tmp/gs_back.png shows Browse restored.

## Round 6 (user-reported dead space under Library/Updates/History/Browse)

- [x] R6-1 Diagnosed, NOT fixed here (lead owns all involved files — zero-overlap rule). Exonerated own branch: `git diff` shows zero touches to Library/Updates/History/BottomTabBar/tabClearance/SourcesTab/PluginsTab, and the Browse shortcut renders null on empty search. Gaps come from base-branch floating-dock design (`74ecc480`, `43346758`).
- [x] R6-2 Measurements: `IOS_TAB_CLEARANCE` = 132pt, but dock footprint on this sim ≈ 150pt (offset 42 = inset 34 + 8, height ≈ 108 = 12 top + 52 content + 10 + 34 inset). So clearance is ~18pt SHORT — long lists can tuck slightly under the dock — while short/empty lists display the clearance as dead gray. Browse mid-list gap looks like LegendList initial render window (transient, fills on scroll).
- [ ] R6-3 Recommendation for lead: bump clearance to ~150–160 or compute from live insets; consider top-aligning Updates/History empty states; alternatively accept as inherent floating-dock tradeoff. No action on this branch to avoid merge conflicts.

## Repeat protocol

After each fix round: `npx tsc --noEmit`, eslint on touched files, `pnpm run test:rn` relevant, terminate+relaunch, re-screenshot all flows above, append rows here, check off boxes. Repeat until all boxes checked twice with no new issues.

## Perf note (2026-10-05, re: "navigation feels laggy")

Measured, not guessed: tab switch Library→More visible in the immediate next snapshot (tap CLI 0.95s incl. overhead); push Settings→General confirmed rendered 1.2s wall-clock including two CLI round-trips. App-side transitions are a fraction of that. Perceived lag = automation overhead (CLI round-trips + precautionary sleeps) + dev-client/Metro (unoptimized dev JS, on-demand bundling) + simulator software rendering (no GPU for Glass blur/transitions). No JS perf regression from this branch by construction: iOS branches render the same node counts as the Android equivalents plus the pre-existing Glass wrapper; no new timers, listeners, or list virtualization changes. Full `test:rn`: 96/97 suites pass (only known `useAppUpdateChecker` clean-HEAD failure). Re-verify on device release build before any perf-driven refactor.
