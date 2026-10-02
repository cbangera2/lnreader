import { Platform, ToastAndroid } from 'react-native';

import { showToast } from '../showToast';
import { publishToast } from '@components/Toast/toastBus';

jest.mock('@components/Toast/toastBus', () => ({
  publishToast: jest.fn(),
}));

const mockPublishToast = jest.mocked(publishToast);

describe('showToast', () => {
  let mockToastAndroidShow: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockToastAndroidShow = jest
      .spyOn(ToastAndroid, 'show')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses ToastAndroid on Android', () => {
    const os = jest.replaceProperty(Platform, 'OS', 'android');
    showToast('hello', 'world');
    expect(mockToastAndroidShow).toHaveBeenCalledWith(
      'hello world',
      ToastAndroid.SHORT,
    );
    expect(mockPublishToast).not.toHaveBeenCalled();
    os.restore();
  });

  it('publishes to the toast bus on iOS', () => {
    const os = jest.replaceProperty(Platform, 'OS', 'ios');
    showToast('hello');
    expect(mockPublishToast).toHaveBeenCalledWith('hello');
    expect(mockToastAndroidShow).not.toHaveBeenCalled();
    os.restore();
  });
});
