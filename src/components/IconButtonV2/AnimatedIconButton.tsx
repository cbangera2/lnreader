import React from 'react';
import { Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import Color from 'color';

import { ThemeColors } from '../../theme/types';
import { MaterialDesignIconName } from '@type/icon';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import ISIcon from '../ios/ISIconCompat';

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

type Props = {
  name: MaterialDesignIconName;
  color?: string;
  size?: number;
  disabled?: boolean;
  padding?: number;
  onPress?: () => void;
  theme: ThemeColors;
  style?: ViewStyle;
  rotation?: SharedValue<number>;
  scale?: SharedValue<number>;
};

const AnimatedIconButton: React.FC<Props> = ({
  name,
  color,
  size = 24,
  padding = 8,
  onPress,
  disabled,
  theme,
  style,
  rotation,
  scale: _scale,
}) => {
  const IconStyle = useAnimatedStyle(() => {
    const rotate = rotation
      ? withTiming(rotation.value + 'deg', { duration: 250 })
      : '0deg';
    const scale = _scale ? withTiming(_scale.value, { duration: 250 }) : 1;
    return {
      textAlign: 'center',
      transform: [
        {
          rotate,
        },
        {
          scale,
        },
      ],
    };
  });
  // iOS wraps the SF Symbol in an animated host view: ISIcon takes no style
  // prop, and the rotation/scale transform is visually identical on the
  // wrapper. Android keeps the original animated Material icon untouched.
  const IconWrapperStyle = useAnimatedStyle(() => {
    const rotate = rotation
      ? withTiming(rotation.value + 'deg', { duration: 250 })
      : '0deg';
    const scale = _scale ? withTiming(_scale.value, { duration: 250 }) : 1;
    return {
      transform: [
        {
          rotate,
        },
        {
          scale,
        },
      ],
    };
  });
  const iconColor = disabled ? theme.outline : color || theme.onSurface;
  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          { padding },
          Platform.OS === 'ios' && pressed && styles.pressed,
        ]}
        onPress={onPress}
        disabled={disabled}
        android_ripple={
          onPress
            ? { color: Color(theme.primary).alpha(0.12).string() }
            : undefined
        }
      >
        {Platform.OS === 'ios' ? (
          <Animated.View style={IconWrapperStyle}>
            <ISIcon name={name} size={size} color={iconColor} />
          </Animated.View>
        ) : (
          <AnimatedIcon
            name={name}
            size={size}
            color={iconColor}
            style={IconStyle}
          />
        )}
      </Pressable>
    </View>
  );
};
export default React.memo(AnimatedIconButton);

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  container: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  pressable: {
    padding: 8,
  },
});
