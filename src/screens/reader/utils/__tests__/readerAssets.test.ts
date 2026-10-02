import { NativeModules } from 'react-native';
import { File, Paths } from 'expo-file-system';

import {
  READER_CSS_ASSETS,
  READER_JS_ASSETS,
  getDevServerBaseUrl,
  loadReaderAssetText,
  loadReaderAssetsText,
  readBundleAssetText,
  type ReaderAsset,
} from '../readerAssets';

jest.mock('expo-file-system', () => {
  const FileMock = jest.fn((bundle: unknown, bundleName: string) => ({
    text: () =>
      Promise.resolve(
        (
          FileMock as unknown as {
            textByBundleName: Record<string, string>;
          }
        ).textByBundleName[bundleName] ?? '',
      ),
  }));
  (
    FileMock as unknown as {
      textByBundleName: Record<string, string>;
    }
  ).textByBundleName = {};
  return {
    File: FileMock,
    Paths: { bundle: { uri: 'file:///mock/bundle/' } },
  };
});

type FileMockType = jest.Mock & { textByBundleName: Record<string, string> };
const FileMock = File as unknown as FileMockType;

describe('getDevServerBaseUrl', () => {
  const originalSourceCode = NativeModules.SourceCode;

  afterEach(() => {
    NativeModules.SourceCode = originalSourceCode;
  });

  it('derives the host from the running bundle URL', () => {
    NativeModules.SourceCode = {
      scriptURL: 'http://192.168.1.5:8081/index.bundle?platform=ios&dev=true',
    };
    expect(getDevServerBaseUrl()).toBe('http://192.168.1.5:8081');
  });

  it('falls back to localhost when the bundle URL is unavailable', () => {
    NativeModules.SourceCode = undefined;
    expect(getDevServerBaseUrl()).toBe('http://localhost:8081');
  });
});

describe('loadReaderAssetText', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches missing assets from the Metro middleware in dev', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => 'body{color:red}',
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    // A probe asset keeps this test independent of the shared-asset cache.
    const asset: ReaderAsset = {
      devPath: 'css/probe.css',
      bundleName: 'probe.css',
    };
    await expect(loadReaderAssetText(asset)).resolves.toBe('body{color:red}');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8081/assets/css/probe.css',
    );

    // Second load comes from the cache without another network request.
    await loadReaderAssetText(asset);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('joins css and js in tag order', async () => {
    const fetchMock = jest
      .fn()
      .mockImplementation(async (url: string) => ({
        ok: true,
        text: async () => `/* ${url} */`,
      }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const css = await loadReaderAssetsText(READER_CSS_ASSETS);
    expect(css).toContain('/* http://localhost:8081/assets/css/index.css */');
    expect(css.indexOf('assets/css/index.css')).toBeLessThan(
      css.indexOf('assets/css/pageReader.css'),
    );

    const js = await loadReaderAssetsText(READER_JS_ASSETS);
    expect(js).toContain('assets/js/polyfill-onscrollend.js');
    expect(js.indexOf('assets/js/core.js')).toBeLessThan(
      js.indexOf('assets/js/index.js'),
    );
  });

  it('reads release assets back from the app bundle', async () => {
    FileMock.textByBundleName['index.css'] = 'body{color:red}';
    await expect(readBundleAssetText(READER_CSS_ASSETS[0])).resolves.toBe(
      'body{color:red}',
    );
    expect(FileMock).toHaveBeenCalledWith(Paths.bundle, 'index.css');
  });
});
