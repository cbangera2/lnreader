import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from 'color';

import Glass from '@components/Glass/Glass';
import { ThemeColors } from '@theme/types';

import ISIcon from './ISIconCompat';

export interface ISNavBarAction {
  // Material icon name; rendered via ISIcon (SF Symbol on iOS).
  name: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface ISNavBarProps {
  title: string;
  onBack?: () => void;
  actions?: ISNavBarAction[];
  theme: ThemeColors;
}

const isIos = Platform.OS === 'ios';

// iOS: static large-title bar (34pt bold) over a glass background with a 44pt
// back chevron and 44pt right-side actions. No collapsing-on-scroll.
// Android: renders nothing; screens keep their existing Appbar. Adopting
// screens should hide their Appbar on iOS when using ISNavBar, e.g.
//   {Platform.OS === 'ios' ? <ISNavBar ... /> : <Appbar ... />}
const ISNavBar: React.FC<ISNavBarProps> = ({
  title,
  onBack,
  actions = [],
  theme,
}) => {
  const insets = useSafeAreaInsets();

  if (!isIos) {
    return null;
  }

  const backgroundColor = theme.surfaceContainerLow ?? theme.surface;
  const fallbackBackgroundColor = Color(backgroundColor).alpha(0.85).string();

  return (
    <Glass
      glassEffectStyle="regular"
      fallbackBackgroundColor={fallbackBackgroundColor}
      isDark={theme.isDark}
      style={[styles.bar, { backgroundColor }]}
    >
      <View style={{ height: insets.top }} />
      <View style={styles.toolbar}>
        <View style={styles.side}>
          {onBack ? (
            <Pressable
              accessibilityLabel="Back"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onBack}
              style={({ pressed }) => [
                styles.touchTarget,
                pressed && styles.pressed,
              ]}
            >
              <ISIcon name="chevron-left" size={30} color={theme.primary} />
            </Pressable>
          ) : null}
        </View>
        <View style={[styles.side, styles.actions]}>
          {actions.map(action => (
            <Pressable
              key={action.accessibilityLabel ?? action.name}
              accessibilityLabel={action.accessibilityLabel ?? action.name}
              accessibilityRole="button"
              hitSlop={8}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.touchTarget,
                pressed && styles.pressed,
              ]}
            >
              <ISIcon name={action.name} size={22} color={theme.primary} />
            </Pressable>
          ))}
        </View>
      </View>
      <Text
        accessibilityRole="header"
        numberOfLines={1}
        style={[styles.title, { color: theme.onSurface }]}
      >
        {title}
      </Text>
    </Glass>
  );
};

const styles = StyleSheet.create({
  bar: {
    paddingBottom: 8,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 44,
  },
  actions: {
    justifyContent: 'flex-end',
  },
  touchTarget: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.4,
    lineHeight: 41,
    paddingHorizontal: 16,
  },
});

export default ISNavBar;
