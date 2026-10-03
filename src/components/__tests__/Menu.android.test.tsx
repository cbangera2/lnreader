import './mocks';
import { render, screen } from '@testing-library/react-native';

import Menu from '../Menu';

// Android-token counterpart to Menu.test.tsx (which runs under the default
// iOS platform). StyleSheet values are fixed at module load; jest hoists the
// mock below above these imports, so the platform is forced before Menu is
// evaluated. Note iOS's Platform.select keys off `'ios' in spec` rather than
// Platform.OS, so both are overridden.
jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  actual.Platform.OS = 'android';
  actual.Platform.select = <T,>(spec: { android?: T; default: T }): T =>
    'android' in spec ? (spec.android as T) : spec.default;
  return actual;
});

const mockUseTheme = jest.fn();

jest.mock('@hooks/persisted', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('Menu on Android', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      isDark: false,
      onSurface: '#1d1b20',
      rippleColor: '#1d1b201f',
      shadow: '#000000',
      surface: '#fffbfe',
      surface2: '#f7f2fa',
      surfaceContainerLow: '#f7f2fa',
    });
  });

  it('uses Material 3 container and item tokens', () => {
    render(
      <Menu anchor={<></>} onDismiss={() => {}} visible>
        <Menu.Item onPress={() => {}} title="Open" />
      </Menu>,
    );

    expect(
      screen.getByTestId('menu', { includeHiddenElements: true }),
    ).toHaveStyle({
      backgroundColor: '#f7f2fa',
      borderRadius: 4,
      elevation: 2,
      minWidth: 112,
    });
    expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveStyle({
      minHeight: 48,
      paddingHorizontal: 12,
      paddingVertical: 8,
    });
    expect(screen.getByText('Open')).toHaveStyle({
      fontSize: 14,
      fontWeight: '500',
      letterSpacing: 0.1,
      lineHeight: 20,
    });
  });
});
