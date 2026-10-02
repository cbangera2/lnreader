import { NativeModules } from 'react-native';
import { File, Paths } from 'expo-file-system';

export interface ReaderAsset {
  /** Path served by the Metro middleware in dev (see metro.config.js). */
  devPath: string;
  /** Filename as registered in the iOS app bundle (flat, no subfolders). */
  bundleName: string;
}

const css = (name: string): ReaderAsset => ({
  devPath: `css/${name}`,
  bundleName: name,
});

const js = (name: string): ReaderAsset => ({
  devPath: `js/${name}`,
  bundleName: name,
});

/**
 * Order matches the <link>/<script> tags in WebViewReader so the inlined
 * document behaves identically to Android's file:///android_asset version.
 */
export const READER_CSS_ASSETS: readonly ReaderAsset[] = [
  css('index.css'),
  css('pageReader.css'),
  css('toolWrapper.css'),
  css('tts.css'),
];

export const READER_JS_ASSETS: readonly ReaderAsset[] = [
  js('polyfill-onscrollend.js'),
  js('icons.js'),
  js('van.js'),
  js('text-vibe.js'),
  js('core.js'),
  js('search.js'),
  js('index.js'),
  js('textRemover.js'),
];

/**
 * Base URL of the Metro dev server, derived from the running bundle so it
 * works on simulator (localhost) and physical devices (LAN) alike.
 */
export const getDevServerBaseUrl = (): string => {
  const scriptURL: string | undefined =
    NativeModules.SourceCode?.scriptURL ?? undefined;
  const match =
    typeof scriptURL === 'string' ? scriptURL.match(/^https?:\/\/[^/]+/) : null;
  return match?.[0] ?? 'http://localhost:8081';
};

const textCache = new Map<string, Promise<string>>();

export const readBundleAssetText = async (
  asset: ReaderAsset,
): Promise<string> => {
  const file = new File(Paths.bundle, asset.bundleName);
  return file.text();
};

const fetchDevAssetText = async (
  asset: ReaderAsset,
  baseUrl: string,
): Promise<string> => {
  const response = await fetch(`${baseUrl}/assets/${asset.devPath}`);
  if (!response.ok) {
    throw new Error(
      `Failed to load reader asset ${asset.devPath}: ${response.status}`,
    );
  }
  return response.text();
};

/**
 * Reader CSS/JS as text. In dev it comes from the Metro middleware (so reader
 * style/script edits hot-reload); in release builds it is read back from the
 * app bundle resources installed by the withIosReaderAssets plugin.
 */
export const loadReaderAssetText = (asset: ReaderAsset): Promise<string> => {
  const key = asset.devPath;
  const cached = textCache.get(key);
  if (cached) {
    return cached;
  }
  const pending = __DEV__
    ? fetchDevAssetText(asset, getDevServerBaseUrl())
    : readBundleAssetText(asset);
  textCache.set(key, pending);
  pending.catch(() => {
    textCache.delete(key);
  });
  return pending;
};

export const loadReaderAssetsText = async (
  assets: readonly ReaderAsset[],
): Promise<string> => {
  const texts = await Promise.all(assets.map(loadReaderAssetText));
  return texts.join('\n');
};
