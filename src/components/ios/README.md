# iOS design-system primitives (`@components/ios`)

Platform-gated iOS primitives. Every primitive renders the native iOS look on
iOS and **delegates to the existing shared components on Android** (zero
visual change there — no duplicated Android UI). Screens adopt them without
forking behavior per platform.

> `ISIcon` (SF Symbols, Material-name input) is owned by a sibling agent and
> lives at `./ISIcon`. Primitives resolve it via the internal
> `ISIconCompat.tsx` shim (default ?? named ?? Material fallback) so the kit
> works before and after consolidation. Do not import the shim directly from
> screens; use the barrel (`src/components/ios/index.ts`).

## ISNavBar

Static large-title navigation bar. iOS only — renders `null` on Android.

| Prop      | Type               | Notes                                                                                               |
| --------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `title`   | `string`           | 34pt bold static title row (no collapse-on-scroll)                                                  |
| `onBack`  | `() => void`       | Optional; 44pt `chevron-left` button (via ISIcon)                                                   |
| `actions` | `ISNavBarAction[]` | Right-side 44pt icon buttons (`{ name, onPress, accessibilityLabel? }`; Material `name` via ISIcon) |
| `theme`   | `ThemeColors`      | Required                                                                                            |

Glass background (`regular`, ~0.85 translucent fallback). Screens keep their
`Appbar` on Android; hide it on iOS when using `ISNavBar`:

```tsx
{Platform.OS === 'ios' ? <ISNavBar ... /> : <Appbar ... />}
```

Adopt in: detail/push screens with a custom header — `NovelScreen`,
`SourceNovels`, `PluginDetailsScreen`, `Migration`/`MigrationNovels`,
`DownloadsScreen`, `TaskQueueScreen`, `About`, settings sub-screens
(`SettingsTrackerScreen`, `SettingsAdvancedScreen`,
`SettingsTaxonomyScreen`).

## ISGroupedList + ISRow

Inset-grouped table (`List.Section` / `List.Item` counterparts).

`ISGroupedList` props: `title?` (uppercase section header), `footer?`
(footnote), `children` (ISRow elements), `theme`. iOS: 16px margins, 10pt
continuous radius, hairline inset (16px) dividers auto-inserted between rows,
glass card. Android: delegates to `List.Section` (+ `List.SubHeader`,
`List.InfoItem` for the footer).

`ISRow` props mirror `List.Item`, plus:

| Prop                               | Type                                             | Notes                                                  |
| ---------------------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| `title`                            | `string`                                         |                                                        |
| `description?`                     | `string \| null`                                 |                                                        |
| `icon?`                            | `string`                                         | Material name via ISIcon                               |
| `iconColor?`                       | `string`                                         | iOS only                                               |
| `onPress?`                         | `() => void`                                     |                                                        |
| `disabled?`                        | `boolean`                                        |                                                        |
| `destructive?`                     | `boolean`                                        | iOS only: red title/icon                               |
| `right?`                           | `'chevron' \| 'switch' \| 'detail' \| ReactNode` | 44pt rows, gray chevron, pressed opacity (iOS)         |
| `switchValue?` / `onSwitchChange?` | `boolean` / `(v) => void`                        | Required when `right === 'switch'`                     |
| `detail?`                          | `string`                                         | Text beside the ⓘ disclosure when `right === 'detail'` |
| `theme`                            | `ThemeColors`                                    | Required                                               |

Android `right` mapping: `'chevron'` → `'chevron-right'` icon;
`'switch'` → `SwitchItem`; `'detail'` → info icon with `detail` as
description; custom nodes are dropped (`List.Item` only takes an icon name).
`destructive` is iOS-only.

Adopt in: `SettingsScreen`, `SettingsReaderScreen`, `SettingsTrackerScreen`,
`SettingsAdvancedScreen`, `SettingsTaxonomyScreen`, `MoreScreen`, `About`,
`DownloadsScreen` (settings-style lists).

## ISActionSheet

Native-style action sheet. Props: `visible`, `onDismiss`, `title?`,
`message?`, `actions: [{ label, tone?, onPress }]`, `theme`.
Tones: `'default'` (blue) | `'destructive'` (red) | `'cancel'` (separate
bottom card, semibold). iOS: bottom card stack, 13pt centered title/message,
20pt centered 50pt-min rows, full-bleed hairlines, backdrop dismiss.
Android: delegates to the `Dialog` path (`Dialog.Root` + `Dialog.Action`,
destructive → `danger` tone), unchanged visuals.

Adopt in: destructive/choice confirmations currently using
`ConfirmationDialog` — `ClearHistoryDialog`, `RemoveHistoryDialog`,
`RemoveDownloadsDialog`, `DeleteCategoryModal`, `TaskQueueScreen` dialogs,
`SettingsAdvancedScreen` / `SettingsTaxonomyScreen` confirms,
`PluginDetailsScreen` uninstall confirm.

## ISSegmented

Thin wrapper over the shared `SegmentedControl` (already iOS-styled on iOS).
Only iOS-first default: `showCheckIcon` defaults to `false` on iOS (native
segmented controls show labels/icons only) and `true` elsewhere. All other
props pass through (`options`, `value`, `onChange`, `theme`, `showLabels`).
Types re-exported as `ISSegmentedOption` / `ISSegmentedProps`.

Adopt in: `ThemeSelectionStep` (onboarding) and any filter/sort toggles that
want the iOS-conventional label-only segments.
