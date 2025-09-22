import { theme } from '@/theme';
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface BackgroundProps extends Omit<ViewProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({
  variant = 'primary',
  style,
  children,
  ...props
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary': return theme.semantic.background.primary;
      case 'secondary': return theme.semantic.background.secondary;
      case 'tertiary': return theme.semantic.background.tertiary;
      default: return theme.semantic.background.primary;
    }
  };

  const backgroundStyle: ViewStyle = {
    flex: 1,
    backgroundColor: getBackgroundColor(),
  };

  return (
    <View style={[backgroundStyle, style]} {...props}>
      {children}
    </View>
  );
};
