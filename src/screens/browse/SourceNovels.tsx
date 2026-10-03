import {
  StyleSheet,
  View,
  FlatList,
  Text,
  FlatListProps,
  Platform,
} from 'react-native';
import { useTheme } from '@hooks/persisted';

import ListView from '../../components/ListView';
import { Appbar, SafeAreaView } from '@components';
import { SourceNovelsScreenProps } from '@navigators/types';
import { NovelInfo } from '@database/types';
import { getString } from '@i18n/translations';
import { useLibraryContext } from '@components/Context/LibraryContext';

const SourceNovels = ({ navigation, route }: SourceNovelsScreenProps) => {
  const pluginId = route.params.pluginId;
  const theme = useTheme();
  const { library } = useLibraryContext();

  const sourceNovels = library.filter(novel => novel.pluginId === pluginId);

  const renderItem: FlatListProps<NovelInfo>['renderItem'] = ({ item }) => (
    <ListView
      item={item}
      theme={theme}
      onPress={() =>
        navigation.navigate('MigrateNovel', {
          novel: item,
        })
      }
    />
  );

  const content = (
    <>
      <Appbar
        title={getString('browseScreen.selectNovel')}
        handleGoBack={navigation.goBack}
        theme={theme}
      />
      <FlatList
        data={sourceNovels}
        keyExtractor={item => 'migrateFrom' + item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text
            style={[
              {
                color: theme.onSurfaceVariant,
              },
              styles.text,
            ]}
          >
            {getString('browseScreen.noSource')}
          </Text>
        }
      />
    </>
  );

  if (Platform.OS === 'ios') {
    return <SafeAreaView excludeTop>{content}</SafeAreaView>;
  }

  return <View style={styles.container}>{content}</View>;
};

export default SourceNovels;

const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { padding: 20, textAlign: 'center' },
});
