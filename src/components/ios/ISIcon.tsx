import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';

// Cross-platform icon: Material icon names in, SF Symbols out on iOS.
// Android renders the Material icon unchanged (same size/color semantics).

export type ISIconWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export interface ISIconProps {
  // Material Design icon name (matches @type/icon MaterialDesignIconName).
  name: string;
  size?: number;
  color?: string;
  // iOS only: SF Symbol weight. Ignored on Android and by the fallback.
  weight?: ISIconWeight;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcon>['name'];

// Material -> SF Symbol. Only well-known, long-stable SF names are used here:
// SymbolView renders blank for unknown names, so when in doubt prefer leaving
// a name unmapped (falls back to the Material icon on iOS, never blank).
const MATERIAL_TO_SF: Record<string, string> = {
  // Tab bar
  'bookmark-box-multiple': 'books.vertical.fill',
  'alert-decagram-outline': 'bell.badge.fill',
  history: 'clock.arrow.circlepath',
  'compass-outline': 'safari',
  'dots-horizontal': 'ellipsis',
  circle: 'circle',
  // Headers / app bar / search
  'arrow-left': 'arrow.left',
  'arrow-right': 'arrow.right',
  'arrow-up': 'arrow.up',
  'arrow-down': 'arrow.down',
  'arrow-collapse-up': 'arrow.up.to.line',
  close: 'xmark',
  'dots-vertical': 'ellipsis',
  magnify: 'magnifyingglass',
  refresh: 'arrow.clockwise',
  reload: 'arrow.clockwise',
  earth: 'globe',
  'book-search': 'text.magnifyingglass',
  'book-search-outline': 'magnifyingglass',
  'filter-variant': 'line.3.horizontal.decrease.circle',
  tune: 'slider.horizontal.3',
  'select-all': 'checkmark.square.fill',
  'delete-sweep-outline': 'trash',
  'delete-sweep': 'trash',
  'chevron-left': 'chevron.left',
  'chevron-right': 'chevron.right',
  'chevron-up': 'chevron.up',
  'chevron-down': 'chevron.down',
  'chevron-double-left': 'chevron.left.2',
  'chevron-double-right': 'chevron.right.2',
  plus: 'plus',
  pin: 'pin',
  'pin-outline': 'pin',
  // Reader chrome
  bookmark: 'bookmark.fill',
  'bookmark-outline': 'bookmark',
  'format-list-bulleted': 'list.bullet',
  'cog-outline': 'gearshape',
  cog: 'gearshape.fill',
  // Novel detail actions + status
  heart: 'heart.fill',
  'heart-outline': 'heart',
  check: 'checkmark',
  sync: 'arrow.triangle.2.circlepath',
  'arrow-down-circle-outline': 'arrow.down.circle',
  'check-circle': 'checkmark.circle.fill',
  'check-all': 'checkmark.circle.fill',
  'check-outline': 'checkmark.circle',
  'clock-outline': 'clock',
  'pause-circle-outline': 'pause.circle',
  cancel: 'xmark.circle.fill',
  copyright: 'c.circle',
  'book-check-outline': 'book.closed.fill',
  'help-circle-outline': 'questionmark.circle',
  help: 'questionmark',
  'book-off-outline': 'eye.slash',
  sleep: 'moon.fill',
  'fountain-pen-tip': 'pencil',
  'palette-outline': 'paintpalette',
  'book-open-page-variant': 'book.fill',
  'book-open-page-variant-outline': 'book.fill',
  'book-open-outline': 'book.fill',
  'book-arrow-up-outline': 'arrow.up.doc.fill',
  'content-paste': 'doc.on.clipboard',
  'swap-vertical-variant': 'arrow.up.arrow.down',
  play: 'play.fill',
  pause: 'pause.fill',
  // Settings rows / misc
  bookshelf: 'books.vertical.fill',
  github: 'chevron.left.forwardslash.chevron.right',
  'code-braces': 'chevron.left.forwardslash.chevron.right',
  'code-tags': 'chevron.left.forwardslash.chevron.right',
  'language-javascript': 'chevron.left.forwardslash.chevron.right',
  'language-css3': 'chevron.left.forwardslash.chevron.right',
  'auto-fix': 'sparkles',
  'cloud-upload-outline': 'icloud.and.arrow.up',
  'cloud-off-outline': 'icloud.slash',
  'tag-multiple-outline': 'tag.fill',
  'label-outline': 'tag',
  glasses: 'glasses',
  incognito: 'eye.slash',
  'information-outline': 'info.circle',
  'chart-line': 'chart.line.uptrend.xyaxis',
  'progress-download': 'arrow.down.circle',
  'folder-download': 'folder.fill',
  'folder-outline': 'folder',
  'file-export-outline': 'square.and.arrow.up',
  'content-save': 'square.and.arrow.down',
  'content-save-outline': 'square.and.arrow.down',
  'file-import-outline': 'square.and.arrow.down',
  'download-outline': 'arrow.down.to.line',
  pencil: 'pencil',
  'pencil-outline': 'pencil',
  delete: 'trash',
  'delete-outline': 'trash',
  'trash-can-outline': 'trash',
  'content-copy': 'doc.on.doc',
  'open-in-new': 'arrow.up.right.square',
  'drag-horizontal-variant': 'line.3.horizontal',
  'checkbox-blank-outline': 'square',
  'checkbox-marked': 'checkmark.square.fill',
  'close-box': 'xmark.square.fill',
  'account-voice': 'speaker.wave.2.fill',
  'format-size': 'textformat.size',
  'format-color-text': 'textformat',
  'format-align-left': 'text.alignleft',
  'format-align-center': 'text.aligncenter',
  'format-align-right': 'text.alignright',
  'format-align-justify': 'text.justify',
  'gesture-swipe-horizontal': 'arrow.left.and.right',
  'puzzle-outline': 'puzzlepiece.fill',
  'source-repository': 'archivebox.fill',
};

type SymbolViewProps = {
  name: string;
  size?: number;
  tintColor?: string;
  weight?: ISIconWeight;
  style?: StyleProp<ViewStyle>;
};

type SymbolViewType = React.ComponentType<SymbolViewProps>;

let cachedSymbolView: SymbolViewType | null | undefined;

// expo-symbols is an optional install (see icon-inventory.md). The module id
// is indirected through a variable on purpose: Metro cannot statically
// resolve a non-literal require, so the bundle builds with or without the
// package installed; at runtime a missing package throws here and is caught,
// falling back to the Material icon.
const getSymbolView = (): SymbolViewType | null => {
  if (cachedSymbolView !== undefined) {
    return cachedSymbolView;
  }
  cachedSymbolView = null;
  if (Platform.OS !== 'ios') {
    return cachedSymbolView;
  }
  try {
    const moduleId = 'expo-symbols';
    const mod = require(moduleId) as { SymbolView?: SymbolViewType };
    if (mod?.SymbolView) {
      cachedSymbolView = mod.SymbolView;
    }
  } catch {
    cachedSymbolView = null;
  }
  return cachedSymbolView;
};

export const ISIcon: React.FC<ISIconProps> = ({
  name,
  size = 22,
  color,
  weight,
}) => {
  if (Platform.OS === 'ios') {
    const sfName = MATERIAL_TO_SF[name];
    const SymbolView = getSymbolView();
    if (sfName && SymbolView) {
      return (
        <SymbolView
          name={sfName}
          size={size}
          tintColor={color}
          weight={weight}
          style={{ width: size, height: size }}
        />
      );
    }
    // Graceful fallback: unmapped name or expo-symbols not installed yet.
    // Renders the Material icon exactly as Android does — never blank.
  }
  return (
    <MaterialIcon
      name={name as unknown as MaterialIconName}
      size={size}
      color={color}
    />
  );
};

export default ISIcon;

// Paper (v5) `icon` prop helper: SF Symbol on iOS via render fn, Material
// string on Android (pixel-identical). Pass the result straight to
// `icon={...}` on FAB / Button / IconButton / TextInput.Icon.
export const paperIcon = (
  name: string,
):
  | string
  | (({ color, size }: { color: string; size: number }) => React.ReactNode) =>
  Platform.OS === 'ios'
    ? ({ color, size }) => <ISIcon name={name} size={size} color={color} />
    : name;
