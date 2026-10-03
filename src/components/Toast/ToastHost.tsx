import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import Glass from '@components/Glass/Glass';
import { useTheme } from '@hooks/persisted/useTheme';

import { subscribeToast } from './toastBus';

const TOAST_DURATION_MS = 2500;

// MD3 inverse-surface approximations. Glass uses these as the Liquid Glass
// tint and as the blur fallback on iOS versions without Liquid Glass. The
// pill and its text are always inverse-paired, so contrast holds regardless
// of the active theme.
const IOS_LIGHT_PILL = 'rgba(30, 27, 32, 0.82)';
const IOS_DARK_PILL = 'rgba(231, 224, 231, 0.82)';
const IOS_LIGHT_TEXT = '#FFFFFF';
const IOS_DARK_TEXT = '#1D1B20';

const IosToastPill = ({ message }: { message: string }) => {
  const { isDark } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={styles.iosWrapper}
      pointerEvents="none"
    >
      <Glass
        glassEffectStyle="clear"
        fallbackBackgroundColor={isDark ? IOS_DARK_PILL : IOS_LIGHT_PILL}
        isDark={isDark}
        style={[
          styles.iosPill,
          { backgroundColor: isDark ? IOS_DARK_PILL : IOS_LIGHT_PILL },
        ]}
      >
        <Text
          style={[
            styles.iosText,
            { color: isDark ? IOS_DARK_TEXT : IOS_LIGHT_TEXT },
          ]}
        >
          {message}
        </Text>
      </Glass>
    </Animated.View>
  );
};

export const ToastHost = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribeToast(text => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setMessage(text);
      setVisible(true);
      timer.current = setTimeout(() => setVisible(false), TOAST_DURATION_MS);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  if (Platform.OS === 'ios') {
    return (
      <Portal>
        {visible && message ? <IosToastPill message={message} /> : null}
      </Portal>
    );
  }

  return (
    <Portal>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {message}
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  iosWrapper: {
    alignItems: 'center',
    bottom: 48,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  iosPill: {
    borderRadius: 24,
    maxWidth: '90%',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iosText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
