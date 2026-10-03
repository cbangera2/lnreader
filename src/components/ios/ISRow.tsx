import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { List, SwitchItem } from '@components';
import { ThemeColors } from '@theme/types';

import ISIcon from './ISIconCompat';

export type ISRowRight = 'chevron' | 'switch' | 'detail' | React.ReactNode;

export interface ISRowProps {
  title: string;
  description?: string | null;
  // Material icon name; rendered via ISIcon (SF Symbol on iOS).
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  right?: ISRowRight;
  // Required when right === 'switch'.
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  // Shown next to the detail disclosure when right === 'detail'.
  detail?: string;
  theme: ThemeColors;
}

const isIos = Platform.OS === 'ios';

const ISRowIOS: React.FC<ISRowProps> = ({
  title,
  description,
  icon,
  iconColor,
  onPress,
  disabled,
  destructive,
  right = 'chevron',
  switchValue = false,
  onSwitchChange,
  detail,
  theme,
}) => {
  const titleColor = destructive ? theme.error : theme.onSurface;

  const renderRight = () => {
    if (right === 'switch') {
      return (
        <Switch
          disabled={disabled}
          onValueChange={value => {
            onSwitchChange?.(value);
            onPress?.();
          }}
          trackColor={{ false: undefined, true: theme.primary }}
          value={switchValue}
        />
      );
    }
    if (right === 'detail') {
      return (
        <View style={styles.detailCtn}>
          {detail ? (
            <Text style={[styles.detail, { color: theme.onSurfaceVariant }]}>
              {detail}
            </Text>
          ) : null}
          <ISIcon
            name="information-outline"
            size={22}
            color={theme.onSurfaceVariant}
          />
        </View>
      );
    }
    if (right === 'chevron') {
      return (
        <ISIcon name="chevron-right" size={20} color={theme.onSurfaceVariant} />
      );
    }
    return <>{right}</>;
  };

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole={
        right === 'switch' ? 'switch' : onPress ? 'button' : undefined
      }
      accessibilityState={
        right === 'switch' ? { checked: switchValue } : undefined
      }
      disabled={disabled || (!onPress && right !== 'switch')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {icon ? (
        <ISIcon
          name={icon}
          size={22}
          color={iconColor ?? (destructive ? theme.error : theme.primary)}
        />
      ) : null}
      <View style={styles.textCtn}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: disabled ? theme.onSurfaceDisabled : titleColor },
          ]}
        >
          {title}
        </Text>
        {description ? (
          <Text
            numberOfLines={2}
            style={[
              styles.description,
              {
                color: disabled
                  ? theme.onSurfaceDisabled
                  : theme.onSurfaceVariant,
              },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {renderRight()}
    </Pressable>
  );
};

// Android: delegate to the existing shared components, zero visual change.
// right mapping: 'chevron' -> 'chevron-right', 'detail' -> info icon with
// detail text as description, 'switch' -> SwitchItem, node -> dropped
// (List.Item only takes an icon name). destructive is iOS-only.
const ISRow: React.FC<ISRowProps> = props => {
  const {
    title,
    description,
    icon,
    onPress,
    disabled,
    right = 'chevron',
    switchValue = false,
    onSwitchChange,
    detail,
    theme,
  } = props;

  if (isIos) {
    return <ISRowIOS {...props} />;
  }

  if (right === 'switch') {
    return (
      <SwitchItem
        description={description ?? undefined}
        label={title}
        onPress={() => {
          onSwitchChange?.(!switchValue);
          onPress?.();
        }}
        theme={theme}
        value={switchValue}
      />
    );
  }

  if (right === 'detail') {
    return (
      <List.Item
        description={detail ?? description}
        disabled={disabled}
        icon={icon}
        onPress={onPress}
        right="information-outline"
        theme={theme}
        title={title}
      />
    );
  }

  return (
    <List.Item
      description={description}
      disabled={disabled}
      icon={icon}
      onPress={onPress}
      right={right === 'chevron' ? 'chevron-right' : undefined}
      theme={theme}
      title={title}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  textCtn: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  detailCtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  detail: {
    fontSize: 17,
    lineHeight: 22,
  },
});

export default ISRow;
