import React from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from 'color';

import { Dialog } from '@components';
import Glass from '@components/Glass/Glass';
import { ThemeColors } from '@theme/types';

export type ISActionSheetTone = 'default' | 'destructive' | 'cancel';

export interface ISActionSheetAction {
  label: string;
  tone?: ISActionSheetTone;
  onPress: () => void;
}

export interface ISActionSheetProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
  actions: ISActionSheetAction[];
  theme: ThemeColors;
}

const isIos = Platform.OS === 'ios';

const dialogTone = (tone: ISActionSheetTone): 'primary' | 'danger' =>
  tone === 'destructive' ? 'danger' : 'primary';

const ISActionSheetIOS: React.FC<ISActionSheetProps> = ({
  visible,
  onDismiss,
  title,
  message,
  actions,
  theme,
}) => {
  const backgroundColor = theme.surfaceContainerHigh ?? theme.surface;
  const fallbackBackgroundColor = Color(backgroundColor).alpha(0.9).string();
  const mainActions = actions.filter(action => action.tone !== 'cancel');
  const cancelAction = actions.find(action => action.tone === 'cancel');
  const showMainCard =
    title !== undefined || message !== undefined || mainActions.length > 0;

  const renderAction = (action: ISActionSheetAction, bold: boolean) => (
    <Pressable
      key={action.label}
      accessibilityLabel={action.label}
      accessibilityRole="button"
      onPress={() => {
        action.onPress();
        onDismiss();
      }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text
        style={[
          styles.rowLabel,
          bold && styles.rowLabelBold,
          {
            color: action.tone === 'destructive' ? theme.error : theme.primary,
          },
        ]}
      >
        {action.label}
      </Text>
    </Pressable>
  );

  return (
    <Modal
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: Color(theme.scrim ?? '#000000')
              .alpha(0.32)
              .string(),
          },
        ]}
      >
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={onDismiss}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['bottom']} style={styles.cards}>
          {showMainCard ? (
            <Glass
              glassEffectStyle="regular"
              fallbackBackgroundColor={fallbackBackgroundColor}
              isDark={theme.isDark}
              style={[styles.card, { backgroundColor }]}
            >
              {title !== undefined || message !== undefined ? (
                <View style={styles.heading}>
                  {title !== undefined ? (
                    <Text
                      style={[
                        styles.sheetTitle,
                        { color: theme.onSurfaceVariant },
                      ]}
                    >
                      {title}
                    </Text>
                  ) : null}
                  {message !== undefined ? (
                    <Text
                      style={[
                        styles.sheetMessage,
                        { color: theme.onSurfaceVariant },
                      ]}
                    >
                      {message}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              {title !== undefined || message !== undefined ? (
                mainActions.length > 0 ? (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.outlineVariant },
                    ]}
                  />
                ) : null
              ) : null}
              {mainActions.map((action, index) => (
                <React.Fragment key={action.label}>
                  {index > 0 ? (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.outlineVariant },
                      ]}
                    />
                  ) : null}
                  {renderAction(action, false)}
                </React.Fragment>
              ))}
            </Glass>
          ) : null}
          {cancelAction ? (
            <Glass
              glassEffectStyle="regular"
              fallbackBackgroundColor={fallbackBackgroundColor}
              isDark={theme.isDark}
              style={[styles.card, { backgroundColor }]}
            >
              {renderAction(cancelAction, true)}
            </Glass>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

// Android: delegates to the existing Dialog path, unchanged visuals.
const ISActionSheet: React.FC<ISActionSheetProps> = props => {
  const { visible, onDismiss, title, message, actions } = props;

  if (isIos) {
    return <ISActionSheetIOS {...props} />;
  }

  const cancelAction = actions.find(action => action.tone === 'cancel');
  const mainActions = actions.filter(action => action.tone !== 'cancel');

  return (
    <Dialog.Root visible={visible} onDismiss={onDismiss}>
      {title !== undefined || message !== undefined ? (
        <Dialog.Header>
          {title !== undefined ? <Dialog.Title>{title}</Dialog.Title> : null}
          {message !== undefined ? (
            <Dialog.Description>{message}</Dialog.Description>
          ) : null}
        </Dialog.Header>
      ) : null}
      <Dialog.Actions>
        {cancelAction ? (
          <Dialog.Action
            key={cancelAction.label}
            onPress={() => {
              cancelAction.onPress();
              onDismiss();
            }}
            tone={dialogTone(cancelAction.tone ?? 'cancel')}
          >
            {cancelAction.label}
          </Dialog.Action>
        ) : null}
        {mainActions.map(action => (
          <Dialog.Action
            key={action.label}
            onPress={() => {
              action.onPress();
              onDismiss();
            }}
            tone={dialogTone(action.tone ?? 'default')}
          >
            {action.label}
          </Dialog.Action>
        ))}
      </Dialog.Actions>
    </Dialog.Root>
  );
};

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cards: {
    gap: 8,
    padding: 8,
  },
  card: {
    borderCurve: 'continuous',
    borderRadius: 14,
    overflow: 'hidden',
  },
  heading: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
  },
  sheetMessage: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
  },
  rowLabelBold: {
    fontWeight: '600',
  },
});

export default ISActionSheet;
