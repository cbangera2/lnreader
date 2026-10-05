import { Platform, ScrollView, StyleSheet } from 'react-native';

import { useBoolean } from '@hooks';
import { useAppSettings, useTheme } from '@hooks/persisted';
import { Appbar, List, SafeAreaView } from '@components';
import { ISGroupedList, ISRow } from '@components/ios';
import { getString } from '@i18n/translations';
import { SettingsStackParamList } from '@navigators/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import SettingSwitch from '../components/SettingSwitch';
import DownloadCooldownModal from './modals/DownloadCooldownModal';
import InactivityTimeoutModal from './modals/InactivityTimeoutModal';

type GeneralSettingsProps = NativeStackScreenProps<
  SettingsStackParamList,
  'GeneralSettings'
>;

const GeneralSettings = ({ navigation }: GeneralSettingsProps) => {
  const theme = useTheme();
  const {
    chapterDownloadCooldownMs,
    disableHapticFeedback,
    disableLoadingAnimations,
    inactivityTimeoutMs,
    setAppSettings,
    timeTrackingEnabled,
  } = useAppSettings();

  const downloadCooldownModal = useBoolean();
  const inactivityTimeoutModal = useBoolean();

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
        title={getString('generalSettings')}
        handleGoBack={navigation.goBack}
        theme={theme}
      />
      <ScrollView
        style={
          Platform.OS === 'ios'
            ? { backgroundColor: theme.surfaceVariant }
            : undefined
        }
        contentContainerStyle={styles.paddingBottom}
      >
        {Platform.OS === 'ios' ? (
          <>
            <ISGroupedList
              title={getString('generalSettingsScreen.timeTracking')}
              theme={theme}
            >
              <ISRow
                title={getString('generalSettingsScreen.enableTimeTracking')}
                description={getString(
                  'generalSettingsScreen.enableTimeTrackingDesc',
                )}
                right="switch"
                switchValue={timeTrackingEnabled}
                onPress={() =>
                  setAppSettings({
                    timeTrackingEnabled: !timeTrackingEnabled,
                  })
                }
                theme={theme}
              />
              <ISRow
                title={getString('generalSettingsScreen.inactivityTimeout')}
                description={
                  inactivityTimeoutMs === undefined
                    ? getString('generalSettingsScreen.inactivityTimeoutNever')
                    : getString('time.minutes', {
                        count: inactivityTimeoutMs / 60000,
                      })
                }
                onPress={inactivityTimeoutModal.setTrue}
                theme={theme}
              />
            </ISGroupedList>
            <ISGroupedList title={getString('generalSettings')} theme={theme}>
              <ISRow
                title={getString(
                  'generalSettingsScreen.chapterDownloadCooldown',
                )}
                description={`${(
                  (chapterDownloadCooldownMs ?? 1000) / 1000
                ).toString()}s`}
                onPress={downloadCooldownModal.setTrue}
                theme={theme}
              />
              <ISRow
                title={getString('generalSettingsScreen.disableHapticFeedback')}
                description={getString(
                  'generalSettingsScreen.disableHapticFeedbackDescription',
                )}
                right="switch"
                switchValue={disableHapticFeedback}
                onPress={() =>
                  setAppSettings({
                    disableHapticFeedback: !disableHapticFeedback,
                  })
                }
                theme={theme}
              />
              <ISRow
                title={getString(
                  'generalSettingsScreen.disableLoadingAnimations',
                )}
                description={getString(
                  'generalSettingsScreen.disableLoadingAnimationsDesc',
                )}
                right="switch"
                switchValue={disableLoadingAnimations}
                onPress={() =>
                  setAppSettings({
                    disableLoadingAnimations: !disableLoadingAnimations,
                  })
                }
                theme={theme}
              />
            </ISGroupedList>
          </>
        ) : (
          <List.Section>
            <List.SubHeader theme={theme}>
              {getString('generalSettingsScreen.timeTracking')}
            </List.SubHeader>
            <SettingSwitch
              label={getString('generalSettingsScreen.enableTimeTracking')}
              value={timeTrackingEnabled}
              description={getString(
                'generalSettingsScreen.enableTimeTrackingDesc',
              )}
              onPress={() =>
                setAppSettings({ timeTrackingEnabled: !timeTrackingEnabled })
              }
              theme={theme}
            />
            <List.Item
              title={getString('generalSettingsScreen.inactivityTimeout')}
              description={
                inactivityTimeoutMs === undefined
                  ? getString('generalSettingsScreen.inactivityTimeoutNever')
                  : getString('time.minutes', {
                      count: inactivityTimeoutMs / 60000,
                    })
              }
              onPress={inactivityTimeoutModal.setTrue}
              theme={theme}
            />
            <List.SubHeader theme={theme}>
              {getString('generalSettings')}
            </List.SubHeader>
            <List.Item
              title={getString('generalSettingsScreen.chapterDownloadCooldown')}
              description={`${(
                (chapterDownloadCooldownMs ?? 1000) / 1000
              ).toString()}s`}
              onPress={downloadCooldownModal.setTrue}
              theme={theme}
            />
            <SettingSwitch
              label={getString('generalSettingsScreen.disableHapticFeedback')}
              description={getString(
                'generalSettingsScreen.disableHapticFeedbackDescription',
              )}
              value={disableHapticFeedback}
              onPress={() =>
                setAppSettings({
                  disableHapticFeedback: !disableHapticFeedback,
                })
              }
              theme={theme}
            />
            <SettingSwitch
              label={getString(
                'generalSettingsScreen.disableLoadingAnimations',
              )}
              description={getString(
                'generalSettingsScreen.disableLoadingAnimationsDesc',
              )}
              value={disableLoadingAnimations}
              onPress={() =>
                setAppSettings({
                  disableLoadingAnimations: !disableLoadingAnimations,
                })
              }
              theme={theme}
            />
          </List.Section>
        )}
      </ScrollView>
      <DownloadCooldownModal
        visible={downloadCooldownModal.value}
        hideModal={downloadCooldownModal.setFalse}
        theme={theme}
      />
      <InactivityTimeoutModal
        inactivityTimeoutMs={inactivityTimeoutMs}
        modalVisible={inactivityTimeoutModal.value}
        hideModal={inactivityTimeoutModal.setFalse}
        theme={theme}
      />
    </SafeAreaView>
  );
};

export default GeneralSettings;

const styles = StyleSheet.create({
  paddingBottom: {
    paddingBottom: 24,
  },
});
