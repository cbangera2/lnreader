import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { iosImpactLight, iosSelection } from '../haptics';

describe('haptics', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    jest.clearAllMocks();
  });

  it('triggers selection feedback on iOS', () => {
    Platform.OS = 'ios';

    iosSelection();

    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('triggers light impact feedback on iOS', () => {
    Platform.OS = 'ios';

    iosImpactLight();

    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light,
    );
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });

  it('does nothing on Android', () => {
    Platform.OS = 'android';

    iosSelection();
    iosImpactLight();

    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('swallows haptic rejections', async () => {
    Platform.OS = 'ios';
    jest
      .mocked(Haptics.selectionAsync)
      .mockRejectedValueOnce(new Error('no haptics'));
    jest
      .mocked(Haptics.impactAsync)
      .mockRejectedValueOnce(new Error('no haptics'));

    expect(() => {
      iosSelection();
      iosImpactLight();
    }).not.toThrow();

    await new Promise(resolve => setTimeout(resolve, 0));
  });
});
