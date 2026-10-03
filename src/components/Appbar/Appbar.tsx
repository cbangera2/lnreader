import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { Appbar as PaperAppbar } from 'react-native-paper';
import Glass from '@components/Glass/Glass';
import { ThemeColors } from '../../theme/types';

interface AppbarProps {
  title: string;
  handleGoBack?: () => void;
  theme: ThemeColors;
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
  children?: React.ReactNode;
}

const Appbar: React.FC<AppbarProps> = ({
  title,
  handleGoBack,
  theme,
  mode,
  children,
}) => {
  const resolvedMode =
    mode ??
    Platform.select({
      ios: 'center-aligned',
      default: 'large',
    } as const) ??
    'large';

  const header = (
    <PaperAppbar.Header
      style={{
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.surface,
      }}
      statusBarHeight={
        Platform.OS === 'android' ? StatusBar.currentHeight : undefined
      }
      mode={resolvedMode}
    >
      {handleGoBack && (
        <PaperAppbar.BackAction
          onPress={handleGoBack}
          iconColor={theme.onSurface}
        />
      )}
      <PaperAppbar.Content
        title={title}
        titleStyle={{ color: theme.onSurface }}
      />
      {children}
    </PaperAppbar.Header>
  );

  if (Platform.OS === 'ios') {
    return (
      <Glass fallbackBackgroundColor={theme.surface} isDark={theme.isDark}>
        {header}
      </Glass>
    );
  }

  return header;
};

export default Appbar;
