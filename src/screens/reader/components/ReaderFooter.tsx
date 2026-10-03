import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import color from 'color';
import Animated, {
  Easing,
  ReduceMotion,
  withTiming,
} from 'react-native-reanimated';
import { useChapterContext } from '../ChapterContext';
import { useTheme } from '@hooks/persisted';
import { useNovelLayout } from '@screens/novel/NovelContext';
import { iosSelection } from '@utils/haptics';
import Glass from '@components/Glass/Glass';

interface ChapterFooterProps {
  openReaderSheet: () => void;
  scrollToStart: () => void;
  openDrawer: () => void;
}

const fastOutSlowIn = Easing.bezier(0.4, 0.0, 0.2, 1.0);

const isIos = Platform.OS === 'ios';

const createEntering = (navigationBarHeight: number) => () => {
  'worklet';
  const animations = {
    transform: [
      {
        translateY: withTiming(0, {
          duration: 250,
          easing: fastOutSlowIn,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
    opacity: withTiming(1, { duration: 150 }),
  };
  const initialValues = {
    transform: [{ translateY: 64 + navigationBarHeight }],
    opacity: 0,
  };
  return { initialValues, animations };
};

const createExiting = (navigationBarHeight: number) => () => {
  'worklet';
  const animations = {
    transform: [
      {
        translateY: withTiming(64 + navigationBarHeight, {
          duration: 250,
          easing: fastOutSlowIn,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
    opacity: withTiming(0, { duration: 150 }),
  };
  const initialValues = {
    transform: [{ translateY: 0 }],
    opacity: 1,
  };
  return { initialValues, animations };
};

const ChapterFooter = ({
  openReaderSheet,
  scrollToStart,
  openDrawer,
}: ChapterFooterProps) => {
  const { nextChapter, prevChapter, navigateChapter } = useChapterContext();
  const theme = useTheme();
  const rippleConfig = {
    color: theme.rippleColor,
    borderless: true,
    radius: 50,
  };
  const { navigationBarHeight } = useNovelLayout();

  const iosTranslucentSurface = useMemo(
    () => color(theme.surface).alpha(0.8).string(),
    [theme.surface],
  );

  const style = useMemo(
    () => [
      {
        backgroundColor: isIos
          ? iosTranslucentSurface
          : color(theme.surface).alpha(0.9).string(),
        paddingBottom: navigationBarHeight,
      },
    ],
    [iosTranslucentSurface, theme.surface, navigationBarHeight],
  );

  const entering = useMemo(
    () => createEntering(navigationBarHeight),
    [navigationBarHeight],
  );
  const exiting = useMemo(
    () => createExiting(navigationBarHeight),
    [navigationBarHeight],
  );

  return (
    <Animated.View entering={entering} exiting={exiting} style={styles.footer}>
      <Glass
        glassEffectStyle="regular"
        fallbackBackgroundColor={iosTranslucentSurface}
        isDark={theme.isDark}
        style={style}
      >
        <View style={styles.buttonsContainer}>
          <Pressable
            android_ripple={rippleConfig}
            style={styles.buttonStyles}
            onPress={() => {
              iosSelection();
              navigateChapter('PREV');
            }}
          >
            <IconButton
              icon="chevron-left"
              size={26}
              disabled={!prevChapter}
              iconColor={theme.onSurface}
            />
          </Pressable>
          <Pressable
            android_ripple={rippleConfig}
            style={styles.buttonStyles}
            onPress={() => scrollToStart()}
          >
            <IconButton
              icon="arrow-collapse-up"
              size={26}
              iconColor={theme.onSurface}
            />
          </Pressable>
          <Pressable
            android_ripple={rippleConfig}
            style={styles.buttonStyles}
            onPress={() => openDrawer()}
          >
            <IconButton
              icon="format-list-bulleted"
              size={26}
              iconColor={theme.onSurface}
            />
          </Pressable>
          <Pressable
            android_ripple={rippleConfig}
            style={styles.buttonStyles}
            onPress={openReaderSheet}
          >
            <IconButton
              icon="cog-outline"
              size={26}
              iconColor={theme.onSurface}
            />
          </Pressable>
          <Pressable
            android_ripple={rippleConfig}
            style={styles.buttonStyles}
            onPress={() => {
              iosSelection();
              navigateChapter('NEXT');
            }}
          >
            <IconButton
              icon="chevron-right"
              size={26}
              disabled={!nextChapter}
              iconColor={theme.onSurface}
            />
          </Pressable>
        </View>
      </Glass>
    </Animated.View>
  );
};

export default React.memo(ChapterFooter);

const styles = StyleSheet.create({
  buttonStyles: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 4,
    paddingVertical: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  footer: {
    bottom: 0,
    flex: 1,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
});
