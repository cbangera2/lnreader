import { useCallback, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  TabBar,
  TabBarItem,
  type Route,
  type TabBarItemProps,
  type TabBarProps,
} from 'react-native-tab-view';

import { useTheme } from '@hooks/persisted';
import Glass from '@components/Glass/Glass';

const renderNullIndicator = () => null;

const TopTabBar = <T extends Route>({
  indicatorStyle,
  style,
  activeColor,
  inactiveColor,
  renderIndicator,
  renderTabBarItem,
  gap,
  ...props
}: TabBarProps<T>) => {
  const theme = useTheme();
  const isIos = Platform.OS === 'ios';

  const iosBarStyle = useMemo(
    () => ({
      backgroundColor: theme.surfaceVariant,
      borderBottomWidth: 0,
      borderRadius: 8,
      elevation: 0,
      padding: 2,
      shadowOpacity: 0,
    }),
    [theme.surfaceVariant],
  );

  const iosSelectedTabStyle = useMemo(
    () => ({
      backgroundColor: theme.surface,
      borderRadius: 7,
    }),
    [theme.surface],
  );

  const iosTransparentBarStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    }),
    [],
  );

  const renderIosTabBarItem = useCallback(
    ({
      key,
      style: itemStyle,
      labelStyle: itemLabelStyle,
      ...itemProps
    }: TabBarItemProps<T> & { key: string }) => {
      const tabIndex = itemProps.navigationState.routes.indexOf(
        itemProps.route,
      );
      const focused = itemProps.navigationState.index === tabIndex;
      return (
        <TabBarItem
          key={key}
          {...itemProps}
          labelStyle={[itemLabelStyle, styles.iosLabel]}
          style={[itemStyle, focused ? iosSelectedTabStyle : undefined]}
        />
      );
    },
    [iosSelectedTabStyle],
  );

  const tabBar = (
    <TabBar
      {...props}
      gap={isIos ? 0 : gap}
      renderIndicator={
        isIos ? renderIndicator ?? renderNullIndicator : renderIndicator
      }
      renderTabBarItem={
        isIos ? renderTabBarItem ?? renderIosTabBarItem : renderTabBarItem
      }
      indicatorStyle={
        isIos ? indicatorStyle : [styles.primaryIndicator, indicatorStyle]
      }
      style={isIos ? iosTransparentBarStyle : style}
      activeColor={isIos ? theme.onSurface : activeColor}
      inactiveColor={isIos ? theme.onSurfaceVariant : inactiveColor}
    />
  );

  if (isIos) {
    return (
      <Glass
        glassEffectStyle="regular"
        fallbackBackgroundColor={theme.surfaceVariant}
        isDark={theme.isDark}
        style={[style, iosBarStyle]}
      >
        {tabBar}
      </Glass>
    );
  }

  return tabBar;
};

const styles = StyleSheet.create({
  primaryIndicator: {
    width: '60%',
    height: 3,
    marginHorizontal: 'auto',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  iosLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default TopTabBar;
