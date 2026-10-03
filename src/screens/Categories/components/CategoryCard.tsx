import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';

import { Category } from '@database/types';
import { useTheme } from '@hooks/persisted';
import AddCategoryModal from './AddCategoryModal';
import { useBoolean } from '@hooks';
import { Badge, Portal } from 'react-native-paper';
import IconButton from '@components/IconButtonV2/IconButtonV2';
import { ISIcon } from '@components/ios/ISIcon';
import { ThemeColors } from '@theme/types';
import DeleteCategoryModal from './DeleteCategoryModal';

interface CategoryCardProps {
  category: Category;
  getCategories: () => Promise<void>;
  drag: () => void;
  isActive: boolean;
}

interface CategoryIOSIconButtonProps {
  name: string;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  style?: ViewStyle;
  theme: ThemeColors;
}

// iOS-only SF Symbol equivalent of IconButtonV2 (same 24px glyph, 8px
// padding, circular container). Android keeps IconButtonV2, pixel-identical.
const CategoryIOSIconButton: React.FC<CategoryIOSIconButtonProps> = ({
  name,
  color,
  disabled,
  onPress,
  onPressIn,
  style,
  theme,
}) => (
  <View style={[styles.iconButtonCtn, style]}>
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      style={({ pressed }) => [
        styles.iconButtonPressable,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <ISIcon name={name} size={24} color={color ?? theme.onSurface} />
    </Pressable>
  </View>
);

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  getCategories,
  drag,
  isActive,
}) => {
  const theme = useTheme();

  const {
    value: categoryModalVisible,
    setTrue: showCategoryModal,
    setFalse: closeCategoryModal,
  } = useBoolean();

  const {
    value: deletecategoryModalVisible,
    setTrue: showDeleteCategoryModal,
    setFalse: closeDeleteCategoryModal,
  } = useBoolean();

  const opacity = category.id <= 2 ? 0.4 : 1;

  return (
    <>
      <View
        style={[
          styles.cardCtn,
          {
            backgroundColor: theme.secondaryContainer,
          },
          isActive && styles.activeCard,
        ]}
      >
        <View style={styles.buttonsCtn}>
          {Platform.OS === 'ios' ? (
            <CategoryIOSIconButton
              name="drag-horizontal-variant"
              color={theme.onSurface}
              onPressIn={drag}
              style={styles.dragHandle}
              theme={theme}
            />
          ) : (
            <IconButton
              name="drag-horizontal-variant"
              color={theme.onSurface}
              theme={theme}
              padding={8}
              onPressIn={drag}
              style={styles.dragHandle}
            />
          )}
          <View style={styles.nameCtn}>
            <Text
              style={[
                styles.name,
                {
                  color: theme.onSurface,
                },
              ]}
              onPress={showCategoryModal}
              disabled={category.id <= 2}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </View>
          {category.id <= 2 && (
            <Badge
              style={[
                styles.badge,
                {
                  backgroundColor: theme.tertiaryContainer,
                  color: theme.onTertiaryContainer,
                },
              ]}
            >
              System
            </Badge>
          )}

          <View style={{ opacity }}>
            {Platform.OS === 'ios' ? (
              <CategoryIOSIconButton
                name="pencil-outline"
                color={category.id <= 2 ? theme.outline : theme.onSurface}
                onPress={showCategoryModal}
                disabled={category.id <= 2}
                style={styles.manageBtn}
                theme={theme}
              />
            ) : (
              <IconButton
                name="pencil-outline"
                color={category.id <= 2 ? theme.outline : theme.onSurface}
                style={styles.manageBtn}
                onPress={showCategoryModal}
                theme={theme}
                disabled={category.id <= 2}
              />
            )}
          </View>

          <View style={{ opacity }}>
            {Platform.OS === 'ios' ? (
              <CategoryIOSIconButton
                name="delete-outline"
                color={category.id <= 2 ? theme.outline : theme.onSurface}
                onPress={showDeleteCategoryModal}
                disabled={category.id <= 2}
                style={styles.manageBtn}
                theme={theme}
              />
            ) : (
              <IconButton
                name="delete-outline"
                color={category.id <= 2 ? theme.outline : theme.onSurface}
                style={styles.manageBtn}
                onPress={showDeleteCategoryModal}
                theme={theme}
                disabled={category.id <= 2}
              />
            )}
          </View>
        </View>
      </View>
      <Portal>
        <AddCategoryModal
          isEditMode
          category={category}
          visible={categoryModalVisible}
          closeModal={closeCategoryModal}
          onSuccess={getCategories}
        />
        <DeleteCategoryModal
          category={category}
          visible={deletecategoryModalVisible}
          closeModal={closeDeleteCategoryModal}
          onSuccess={getCategories}
        />
      </Portal>
    </>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  buttonsCtn: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconButtonCtn: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  iconButtonPressable: {
    padding: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  cardCtn: {
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  dragHandle: {
    marginEnd: 4,
  },
  manageBtn: {
    marginStart: 16,
  },
  name: {
    flexShrink: 1,
    marginStart: 0,
    marginEnd: 8,
  },
  nameCtn: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginStart: 8,
    paddingEnd: 16,
    paddingVertical: 4,
  },
  activeCard: {
    opacity: 0.8,
    elevation: 8,
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  disabledOpacity: {
    opacity: 0.4,
  },
});
