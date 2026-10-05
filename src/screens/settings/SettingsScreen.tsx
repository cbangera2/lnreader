import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Appbar, List, SafeAreaView } from '@components';
import { ISGroupedList, ISRow } from '@components/ios';
import { useTheme } from '@hooks/persisted';

import { getString } from '@i18n/translations';
import { SettingsScreenProps } from '@navigators/types';

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const theme = useTheme();

  const rows = [
    {
      title: getString('generalSettings'),
      icon: 'tune',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'GeneralSettings',
        }),
    },
    {
      title: getString('appearance'),
      icon: 'palette-outline',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'AppearanceSettings',
        }),
    },
    {
      title: getString('library'),
      icon: 'bookshelf',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'LibrarySettings',
        }),
    },
    {
      title: getString('readerSettings.title'),
      icon: 'book-open-outline',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'ReaderSettings',
        }),
    },
    {
      title: 'Repositories',
      icon: 'github',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'RespositorySettings',
        }),
    },
    {
      title: 'Custom Code',
      icon: 'code-braces',
      onPress: () => navigation.navigate('CustomCode'),
    },
    {
      title: getString('tracking'),
      icon: 'sync',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'TrackerSettings',
        }),
    },
    {
      title: getString('common.backup'),
      icon: 'cloud-upload-outline',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'BackupSettings',
        }),
    },
    {
      title: getString('advancedSettings'),
      icon: 'code-tags',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'AdvancedSettings',
        }),
    },
    {
      title: getString('genreStats.taxonomyTitle'),
      icon: 'tag-multiple-outline',
      onPress: () =>
        navigation.navigate('SettingsStack', {
          screen: 'GenreTaxonomy',
        }),
    },
  ];

  return (
    <SafeAreaView
      excludeTop
      style={
        Platform.OS === 'ios'
          ? { backgroundColor: theme.surfaceVariant }
          : undefined
      }
    >
      <Appbar
        title={getString('common.settings')}
        handleGoBack={navigation.goBack}
        theme={theme}
      />
      <ScrollView
        style={[
          {
            backgroundColor:
              Platform.OS === 'ios' ? theme.surfaceVariant : theme.background,
          },
          styles.flex,
        ]}
      >
        {Platform.OS === 'ios' ? (
          <ISGroupedList theme={theme}>
            {rows.map(row => (
              <ISRow
                key={row.title}
                title={row.title}
                icon={row.icon}
                onPress={row.onPress}
                theme={theme}
              />
            ))}
          </ISGroupedList>
        ) : (
          <>
            {rows.map(row => (
              <List.Item
                key={row.title}
                title={row.title}
                icon={row.icon}
                onPress={row.onPress}
                theme={theme}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
