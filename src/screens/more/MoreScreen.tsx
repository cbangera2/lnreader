import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { getString } from '@i18n/translations';

import { List, SafeAreaView } from '@components';
import { IOS_TAB_CLEARANCE, ISRow } from '@components/ios';

import { MoreHeader } from './components/MoreHeader';
import { useLibrarySettings, useTheme } from '@hooks/persisted';
import { MoreStackScreenProps } from '@navigators/types';
import Switch from '@components/Switch/Switch';
import { useMMKVObject } from 'react-native-mmkv';
import {
  BACKGROUND_TASKS_STORE_KEY,
  QueuedBackgroundTask,
} from '@services/backgroundTasks';

const MoreScreen = ({ navigation }: MoreStackScreenProps) => {
  const theme = useTheme();
  const [taskQueue] = useMMKVObject<QueuedBackgroundTask[]>(
    BACKGROUND_TASKS_STORE_KEY,
  );
  const {
    incognitoMode = false,
    downloadedOnlyMode = false,
    setLibrarySettings,
  } = useLibrarySettings();

  const enableDownloadedOnlyMode = () =>
    setLibrarySettings({ downloadedOnlyMode: !downloadedOnlyMode });

  const enableIncognitoMode = () =>
    setLibrarySettings({ incognitoMode: !incognitoMode });

  useEffect(
    () =>
      navigation.addListener('tabPress', e => {
        if (navigation.isFocused()) {
          e.preventDefault();

          navigation.navigate('MoreStack', {
            screen: 'SettingsStack',
            params: {
              screen: 'Settings',
            },
          });
        }
      }),
    [navigation],
  );

  return (
    <SafeAreaView excludeTop excludeBottom>
      <ScrollView contentContainerStyle={{ paddingBottom: IOS_TAB_CLEARANCE }}>
        {Platform.OS === 'ios' ? (
          <Text
            style={[styles.iosLargeTitle, { color: theme.onSurface }]}
            numberOfLines={1}
          >
            {getString('more')}
          </Text>
        ) : (
          <MoreHeader
            // status bar is translucent, text could be mess with it
            title={''}
            navigation={navigation}
            theme={theme}
          />
        )}
        <List.Section>
          {Platform.OS === 'ios' ? (
            // onPress-only: ISRow fires onSwitchChange then onPress, so a
            // single toggle handler avoids flipping the value twice.
            <ISRow
              title={getString('moreScreen.downloadOnly')}
              description={getString('moreScreen.downloadOnlyDesc')}
              icon="cloud-off-outline"
              right="switch"
              switchValue={downloadedOnlyMode}
              onPress={enableDownloadedOnlyMode}
              theme={theme}
            />
          ) : (
            <Pressable
              android_ripple={{ color: theme.rippleColor }}
              style={({ pressed }) => [
                styles.pressable,
                Platform.OS === 'ios' && pressed && styles.pressed,
              ]}
              onPress={enableDownloadedOnlyMode}
            >
              <View style={styles.row}>
                <List.Icon theme={theme} icon="cloud-off-outline" />
                <View style={styles.marginLeft16}>
                  <Text
                    style={[
                      {
                        color: theme.onSurface,
                      },
                      styles.fontSize16,
                    ]}
                  >
                    {getString('moreScreen.downloadOnly')}
                  </Text>
                  <Text
                    style={[
                      styles.description,
                      { color: theme.onSurfaceVariant },
                    ]}
                  >
                    {getString('moreScreen.downloadOnlyDesc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={downloadedOnlyMode}
                onValueChange={enableDownloadedOnlyMode}
              />
            </Pressable>
          )}
          {Platform.OS === 'ios' ? (
            // onPress-only: ISRow fires onSwitchChange then onPress, so a
            // single toggle handler avoids flipping the value twice.
            <ISRow
              title={getString('moreScreen.incognitoMode')}
              description={getString('moreScreen.incognitoModeDesc')}
              icon="glasses"
              right="switch"
              switchValue={incognitoMode}
              onPress={enableIncognitoMode}
              theme={theme}
            />
          ) : (
            <Pressable
              android_ripple={{ color: theme.rippleColor }}
              style={({ pressed }) => [
                styles.pressable,
                Platform.OS === 'ios' && pressed && styles.pressed,
              ]}
              onPress={enableIncognitoMode}
            >
              <View style={styles.row}>
                <List.Icon theme={theme} icon="glasses" />
                <View style={styles.marginLeft16}>
                  <Text
                    style={[
                      {
                        color: theme.onSurface,
                      },
                      styles.fontSize16,
                    ]}
                  >
                    {getString('moreScreen.incognitoMode')}
                  </Text>
                  <Text
                    style={[
                      styles.description,
                      { color: theme.onSurfaceVariant },
                    ]}
                  >
                    {getString('moreScreen.incognitoModeDesc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={incognitoMode}
                onValueChange={enableIncognitoMode}
              />
            </Pressable>
          )}
          <List.Divider theme={theme} />
          {Platform.OS === 'ios' ? (
            <ISRow
              title={'Task Queue'}
              description={
                taskQueue && taskQueue.length > 0
                  ? taskQueue.length + ' remaining'
                  : ''
              }
              icon="progress-download"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'TaskQueue',
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={'Task Queue'}
              description={
                taskQueue && taskQueue.length > 0
                  ? taskQueue.length + ' remaining'
                  : ''
              }
              icon="progress-download"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'TaskQueue',
                })
              }
              theme={theme}
            />
          )}
          {Platform.OS === 'ios' ? (
            <ISRow
              title={getString('common.downloads')}
              icon="folder-download"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Downloads',
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={getString('common.downloads')}
              icon="folder-download"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Downloads',
                })
              }
              theme={theme}
            />
          )}
          {Platform.OS === 'ios' ? (
            <ISRow
              title={getString('common.categories')}
              icon="label-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Categories',
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={getString('common.categories')}
              icon="label-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Categories',
                })
              }
              theme={theme}
            />
          )}
          {Platform.OS === 'ios' ? (
            <ISRow
              title={getString('statsScreen.title')}
              icon="chart-line"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Statistics',
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={getString('statsScreen.title')}
              icon="chart-line"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'Statistics',
                })
              }
              theme={theme}
            />
          )}
          <List.Divider theme={theme} />
          {Platform.OS === 'ios' ? (
            <ISRow
              title={getString('common.settings')}
              icon="cog-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'SettingsStack',
                  params: {
                    screen: 'Settings',
                  },
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={getString('common.settings')}
              icon="cog-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'SettingsStack',
                  params: {
                    screen: 'Settings',
                  },
                })
              }
              theme={theme}
            />
          )}
          {Platform.OS === 'ios' ? (
            <ISRow
              title={getString('common.about')}
              icon="information-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'About',
                })
              }
              theme={theme}
            />
          ) : (
            <List.Item
              title={getString('common.about')}
              icon="information-outline"
              onPress={() =>
                navigation.navigate('MoreStack', {
                  screen: 'About',
                })
              }
              theme={theme}
            />
          )}
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    lineHeight: 20,
  },
  iosLargeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 8,
  },
  pressable: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: { minHeight: 44 },
      default: {},
    }),
  },
  pressed: {
    opacity: 0.7,
  },
  row: { flexDirection: 'row' },
  fontSize16: { fontSize: 16 },
  marginLeft16: { marginLeft: 16 },
});
