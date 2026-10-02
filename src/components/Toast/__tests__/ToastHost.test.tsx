import { act, render, screen } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { ToastHost } from '../ToastHost';
import { publishToast } from '../toastBus';

const renderHost = () =>
  render(
    <PaperProvider>
      <ToastHost />
    </PaperProvider>,
  );

describe('ToastHost', () => {
  it('shows the published message in a Snackbar', () => {
    renderHost();
    expect(screen.queryByText('hello ios')).toBeNull();

    act(() => {
      publishToast('hello ios');
    });

    expect(screen.getByText('hello ios')).toBeTruthy();
  });

  it('replaces the message when a new toast arrives', () => {
    renderHost();

    act(() => {
      publishToast('first');
    });
    expect(screen.getByText('first')).toBeTruthy();

    act(() => {
      publishToast('second');
    });
    expect(screen.getByText('second')).toBeTruthy();
    expect(screen.queryByText('first')).toBeNull();
  });
});
