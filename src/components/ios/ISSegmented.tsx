import { Platform } from 'react-native';

import {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from '@components/SegmentedControl';

// Thin wrapper over the shared SegmentedControl (already iOS-styled on iOS).
// iOS-first default: no check icon on iOS (native segmented controls show
// labels/icons only); Android keeps the shared default (check icon on).
export function ISSegmented<T extends string = string>(
  props: SegmentedControlProps<T>,
) {
  const { showCheckIcon = Platform.OS !== 'ios', ...rest } = props;
  return <SegmentedControl {...rest} showCheckIcon={showCheckIcon} />;
}

export type {
  SegmentedControlOption as ISSegmentedOption,
  SegmentedControlProps as ISSegmentedProps,
};
