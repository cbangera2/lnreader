type ToastListener = (message: string) => void;

const listeners = new Set<ToastListener>();

export const publishToast = (message: string) => {
  listeners.forEach(listener => listener(message));
};

export const subscribeToast = (listener: ToastListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
