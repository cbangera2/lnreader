import { useEffect, useRef, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';

import { subscribeToast } from './toastBus';

const TOAST_DURATION_MS = 2500;

export const ToastHost = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return subscribeToast(text => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setMessage(text);
      setVisible(true);
      timer.current = setTimeout(() => setVisible(false), TOAST_DURATION_MS);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <Portal>
      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {message}
      </Snackbar>
    </Portal>
  );
};
