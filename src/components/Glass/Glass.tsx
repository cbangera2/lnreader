import React, { useMemo } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  GlassView,
  isLiquidGlassAvailable,
  type GlassStyle,
} from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

export type { GlassStyle };

export interface GlassProps extends ViewProps {
  glassEffectStyle?: GlassStyle;
  tintColor?: string;
  fallbackBackgroundColor?: string;
  isDark?: boolean;
  blurIntensity?: number;
}

const isIos = Platform.OS === 'ios';

const splitBackgroundColor = (
  style: StyleProp<ViewStyle>,
): { backgroundColor?: string; rest: StyleProp<ViewStyle> } => {
  const flat = StyleSheet.flatten(style) ?? {};
  const { backgroundColor, ...rest } = flat;
  return {
    backgroundColor: backgroundColor as string | undefined,
    rest,
  };
};

const Glass: React.FC<GlassProps> = ({
  children,
  style,
  glassEffectStyle = 'regular',
  tintColor,
  fallbackBackgroundColor,
  isDark = false,
  blurIntensity = 50,
  ...viewProps
}) => {
  const liquidGlass = useMemo(() => isIos && isLiquidGlassAvailable(), []);

  if (!isIos) {
    return (
      <View style={style} {...viewProps}>
        {children}
      </View>
    );
  }

  if (liquidGlass) {
    const { backgroundColor, rest } = splitBackgroundColor(style);
    return (
      <GlassView
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor ?? backgroundColor ?? fallbackBackgroundColor}
        colorScheme={isDark ? 'dark' : 'light'}
        style={rest}
        {...viewProps}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      tint={isDark ? 'dark' : 'light'}
      intensity={blurIntensity}
      style={[style, { backgroundColor: fallbackBackgroundColor }]}
      {...viewProps}
    >
      {children}
    </BlurView>
  );
};

export const isGlassActive = isIos;

export default React.memo(Glass);
