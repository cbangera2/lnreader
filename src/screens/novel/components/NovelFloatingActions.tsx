import { memo, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import color from 'color';
import { ThemeColors } from '@theme/types';

interface NovelFloatingActionsProps {
  bottomInset: number;
  continueLabel: string;
  isContinueExtended: boolean;
  loading: boolean;
  onContinue: () => void;
  onScrollToTop: () => void;
  showContinue: boolean;
  showScrollToTop: boolean;
  theme: ThemeColors;
}

const NovelFloatingActions = ({
  bottomInset,
  continueLabel,
  isContinueExtended,
  loading,
  onContinue,
  onScrollToTop,
  showContinue,
  showScrollToTop,
  theme,
}: NovelFloatingActionsProps) => {
  const scrollToTopStyle = useMemo(
    () => [
      styles.scrollToTop,
      {
        backgroundColor: theme.surface2,
        marginBottom: bottomInset,
        ...Platform.select({
          ios: {
            backgroundColor: color(theme.surface2).alpha(0.72).string(),
            borderColor: color(theme.primary).alpha(0.4).string(),
            borderWidth: StyleSheet.hairlineWidth,
          },
          default: {},
        }),
      },
    ],
    [bottomInset, theme.surface2, theme.primary],
  );
  const continueStyle = useMemo(
    () => [
      styles.continue,
      {
        backgroundColor: theme.primary,
        marginBottom: bottomInset,
        ...Platform.select({
          ios: {
            backgroundColor: color(theme.primary).alpha(0.72).string(),
            borderColor: color(theme.onPrimary).alpha(0.4).string(),
            borderWidth: StyleSheet.hairlineWidth,
          },
          default: {},
        }),
      },
    ],
    [bottomInset, theme.onPrimary, theme.primary],
  );

  return (
    <>
      {showScrollToTop ? (
        <AnimatedFAB
          style={scrollToTopStyle}
          color={theme.primary}
          icon="arrow-up"
          label=""
          extended={false}
          onPress={onScrollToTop}
          visible
        />
      ) : null}
      {showContinue ? (
        <AnimatedFAB
          style={continueStyle}
          extended={isContinueExtended && !loading}
          color={theme.onPrimary}
          uppercase={false}
          label={continueLabel}
          icon="play"
          onPress={onContinue}
        />
      ) : null}
    </>
  );
};

export default memo(NovelFloatingActions);

const styles = StyleSheet.create({
  continue: {
    bottom: 16,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
  scrollToTop: {
    bottom: 16,
    position: 'absolute',
  },
});
