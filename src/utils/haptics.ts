import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function iosSelection(): void {
  if (Platform.OS !== 'ios') {
    return;
  }
  try {
    Haptics.selectionAsync().catch(() => undefined);
  } catch {
    // Best-effort only; haptics must never break the interaction.
  }
}

export function iosImpactLight(): void {
  if (Platform.OS !== 'ios') {
    return;
  }
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
  } catch {
    // Best-effort only; haptics must never break the interaction.
  }
}
