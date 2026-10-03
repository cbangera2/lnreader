const React = require('react');
const { View } = require('react-native');

jest.mock('expo-glass-effect', () => {
  const ReactMock = require('react');
  const { View: RNView } = require('react-native');
  const MockGlassView = ReactMock.forwardRef((props, ref) =>
    ReactMock.createElement(RNView, { ...props, ref }),
  );
  MockGlassView.displayName = 'GlassView';
  return {
    __esModule: true,
    default: MockGlassView,
    GlassView: MockGlassView,
    GlassContainer: MockGlassView,
    isLiquidGlassAvailable: jest.fn(() => false),
    isGlassEffectAPIAvailable: jest.fn(() => false),
  };
});

jest.mock('expo-blur', () => {
  const ReactMock = require('react');
  const { View: RNView } = require('react-native');
  const MockBlurView = ReactMock.forwardRef((props, ref) =>
    ReactMock.createElement(RNView, { ...props, ref }),
  );
  MockBlurView.displayName = 'BlurView';
  return {
    __esModule: true,
    BlurView: MockBlurView,
  };
});

module.exports = {};
