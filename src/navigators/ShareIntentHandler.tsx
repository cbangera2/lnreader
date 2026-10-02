import { useEffect } from 'react';
import { useEventListener } from 'expo';

import NativeShareReceiver from '@modules/native-share-receiver';
import { handleSharedText } from './shareIntent';

const ShareIntentHandler = () => {
  useEffect(() => {
    let active = true;
    Promise.resolve(NativeShareReceiver.getInitialSharedText())
      .then(text => {
        if (active && text) {
          handleSharedText(text);
        }
      })
      .catch(() => {
        // Nothing to act on if the initial intent cannot be read.
      });
    return () => {
      active = false;
    };
  }, []);

  useEventListener(NativeShareReceiver, 'SharedText', ({ text }) => {
    if (text) {
      handleSharedText(text);
    }
  });

  return null;
};

export default ShareIntentHandler;
