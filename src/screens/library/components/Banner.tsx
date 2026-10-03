import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { ThemeColors } from '../../../theme/types';
import { MaterialDesignIconName } from '@type/icon';

interface Props {
  label: string;
  icon?: MaterialDesignIconName;
  backgroundColor?: string;
  textColor?: string;
  theme: ThemeColors;
}

export const Banner: React.FC<Props> = ({
  label,
  icon,
  theme,
  backgroundColor = theme.primary,
  textColor = theme.onPrimary,
}) => (
  <View style={[{ backgroundColor }, styles.container]}>
    {icon ? (
      <MaterialCommunityIcons
        name={icon}
        color={textColor}
        size={18}
        style={styles.icon}
      />
    ) : null}
    <Text style={[{ color: textColor }, styles.bannerText]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  bannerText: {
    fontSize: 12,
    fontWeight: '500',
    ...Platform.select({
      ios: { fontSize: 13, fontWeight: '600' },
      default: {},
    }),
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    marginRight: 8,
  },
});
