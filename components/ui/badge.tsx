import { theme } from '@/theme';
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface BadgeProps extends Omit<ViewProps, 'style'> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  style,
  children,
  ...props
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.semantic.components.badge.borderRadius,
      paddingHorizontal: theme.semantic.components.badge.padding[size].horizontal,
      paddingVertical: theme.semantic.components.badge.padding[size].vertical,
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.interactive.primary.default,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.status.success.background,
          borderWidth: theme.borderWidths[1],
          borderColor: theme.semantic.status.success.border,
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.status.error.background,
          borderWidth: theme.borderWidths[1],
          borderColor: theme.semantic.status.error.border,
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.status.warning.background,
          borderWidth: theme.borderWidths[1],
          borderColor: theme.semantic.status.warning.border,
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.status.info.background,
          borderWidth: theme.borderWidths[1],
          borderColor: theme.semantic.status.info.border,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'error' | 'warning' | 'disabled' => {
    switch (variant) {
      case 'default':
        return 'inverse';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const getTextSize = (): 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' => {
    return size === 'sm' ? 'xs' : 'sm';
  };

  return (
    <View style={[getBadgeStyle(), style]} {...props}>
      <ThemedText
        variant={getTextSize()}
        color={getTextColor()}
        weight="semibold"
      >
        {children}
      </ThemedText>
    </View>
  );
};
