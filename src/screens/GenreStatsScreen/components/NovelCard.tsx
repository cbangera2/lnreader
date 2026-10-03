import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import NovelCoverImage from '@components/NovelCoverImage';
import type { ThemeColors } from '@theme/types';

interface NovelCardProps {
  novel: { id: number; name: string; cover: string | null; pluginId: string };
  theme: ThemeColors;
  onPress: () => void;
}

const NovelCard: React.FC<NovelCardProps> = React.memo(
  ({ novel, theme, onPress }) => {
    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={`${novel.name}, novel`}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.card,
          Platform.OS === 'ios' && pressed && styles.pressed,
        ]}
      >
        <NovelCoverImage
          uri={novel.cover}
          theme={theme}
          iconSize={20}
          style={styles.cover}
          contentFit="cover"
        />
        <Text
          style={[styles.title, { color: theme.onSurface }]}
          numberOfLines={2}
        >
          {novel.name}
        </Text>
      </Pressable>
    );
  },
  (prev, next) => prev.novel.id === next.novel.id,
);

const styles = StyleSheet.create({
  card: {
    width: 80,
    marginRight: 16,
  },
  cover: {
    width: 80,
    aspectRatio: 2 / 3,
    ...Platform.select({
      ios: { borderCurve: 'continuous', borderRadius: 12 },
      default: { borderRadius: 4 },
    }),
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default NovelCard;
