import { theme } from '@/theme';
import React from 'react';
import { ActivityIndicatorProps, ActivityIndicator as RNActivityIndicator, ViewStyle } from 'react-native';

interface ThemedActivityIndicatorProps extends Omit<ActivityIndicatorProps, 'color' | 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const ActivityIndicator: React.FC<ThemedActivityIndicatorProps> = ({
  variant = 'primary',
  size = 'md',
  style,
  ...props
}) => {
  const getColor = (): string => {
    switch (variant) {
      case 'primary': return theme.semantic.interactive.primary.default;
      case 'secondary': return theme.semantic.text.secondary;
      case 'success': return theme.semantic.interactive.success.default;
      case 'error': return theme.semantic.interactive.error.default;
      case 'warning': return theme.semantic.interactive.warning.default;
      default: return theme.semantic.interactive.primary.default;
    }
  };

  const getSize = (): 'small' | 'large' | number => {
    switch (size) {
      case 'sm': return 'small';
      case 'md': return 'large';
      case 'lg': return 32;
      default: return 'large';
    }
  };

  return (
    <RNActivityIndicator
      color={getColor()}
      size={getSize()}
      style={style}
      {...props}
    />
  );
};
