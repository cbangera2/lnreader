import React from 'react';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';

// Sibling agent owns ./ISIcon (SF Symbols on iOS, Material names as input).
// This shim resolves it defensively so the kit type-checks and renders before
// and after consolidation, whatever export shape ISIcon uses.

export interface ISIconProps {
  name: string;
  size?: number;
  color?: string;
}

type MaterialIconName = React.ComponentProps<typeof MaterialIcon>['name'];

const FallbackIcon: React.FC<ISIconProps> = ({ name, size = 22, color }) => (
  <MaterialIcon
    name={name as unknown as MaterialIconName}
    size={size}
    color={color}
  />
);

type ResolvedISIcon = React.ComponentType<ISIconProps>;

const loadISIcon = (): ResolvedISIcon => {
  try {
    const mod = require('./ISIcon') as {
      default?: ResolvedISIcon;
      ISIcon?: ResolvedISIcon;
    };
    return mod.default ?? mod.ISIcon ?? FallbackIcon;
  } catch {
    return FallbackIcon;
  }
};

const ISIcon: ResolvedISIcon = loadISIcon();

export default ISIcon;
