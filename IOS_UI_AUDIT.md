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

## Round 1 findings → fixes

- [x] R1-1 Reader top bar safe-area: verified edge-to-edge Glass by design, time legible; footer pads nav inset. No change.
- [x] R1-2 Browse rows: verified 64pt rows w/ hairlines, Latest + pin uncrowded. Keep.
- [x] R1-3 Source grid bottom padding: verified last row + Filter FAB clear (push screen, no dock). Keep.
- [x] R1-4 Novel chapter rows: verified 44pt+, download icons, Start reading CTA. Keep.
- [x] R1-5 Global search: verified keyboard + grouped results + inline 422. Keep.
- [x] R1-6 Import hygiene (CODE RULES): `ISIcon` via barrel `@components/ios` in `BrowseSourceScreen.tsx`, `FilterBottomSheet.tsx`, `ReaderFooter.tsx`. tsc+eslint clean, app re-verified live.

## Round 2 (next pass — needs second screenshot loop)

- [ ] Central Browse: search submit falls back to Global Search when no local match
- [ ] Reader: confirm light-mode contrast of chrome bars
- [ ] Library/Updates/History empty states consistency (lead owns grouped bgs — coordinate, do not overlap)
- [ ] Novel header: collapse duplicate status lines on small widths

## Repeat protocol

After each fix round: `npx tsc --noEmit`, eslint on touched files, `pnpm run test:rn` relevant, terminate+relaunch, re-screenshot all flows above, append rows here, check off boxes. Repeat until all boxes checked twice with no new issues.
