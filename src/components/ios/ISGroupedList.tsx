import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { List } from '@components';
import Glass from '@components/Glass/Glass';
import { ThemeColors } from '@theme/types';

export interface ISGroupedListProps {
  // Uppercase section header above the card.
  title?: string;
  // Footnote text below the card.
  footer?: string;
  children: React.ReactNode;
  theme: ThemeColors;
}

const isIos = Platform.OS === 'ios';

const Hairline: React.FC<{ theme: ThemeColors }> = ({ theme }) => (
  <View style={[styles.hairline, { backgroundColor: theme.outlineVariant }]} />
);

// iOS: inset-grouped table — 16px margins, 10pt continuous radius, hairline
// inset dividers between rows. Android: delegates to List.Section (plus
// List.InfoItem for the footer), zero visual change.
const ISGroupedList: React.FC<ISGroupedListProps> = ({
  title,
  footer,
  children,
  theme,
}) => {
  if (!isIos) {
    return (
      <List.Section theme={theme}>
        {title ? <List.SubHeader theme={theme}>{title}</List.SubHeader> : null}
        {children}
        {footer ? <List.InfoItem theme={theme} title={footer} /> : null}
      </List.Section>
    );
  }

  const backgroundColor = theme.surfaceContainerLow ?? theme.surface;
  const rows = React.Children.toArray(children);

  return (
    <View style={styles.wrapper}>
      {title ? (
        <Text style={[styles.header, { color: theme.onSurfaceVariant }]}>
          {title}
        </Text>
      ) : null}
      <Glass
        glassEffectStyle="regular"
        fallbackBackgroundColor={backgroundColor}
        isDark={theme.isDark}
        style={[styles.card, { backgroundColor }]}
      >
        {rows.map((child, index) => (
          <React.Fragment key={index}>
            {index > 0 ? <Hairline theme={theme} /> : null}
            {child}
          </React.Fragment>
        ))}
      </Glass>
      {footer ? (
        <Text style={[styles.footer, { color: theme.onSurfaceVariant }]}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  header: {
    fontSize: 13,
    marginBottom: 6,
    marginHorizontal: 32,
    textTransform: 'uppercase',
  },
  card: {
    borderCurve: 'continuous',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  footer: {
    fontSize: 13,
    lineHeight: 18,
    marginHorizontal: 32,
    marginTop: 6,
  },
});

export default ISGroupedList;
