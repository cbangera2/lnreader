const {
  withDangerousMod,
  withXcodeProject,
  IOSConfig,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Reader CSS/JS bundled from assets/reader. Order here does not matter; the
// WebView inlines them in tag order (see readerAssets.ts).
const READER_ASSET_FILES = [
  'css/index.css',
  'css/pageReader.css',
  'css/toolWrapper.css',
  'css/tts.css',
  'js/polyfill-onscrollend.js',
  'js/icons.js',
  'js/van.js',
  'js/text-vibe.js',
  'js/core.js',
  'js/search.js',
  'js/index.js',
  'js/textRemover.js',
];

// The reader WebView loads chapter HTML from a string, so on iOS (unlike
// Android's file:///android_asset) the reader CSS/JS must live in the app
// bundle where expo-file-system can read them back at runtime. This copies
// them into the Xcode project and registers each as a bundled resource.
// iOS-only; Android keeps using file:///android_asset via withReaderAssets.
const withIosReaderAssets = config => {
  config = withDangerousMod(config, [
    'ios',
    config => {
      const projectRoot = config.modRequest.projectRoot;
      const platformRoot = config.modRequest.platformProjectRoot;
      const sourceRoot = path.join(projectRoot, 'assets', 'reader');
      const destRoot = path.join(platformRoot, 'LNReader', 'ReaderAssets');

      for (const file of READER_ASSET_FILES) {
        const src = path.join(sourceRoot, file);
        if (!fs.existsSync(src)) {
          continue;
        }
        const dest = path.join(destRoot, file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(src, dest);
      }

      return config;
    },
  ]);

  config = withXcodeProject(config, config => {
    const project = config.modResults;
    for (const file of READER_ASSET_FILES) {
      const filepath = `LNReader/ReaderAssets/${file}`;
      if (!project.hasFile(filepath)) {
        IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath,
          groupName: 'LNReader',
          project,
          isBuildFile: true,
        });
      }
    }
    return config;
  });

  return config;
};

module.exports = withIosReaderAssets;
