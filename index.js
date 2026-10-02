import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { AppRegistry, I18nManager, Platform } from 'react-native';
import { i18n } from './src/i18n/translations';
import { installJsCrashHandler } from './src/services/crashLogs/installJsCrashHandler';

installJsCrashHandler();

if (Platform.OS === 'android') {
  // Headless JS tasks are Android-only. Require lazily so the native
  // background-tasks module, which isn't linked on iOS, is never imported
  // there (its import throws when the module is absent).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { runHeadlessBackgroundTask } = require('./src/services/backgroundTasks');
  AppRegistry.registerHeadlessTask(
    'LNReaderBackgroundTask',
    () => runHeadlessBackgroundTask,
  );
}

const isRTL = i18n.locale.startsWith('ar') || i18n.locale.startsWith('he');
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
