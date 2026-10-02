import { Platform } from 'react-native';
import { File } from 'expo-file-system';
import NativeFile from '@modules/native-file';

import { downloadFile } from '../fetch';

jest.mock('expo-file-system', () => {
  const FileMock = jest.fn();
  (FileMock as unknown as { downloadFileAsync: unknown }).downloadFileAsync =
    jest.fn();
  return {
    File: FileMock,
    Paths: { bundle: { uri: 'file:///mock/bundle/' } },
  };
});

const FileMock = File as unknown as jest.Mock & {
  downloadFileAsync: jest.Mock;
};

describe('downloadFile', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    jest.clearAllMocks();
  });

  it('uses expo-file-system on iOS instead of the Android-only native module', async () => {
    Platform.OS = 'ios';

    await downloadFile('https://example.com/cover.png', '/mock/novels/cover.png', {
      headers: { 'User-Agent': 'test' },
    });

    expect(FileMock).toHaveBeenCalledWith('/mock/novels/cover.png');
    expect(FileMock.downloadFileAsync).toHaveBeenCalledWith(
      'https://example.com/cover.png',
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({ 'User-Agent': 'test' }),
        idempotent: true,
      }),
    );
  });

  it('keeps using NativeFile.downloadFile on Android', async () => {
    Platform.OS = 'android';

    await downloadFile('https://example.com/cover.png', '/mock/novels/cover.png');

    expect(jest.mocked(NativeFile.downloadFile)).toHaveBeenCalledWith(
      'https://example.com/cover.png',
      '/mock/novels/cover.png',
      'get',
      expect.anything(),
      undefined,
    );
    expect(FileMock.downloadFileAsync).not.toHaveBeenCalled();
  });
});
