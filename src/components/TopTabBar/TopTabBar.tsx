import { Platform, StyleSheet } from 'react-native';
import { TabBar, type Route, type TabBarProps } from 'react-native-tab-view';

const TopTabBar = <T extends Route>({
  indicatorStyle,
  ...props
}: TabBarProps<T>) => (
  <TabBar
    {...props}
    indicatorStyle={[
      styles.primaryIndicator,
      Platform.OS === 'ios' && styles.iosIndicator,
      indicatorStyle,
    ]}
  />
);

const styles = StyleSheet.create({
  primaryIndicator: {
    width: '60%',
    height: 3,
    marginHorizontal: 'auto',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  iosIndicator: {
    width: '100%',
    height: 2,
    marginHorizontal: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default TopTabBar;
