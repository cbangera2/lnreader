import { useCallback, useState } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Image,
  Pressable,
  Text,
} from 'react-native';
import { Provider, List as PaperList } from 'react-native-paper';

import { getTracker, useTheme, useTracker } from '@hooks/persisted';
import { Appbar, ConfirmationDialog, List, SafeAreaView } from '@components';
import { ISGroupedList, ISIcon, ISRow } from '@components/ios';
import { ThemeColors } from '@theme/types';
import { TrackerSettingsScreenProps } from '@navigators/types';
import { getString } from '@i18n/translations';
import TrackerLoginDialog from './components/TrackerLoginDialog';
import { authenticateWithCredentials as mangaUpdatesAuth } from '@services/Trackers/mangaUpdates';
import { authenticateWithCredentials as kitsuAuth } from '@services/Trackers/kitsu';
import { showToast } from '@utils/showToast';

interface TrackerCheckIconProps {
  theme: any;
  checked: boolean;
}

const TrackerCheckIcon = ({
  theme,
  checked,
  ...props
}: TrackerCheckIconProps) => {
  if (!checked) {
    return null;
  }
  if (Platform.OS === 'ios') {
    return <ISIcon name="check" size={24} color={theme.primary} />;
  }
  return (
    <PaperList.Icon
      {...props}
      color={theme.primary}
      icon="check"
      style={styles.iconStyle}
    />
  );
};

const AniListLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../../assets/anilist.png')}
      style={styles.trackerLogo}
    />
  </View>
);

const MyAnimeListLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../../assets/mal.png')}
      style={styles.trackerLogo}
    />
  </View>
);

const MangaUpdatesLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../../assets/mangaupdates.png')}
      style={styles.trackerLogo}
    />
  </View>
);

const KitsuLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require('../../../assets/kitsu.png')}
      style={styles.trackerLogo}
    />
  </View>
);

interface TrackerRowIOSProps {
  title: string;
  image: number;
  checked: boolean;
  onPress: () => void;
  theme: ThemeColors;
}

// iOS grouped row with tracker logo + checkmark (no chevron: tap logs
// in/out rather than pushing a screen). Android keeps PaperList.Item.
const TrackerRowIOS = ({
  title,
  image,
  checked,
  onPress,
  theme,
}: TrackerRowIOSProps) => (
  <Pressable
    accessibilityLabel={title}
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.trackerRowIOS,
      pressed && styles.trackerRowPressed,
    ]}
  >
    <Image source={image} style={styles.trackerLogoIOS} />
    <Text
      numberOfLines={1}
      style={[styles.trackerTitle, { color: theme.onSurface }]}
    >
      {title}
    </Text>
    {checked ? <ISIcon name="check" size={24} color={theme.primary} /> : null}
  </Pressable>
);

