import { Platform, ToastAndroid } from 'react-native';

import { publishToast } from '@components/Toast/toastBus';

export const showToast = (...message: string[]) => {
  const text = message.join(' ');
  if (Platform.OS === 'android') {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  } else {
    // ToastAndroid is a no-op on iOS; route through the Snackbar host instead.
    publishToast(text);
  }
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.trace('Toast: ', message);
  }
};
