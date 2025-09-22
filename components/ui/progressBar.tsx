import { theme } from '@/theme';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'default',
  size = 'md',
  style,
  animated = true,
}) => {
  const getBarHeight = (): number => {
    switch (size) {
      case 'sm': return 4;
      case 'md': return 6;
      case 'lg': return 8;
      default: return 6;
    }
  };

  const getBarColor = (): string => {
    switch (variant) {
      case 'success': return theme.semantic.interactive.success.default;
      case 'error': return theme.semantic.interactive.error.default;
      case 'warning': return theme.semantic.interactive.warning.default;
      default: return theme.semantic.interactive.primary.default;
    }
  };

  const containerStyle: ViewStyle = {
    height: getBarHeight(),
    backgroundColor: theme.semantic.background.tertiary,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  };

  const fillStyle: ViewStyle = {
    height: '100%',
    width: `${Math.min(Math.max(value, 0), 100)}%`,
    backgroundColor: getBarColor(),
    borderRadius: theme.borderRadius.full,
  };

  return (
    <View style={[containerStyle, style]}>
      <View style={fillStyle} />
    </View>
  );
};
