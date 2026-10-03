import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import Color from 'color';

import { ThemeColors } from '../../theme/types';
import { MaterialDesignIconName } from '@type/icon';
import { Pressable } from 'react-native-gesture-handler';
import { PressableEvent } from 'react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps';

import ISIcon from '../ios/ISIconCompat';

type Props = {
  accessibilityLabel?: string;
  name: MaterialDesignIconName;
  color?: string;
  size?: number;
  disabled?: boolean;
  padding?: number;
  onPress?: (event: PressableEvent) => void;
  onPressIn?: (event: PressableEvent) => void;
  theme: ThemeColors;
  style?: ViewStyle;
};

const IconButton: React.FC<Props> = ({
  accessibilityLabel,
  name,
  color,
  size = 24,
  padding = 8,
  onPress,
  onPressIn,
  disabled,
  theme,
  style,
}) => {
  const iconColor = disabled
    ? Color(theme.onSurface).alpha(0.38).string()
    : color || theme.onSurface;
  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.pressable,
          { padding },
          Platform.OS === 'ios' && pressed && styles.pressed,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        disabled={disabled}
        android_ripple={
          onPress || onPressIn
            ? { color: Color(theme.primary).alpha(0.12).string() }
            : undefined
        }
      >
        {Platform.OS === 'ios' ? (
          <ISIcon name={name} size={size} color={iconColor} />
        ) : (
          <MaterialCommunityIcons name={name} size={size} color={iconColor} />
        )}
      </Pressable>
    </View>
  );
};

export default React.memo(IconButton);

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  pressable: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
});
