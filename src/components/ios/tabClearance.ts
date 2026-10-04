import { Platform } from 'react-native';

// Bottom clearance (pt) for scroll content on tab screens so the last items
// clear the floating iOS glass dock (bar height + 16pt side margins + 8pt
// bottom margin + home-indicator inset, rounded up). Android keeps the
// attached bar, so no clearance is needed there.
export const IOS_TAB_CLEARANCE = Platform.OS === 'ios' ? 132 : 0;
