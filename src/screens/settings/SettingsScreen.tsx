import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Appbar, List, SafeAreaView } from '@components';
import { ISRow } from '@components/ios';
import { useTheme } from '@hooks/persisted';
import { ThemeColors } from '@theme/types';

import { getString } from '@i18n/translations';
import { SettingsScreenProps } from '@navigators/types';

interface SettingsRowProps {
  title: string;
  icon: string;
  onPress: () => void;
  theme: ThemeColors;
}

// iOS renders the native grouped row (SF Symbol icon + chevron via ISRow);
// Android keeps the existing List.Item untouched.
const SettingsRow = ({ title, icon, onPress, theme }: SettingsRowProps) =>
  Platform.OS === 'ios' ? (
    <ISRow title={title} icon={icon} onPress={onPress} theme={theme} />
  ) : (
    <List.Item title={title} icon={icon} onPress={onPress} theme={theme} />
  );

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView excludeTop>
      <Appbar
        title={getString('common.settings')}
        handleGoBack={navigation.goBack}
        theme={theme}
      />
      <ScrollView style={[{ backgroundColor: theme.background }, styles.flex]}>
        <SettingsRow
          title={getString('generalSettings')}
          icon="tune"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'GeneralSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('appearance')}
          icon="palette-outline"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'AppearanceSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('library')}
          icon="bookshelf"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'LibrarySettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('readerSettings.title')}
          icon="book-open-outline"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'ReaderSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title="Repositories"
          icon="github"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'RespositorySettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title="Custom Code"
          icon="code-braces"
          onPress={() => navigation.navigate('CustomCode')}
          theme={theme}
        />
        <SettingsRow
          title={getString('tracking')}
          icon="sync"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'TrackerSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('common.backup')}
          icon="cloud-upload-outline"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'BackupSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('advancedSettings')}
          icon="code-tags"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'AdvancedSettings',
            })
          }
          theme={theme}
        />
        <SettingsRow
          title={getString('genreStats.taxonomyTitle')}
          icon="tag-multiple-outline"
          onPress={() =>
            navigation.navigate('SettingsStack', {
              screen: 'GenreTaxonomy',
            })
          }
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
