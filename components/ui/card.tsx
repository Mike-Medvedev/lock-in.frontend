import { theme } from '@/theme';
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.semantic.background.primary,
      borderRadius: theme.semantic.components.card.borderRadius,
    };

    const paddingMap = {
      none: 0,
      sm: theme.spacing[3],
      md: theme.semantic.components.card.padding,
      lg: theme.spacing[6],
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          ...theme.shadows.sm,
        };
      case 'elevated':
        return {
          ...baseStyle,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: theme.borderWidths[1],
          borderColor: theme.semantic.border.default,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View
      style={[
        getCardStyle(),
        { padding: padding === 'md' ? theme.semantic.components.card.padding : theme.spacing[padding === 'sm' ? 3 : padding === 'lg' ? 6 : 0] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
