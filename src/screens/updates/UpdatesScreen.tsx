import React, { memo, useCallback, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import {
  Platform,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
} from 'react-native';

import {
  EmptyView,
  ErrorScreenV2,
  SearchbarV2,
  SafeAreaView,
} from '@components';

import { useSearch } from '@hooks';
import { useAppSettings, useTheme } from '@hooks/persisted';
import { getString } from '@i18n/translations';
import { ThemeColors } from '@theme/types';
import UpdateNovelChapterGroup from './components/UpdateNovelChapterGroup';
import { deleteChapter } from '@database/queries/ChapterQueries';
import { showToast } from '@utils/showToast';
import { backgroundTasks } from '@services/backgroundTasks';
import { UpdateScreenProps } from '@navigators/types';
import { UpdateOverview } from '@database/types';
import { useUpdateContext } from '@components/Context/UpdateContext';
import { formatDate } from '@utils/dateFormat';
import { useFocusEffect } from '@react-navigation/native';

const UpdatesScreen = ({ navigation }: UpdateScreenProps) => {
  const theme = useTheme();
  const { dateFormat = 'default', relativeTimestamps = true } =
    useAppSettings();
  const {
    updatesOverview,
    getUpdates,
    lastUpdateTime,
    showLastUpdateTime,
    error,
  } = useUpdateContext();
  const { searchText, setSearchText, clearSearchbar } = useSearch();
  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  useFocusEffect(
    useCallback(() => {
      void getUpdates();
    }, [getUpdates]),
  );

  const sections = useMemo(
    () =>
      updatesOverview
        .filter(update =>
          searchText
            ? update.novelName.toLowerCase().includes(searchText.toLowerCase())
            : true,
        )
        .reduce(
          (
            groups: { data: UpdateOverview[]; date: string }[],
            update: UpdateOverview,
          ) => {
            if (
              groups.length === 0 ||
              groups[groups.length - 1]?.date !== update.updateDate
            ) {
              groups.push({ data: [update], date: update.updateDate });
              return groups;
            }
            groups[groups.length - 1]?.data.push(update);
            return groups;
          },
          [],
        ),
    [searchText, updatesOverview],
  );

  useEffect(
    () =>
      navigation.addListener('tabPress', e => {
        if (navigation.isFocused()) {
          e.preventDefault();

          navigation.navigate('MoreStack', {
            screen: 'TaskQueue',
          });
        }
      }),
    [navigation],
  );

  return (
    <SafeAreaView excludeBottom>
      {Platform.OS === 'ios' ? (
        <Text
          style={[styles.iosLargeTitle, { color: theme.onSurface }]}
          numberOfLines={1}
        >
          {getString('updates')}
        </Text>
      ) : null}
      <SearchbarV2
        searchText={searchText}
        clearSearchbar={clearSearchbar}
        placeholder={getString('updatesScreen.searchbar')}
        onChangeText={onChangeText}
        leftIcon="magnify"
        theme={theme}
        rightIcons={[
          {
            iconName: 'reload',
            onPress: () => backgroundTasks.enqueue({ name: 'UPDATE_LIBRARY' }),
          },
        ]}
      />
      {error ? (
        <ErrorScreenV2
          error={error}
          actions={[
            {
              iconName: 'refresh',
              title: getString('common.retry'),
              onPress: () =>
                backgroundTasks.enqueue({ name: 'UPDATE_LIBRARY' }),
            },
          ]}
        />
      ) : (
        <SectionList
          ListHeaderComponent={
            showLastUpdateTime && lastUpdateTime ? (
              <LastUpdateTime lastUpdateTime={lastUpdateTime} theme={theme} />
            ) : null
          }
          contentContainerStyle={styles.listContainer}
          renderSectionHeader={({ section: { date } }) => (
            <Text
              style={[
                styles.dateHeader,
                {
                  color:
                    Platform.OS === 'ios'
                      ? theme.onSurfaceVariant
                      : theme.onSurface,
                },
              ]}
            >
              {formatDate(date, dateFormat, relativeTimestamps)}
            </Text>
          )}
          sections={sections}
          keyExtractor={item =>
            `updatedGroup-${item.novelId}-${item.updateDate}-${item.updatesPerDay}`
          }
          renderItem={({ item }) => (
            <UpdateNovelChapterGroup
              onDeleteChapter={chapter => {
                deleteChapter(
                  chapter.pluginId,
                  chapter.novelId,
                  chapter.id,
                ).then(() => {
                  showToast(
                    getString('common.deleted', {
                      name: chapter.name,
                    }),
                  );
                  getUpdates();
                });
              }}
              overview={item}
              chapterCountLabel={getString('updatesScreen.updatesLower')}
            />
          )}
          ListEmptyComponent={
            <EmptyView
              icon="(˘･_･˘)"
              description={getString('updatesScreen.emptyView')}
              theme={theme}
              actions={[
                {
                  iconName: 'refresh',
                  title: getString('common.retry'),
                  onPress: () =>
                    backgroundTasks.enqueue({ name: 'UPDATE_LIBRARY' }),
                },
              ]}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() =>
                backgroundTasks.enqueue({ name: 'UPDATE_LIBRARY' })
              }
              colors={[theme.onPrimary]}
              progressBackgroundColor={theme.primary}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default memo(UpdatesScreen);

const LastUpdateTime: React.FC<{
  lastUpdateTime: Date | number | string;
  theme: ThemeColors;
}> = ({ lastUpdateTime, theme }) => (
  <Text style={[styles.lastUpdateTime, { color: theme.onSurface }]}>
    {`${getString('updatesScreen.lastUpdatedAt')} ${dayjs(
      lastUpdateTime,
    ).fromNow()}`}
  </Text>
);

const styles = StyleSheet.create({
  dateHeader: {
    paddingBottom: 2,
    paddingHorizontal: 16,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        fontSize: 13,
        fontWeight: '600',
      },
      default: {},
    }),
  },
  iosLargeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
    marginHorizontal: 16,
    marginTop: 8,
  },
  lastUpdateTime: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    flexGrow: 1,
  },
});