const TrackerScreen = ({ navigation }: TrackerSettingsScreenProps) => {
  const theme = useTheme();
  const { isTrackerAuthenticated, setTracker, removeTracker, getTrackerAuth } =
    useTracker();

  // Tracker Modal for logout confirmation
  const [logoutTrackerName, setLogoutTrackerName] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const showModal = (trackerName: string) => {
    setLogoutTrackerName(trackerName);
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
    setLogoutTrackerName('');
  };

  // Credential-based Login Dialog (MangaUpdates, Kitsu)
  const [credentialLoginTracker, setCredentialLoginTracker] = useState<
    'MangaUpdates' | 'Kitsu' | null
  >(null);
  const showCredentialLogin = (tracker: 'MangaUpdates' | 'Kitsu') =>
    setCredentialLoginTracker(tracker);
  const hideCredentialLogin = () => setCredentialLoginTracker(null);

  const handleCredentialLogin = async (username: string, password: string) => {
    if (!credentialLoginTracker) {
      return;
    }

    try {
      let auth;
      if (credentialLoginTracker === 'MangaUpdates') {
        auth = await mangaUpdatesAuth(username, password);
      } else if (credentialLoginTracker === 'Kitsu') {
        auth = await kitsuAuth(username, password);
      } else {
        throw new Error('Unknown tracker');
      }

      setTracker(credentialLoginTracker, auth);
      hideCredentialLogin();
      showToast(`Successfully logged in to ${credentialLoginTracker}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error; /* Let the dialog handle the error display */
      }
      throw new Error(`Failed to authenticate with ${credentialLoginTracker}`);
    }
  };

  const renderAniListRight = useCallback(
    (props: any) => (
      <TrackerCheckIcon
        {...props}
        theme={theme}
        checked={isTrackerAuthenticated('AniList')}
      />
    ),
    [theme, isTrackerAuthenticated],
  );

  const renderMyAnimeListRight = useCallback(
    (props: any) => (
      <TrackerCheckIcon
        {...props}
        theme={theme}
        checked={isTrackerAuthenticated('MyAnimeList')}
      />
    ),
    [theme, isTrackerAuthenticated],
  );

  const renderMangaUpdatesRight = useCallback(
    (props: any) => (
      <TrackerCheckIcon
        {...props}
        theme={theme}
        checked={isTrackerAuthenticated('MangaUpdates')}
      />
    ),
    [theme, isTrackerAuthenticated],
  );

  const renderKitsuRight = useCallback(
    (props: any) => (
      <TrackerCheckIcon
        {...props}
        theme={theme}
        checked={isTrackerAuthenticated('Kitsu')}
      />
    ),
    [theme, isTrackerAuthenticated],
  );

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const showRevalidateSection =
    (isTrackerAuthenticated('MyAnimeList') &&
      getTrackerAuth('MyAnimeList')?.auth?.expiresAt &&
      getTrackerAuth('MyAnimeList')!.auth.expiresAt < new Date(now)) ||
    (isTrackerAuthenticated('Kitsu') &&
      getTrackerAuth('Kitsu')?.auth?.expiresAt &&
      getTrackerAuth('Kitsu')!.auth.expiresAt < new Date(now));
  return (
    <SafeAreaView
      excludeTop
      style={
        Platform.OS === 'ios'
          ? { backgroundColor: theme.surfaceVariant }
          : undefined
      }
    >
      <Provider>
        <Appbar
          title={getString('tracking')}
          handleGoBack={() => navigation.goBack()}
          theme={theme}
        />
        {Platform.OS === 'ios' ? (
          <View
            style={[{ backgroundColor: theme.surfaceVariant }, styles.flex1]}
          >
            <ISGroupedList
              title={getString('trackingScreen.services')}
              footer={getString('trackingScreen.info')}
              theme={theme}
            >
              <TrackerRowIOS
                title="AniList"
                image={require('../../../assets/anilist.png')}
                checked={isTrackerAuthenticated('AniList')}
                onPress={async () => {
                  if (isTrackerAuthenticated('AniList')) {
                    showModal('AniList');
                  } else {
                    const auth = await getTracker('AniList').authenticate();
                    if (auth) {
                      setTracker('AniList', auth);
                    }
                  }
                }}
                theme={theme}
              />
              <TrackerRowIOS
                title="MyAnimeList"
                image={require('../../../assets/mal.png')}
                checked={isTrackerAuthenticated('MyAnimeList')}
                onPress={async () => {
                  if (isTrackerAuthenticated('MyAnimeList')) {
                    showModal('MyAnimeList');
                  } else {
                    const auth = await getTracker('MyAnimeList').authenticate();
                    if (auth) {
                      setTracker('MyAnimeList', auth);
                    }
                  }
                }}
                theme={theme}
              />
              <TrackerRowIOS
                title="MangaUpdates"
                image={require('../../../assets/mangaupdates.png')}
                checked={isTrackerAuthenticated('MangaUpdates')}
                onPress={() => {
                  if (isTrackerAuthenticated('MangaUpdates')) {
                    showModal('MangaUpdates');
                  } else {
                    showCredentialLogin('MangaUpdates');
                  }
                }}
                theme={theme}
              />
              <TrackerRowIOS
                title="Kitsu"
                image={require('../../../assets/kitsu.png')}
                checked={isTrackerAuthenticated('Kitsu')}
                onPress={() => {
                  if (isTrackerAuthenticated('Kitsu')) {
                    showModal('Kitsu');
                  } else {
                    showCredentialLogin('Kitsu');
                  }
                }}
                theme={theme}
              />
            </ISGroupedList>
            {showRevalidateSection ? (
              <ISGroupedList title={getString('common.settings')} theme={theme}>
                {isTrackerAuthenticated('MyAnimeList') &&
                getTrackerAuth('MyAnimeList')?.auth?.expiresAt &&
                getTrackerAuth('MyAnimeList')!.auth.expiresAt <
                  new Date(now) ? (
                  <ISRow
                    title={
                      getString('trackingScreen.revalidate') + ' MyAnimeList'
                    }
                    onPress={async () => {
                      const trackerAuth = getTrackerAuth('MyAnimeList');
                      const revalidate = getTracker('MyAnimeList')?.revalidate;
                      if (revalidate && trackerAuth) {
                        const auth = await revalidate(trackerAuth.auth);
                        setTracker('MyAnimeList', auth);
                      }
                    }}
                    right={null}
                    theme={theme}
                  />
                ) : null}
                {isTrackerAuthenticated('Kitsu') &&
                getTrackerAuth('Kitsu')?.auth?.expiresAt &&
                getTrackerAuth('Kitsu')!.auth.expiresAt < new Date(now) ? (
                  <ISRow
                    title={getString('trackingScreen.revalidate') + ' Kitsu'}
                    onPress={async () => {
                      const trackerAuth = getTrackerAuth('Kitsu');
                      const revalidate = getTracker('Kitsu')?.revalidate;
                      if (revalidate && trackerAuth) {
                        try {
                          const auth = await revalidate(trackerAuth.auth);
                          setTracker('Kitsu', auth);
                          showToast('Successfully refreshed Kitsu session');
                        } catch {
                          showToast(
                            'Failed to refresh Kitsu session. Please log in again.',
                          );
                          removeTracker('Kitsu');
                        }
                      }
                    }}
                    right={null}
                    theme={theme}
                  />
                ) : null}
              </ISGroupedList>
            ) : null}

            <ConfirmationDialog
              title={getString('common.logout')}
              message={getString('trackingScreen.logOutMessage', {
                name: logoutTrackerName,
              })}
              visible={visible}
              confirmLabel={getString('common.logout')}
              confirmTone="danger"
              onConfirm={() => {
                removeTracker(logoutTrackerName as any);
                hideModal();
              }}
              onDismiss={hideModal}
            />
            <TrackerLoginDialog
              visible={credentialLoginTracker !== null}
              trackerName={credentialLoginTracker || ''}
              onDismiss={hideCredentialLogin}
              onSubmit={handleCredentialLogin}
              usernameLabel={
                credentialLoginTracker === 'Kitsu' ? 'Email' : 'Username'
              }
            />
          </View>
        ) : (
          <View
            style={[
              { backgroundColor: theme.background },
              styles.flex1,
              styles.screenPadding,
            ]}
          >
            <List.Section>
              <List.SubHeader theme={theme}>
                {getString('trackingScreen.services')}
              </List.SubHeader>
              <PaperList.Item
                title="AniList"
                titleStyle={{ color: theme.onSurface }}
                left={AniListLogo}
                right={renderAniListRight}
                onPress={async () => {
                  if (isTrackerAuthenticated('AniList')) {
                    showModal('AniList');
                  } else {
                    const auth = await getTracker('AniList').authenticate();
                    if (auth) {
                      setTracker('AniList', auth);
                    }
                  }
                }}
                rippleColor={
                  Platform.OS === 'android' ? theme.rippleColor : undefined
                }
                style={styles.listItem}
              />
              <PaperList.Item
                title="MyAnimeList"
                titleStyle={{ color: theme.onSurface }}
                left={MyAnimeListLogo}
                right={renderMyAnimeListRight}
                onPress={async () => {
                  if (isTrackerAuthenticated('MyAnimeList')) {
                    showModal('MyAnimeList');
                  } else {
                    const auth = await getTracker('MyAnimeList').authenticate();
                    if (auth) {
                      setTracker('MyAnimeList', auth);
                    }
                  }
                }}
                rippleColor={
                  Platform.OS === 'android' ? theme.rippleColor : undefined
                }
                style={styles.listItem}
              />
              <PaperList.Item
                title="MangaUpdates"
                titleStyle={{ color: theme.onSurface }}
                left={MangaUpdatesLogo}
                right={renderMangaUpdatesRight}
                onPress={() => {
                  if (isTrackerAuthenticated('MangaUpdates')) {
                    showModal('MangaUpdates');
                  } else {
                    showCredentialLogin('MangaUpdates');
                  }
                }}
                rippleColor={
                  Platform.OS === 'android' ? theme.rippleColor : undefined
                }
                style={styles.listItem}
              />
              <PaperList.Item
                title="Kitsu"
                titleStyle={{ color: theme.onSurface }}
                left={KitsuLogo}
                right={renderKitsuRight}
                onPress={() => {
                  if (isTrackerAuthenticated('Kitsu')) {
                    showModal('Kitsu');
                  } else {
                    showCredentialLogin('Kitsu');
                  }
                }}
                rippleColor={
                  Platform.OS === 'android' ? theme.rippleColor : undefined
                }
                style={styles.listItem}
              />
              <List.InfoItem
                title={getString('trackingScreen.info')}
                theme={theme}
              />
              {(isTrackerAuthenticated('MyAnimeList') &&
                getTrackerAuth('MyAnimeList')?.auth?.expiresAt &&
                getTrackerAuth('MyAnimeList')!.auth.expiresAt <
                  new Date(now)) ||
              (isTrackerAuthenticated('Kitsu') &&
                getTrackerAuth('Kitsu')?.auth?.expiresAt &&
                getTrackerAuth('Kitsu')!.auth.expiresAt < new Date(now)) ? (
                <>
                  <List.SubHeader theme={theme}>
                    {getString('common.settings')}
                  </List.SubHeader>
                  {isTrackerAuthenticated('MyAnimeList') &&
                    getTrackerAuth('MyAnimeList')?.auth?.expiresAt &&
                    getTrackerAuth('MyAnimeList')!.auth.expiresAt <
                      new Date(now) && (
                      <List.Item
                        title={
                          getString('trackingScreen.revalidate') +
                          ' MyAnimeList'
                        }
                        onPress={async () => {
                          const trackerAuth = getTrackerAuth('MyAnimeList');
                          const revalidate =
                            getTracker('MyAnimeList')?.revalidate;
                          if (revalidate && trackerAuth) {
                            const auth = await revalidate(trackerAuth.auth);
                            setTracker('MyAnimeList', auth);
                          }
                        }}
                        theme={theme}
                      />
                    )}
                  {isTrackerAuthenticated('Kitsu') &&
                    getTrackerAuth('Kitsu')?.auth?.expiresAt &&
                    getTrackerAuth('Kitsu')!.auth.expiresAt < new Date(now) && (
                      <List.Item
                        title={
                          getString('trackingScreen.revalidate') + ' Kitsu'
                        }
                        onPress={async () => {
                          const trackerAuth = getTrackerAuth('Kitsu');
                          const revalidate = getTracker('Kitsu')?.revalidate;
                          if (revalidate && trackerAuth) {
                            try {
                              const auth = await revalidate(trackerAuth.auth);
                              setTracker('Kitsu', auth);
                              showToast('Successfully refreshed Kitsu session');
                            } catch {
                              showToast(
                                'Failed to refresh Kitsu session. Please log in again.',
                              );
                              removeTracker('Kitsu');
                            }
                          }
                        }}
                        theme={theme}
                      />
                    )}
                </>
              ) : null}
            </List.Section>

            <ConfirmationDialog
              title={getString('common.logout')}
              message={getString('trackingScreen.logOutMessage', {
                name: logoutTrackerName,
              })}
              visible={visible}
              confirmLabel={getString('common.logout')}
              confirmTone="danger"
              onConfirm={() => {
                removeTracker(logoutTrackerName as any);
                hideModal();
              }}
              onDismiss={hideModal}
            />
            <TrackerLoginDialog
              visible={credentialLoginTracker !== null}
              trackerName={credentialLoginTracker || ''}
              onDismiss={hideCredentialLogin}
              onSubmit={handleCredentialLogin}
              usernameLabel={
                credentialLoginTracker === 'Kitsu' ? 'Email' : 'Username'
              }
            />
          </View>
        )}
      </Provider>
    </SafeAreaView>
  );
};

export default TrackerScreen;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  screenPadding: {
    paddingVertical: 8,
  },
  logoContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  trackerLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  trackerLogoIOS: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  trackerRowIOS: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trackerRowPressed: {
    opacity: 0.6,
  },
  trackerTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },
  listItem: {
    paddingVertical: 12,
    ...Platform.select({
      ios: { minHeight: 44 },
      default: undefined,
    }),
  },
  iconStyle: {
    margin: 0,
  },
});
