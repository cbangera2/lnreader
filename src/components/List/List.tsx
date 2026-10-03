import React, { ReactNode, useCallback } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { ISIcon } from '@components/ios/ISIcon';

import { List as PaperList, Divider as PaperDivider } from 'react-native-paper';
import Glass from '@components/Glass/Glass';
import { useTheme } from '@hooks/persisted';
import { ThemeColors } from '../../theme/types';
import { ColorInstance } from 'color';

interface ListItemProps {
  title: string;
  description?: string | null;
  icon?: string;
  onPress?: () => void;
  theme: ThemeColors;
  disabled?: boolean;
  right?: string;
}

const Section = ({
  children,
  theme: themeProp,
  style,
}: {
  children: ReactNode;
  theme?: ThemeColors;
  style?: StyleProp<ViewStyle>;
}) => {
  const hookTheme = useTheme();
  const theme = themeProp ?? hookTheme;
  const backgroundColor = theme?.surfaceContainerLow ?? theme?.surface;
  if (Platform.OS === 'ios') {
    return (
      <Glass
        glassEffectStyle="regular"
        fallbackBackgroundColor={backgroundColor}
        isDark={theme?.isDark ?? false}
        style={[
          styles.listSection,
          styles.sectionIOS,
          { backgroundColor },
          style,
        ]}
      >
        <PaperList.Section style={styles.listSection}>
          {children}
        </PaperList.Section>
      </Glass>
    );
  }
  return (
    <PaperList.Section style={[styles.listSection, style]}>
      {children}
    </PaperList.Section>
  );
};

const SubHeader = ({
  children,
  theme,
}: {
  children: ReactNode;
  theme: ThemeColors;
}) => (
  <PaperList.Subheader
    style={[
      Platform.select({ ios: styles.subHeaderIOS, default: undefined }),
      {
        color: Platform.OS === 'ios' ? theme.onSurfaceVariant : theme.primary,
      },
    ]}
  >
    {children}
  </PaperList.Subheader>
);

const Item: React.FC<ListItemProps> = ({
  title,
  description,
  icon,
  onPress,
  theme,
  disabled,
  right,
}) => {
  const left = useCallback(() => {
    if (icon) {
      return (
        <PaperList.Icon
          color={theme.primary}
          icon={icon}
          style={styles.iconCtn}
        />
      );
    }
  }, [icon, theme.primary]);
  const rightIcon = useCallback(() => {
    if (right) {
      return (
        <PaperList.Icon
          color={theme.primary}
          icon={right}
          style={styles.iconCtn}
        />
      );
    }
  }, [right, theme.primary]);
  return (
    <PaperList.Item
      title={title}
      titleStyle={{
        color: disabled ? theme.onSurfaceDisabled : theme.onSurface,
      }}
      description={description}
      descriptionStyle={[
        styles.description,
        {
          color: disabled ? theme.onSurfaceDisabled : theme.onSurfaceVariant,
        },
      ]}
      left={left}
      right={rightIcon}
      disabled={disabled}
      onPress={onPress}
      rippleColor={theme.rippleColor}
      style={[
        styles.listItemCtn,
        onPress && !disabled ? styles.listItemTappable : undefined,
      ]}
    />
  );
};

const Divider = ({ theme }: { theme: ThemeColors }) => (
  <PaperDivider
    style={[styles.divider, { backgroundColor: theme.outlineVariant }]}
  />
);

const InfoItem = ({
  title,
  theme,
  style,
}: {
  title: string;
  icon?: string;
  theme: ThemeColors;
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.infoCtn, style]}>
    <ISIcon size={20} color={theme.primary} name={'information-outline'} />
    <Text style={[styles.infoMsg, { color: theme.onSurfaceVariant }]}>
      {title}
    </Text>
  </View>
);

const Icon = ({ icon, theme }: { icon: string; theme: ThemeColors }) => (
  <PaperList.Icon color={theme.primary} icon={icon} style={styles.margin0} />
);

interface ColorItemProps {
  title: string;
  color: ColorInstance;
  theme: ThemeColors;
  onPress: () => void;
}

const ColorItem = ({ title, color, theme, onPress }: ColorItemProps) => (
  <Pressable
    style={styles.pressable}
    android_ripple={{ color: theme.rippleColor }}
    onPress={onPress}
  >
    <View>
      <Text style={[{ color: theme.onSurface }, styles.fontSize16]}>
        {title}
      </Text>
      <Text style={{ color: theme.onSurfaceVariant }}>
        {color.rgb().toString().toUpperCase()}
      </Text>
    </View>
    <View
      style={[
        {
          backgroundColor: color.hex(),
        },
        styles.descriptionView,
      ]}
    />
  </Pressable>
);

export default {
  Section,
  SubHeader,
  Item,
  Divider,
  InfoItem,
  Icon,
  ColorItem,
};

const styles = StyleSheet.create({
  margin0: { margin: 0 },
  fontSize16: {
    fontSize: 16,
  },
  descriptionView: {
    height: 24,
    width: 24,
    borderRadius: 50,
    marginEnd: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    ...Platform.select({
      ios: { marginLeft: 16 },
      default: {},
    }),
  },
  iconCtn: {
    paddingStart: 16,
  },
  infoCtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoMsg: {
    fontSize: 12,
    marginTop: 12,
  },
  listItemCtn: {
    paddingVertical: 12,
  },
  listItemTappable: {
    ...Platform.select({
      ios: { minHeight: 44 },
      default: {},
    }),
  },
  listSection: {
    flex: 1,
    marginVertical: 0,
  },
  sectionIOS: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  subHeaderIOS: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
  pressable: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
