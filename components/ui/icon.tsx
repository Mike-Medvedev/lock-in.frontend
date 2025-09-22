import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'inverse' | 'disabled';
  customColor?: string;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'primary',
  customColor,
  style,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 20;
    }
  };

  const getColor = (): string => {
    if (customColor) return customColor;
    
    switch (color) {
      case 'primary': return theme.semantic.text.primary;
      case 'secondary': return theme.semantic.text.secondary;
      case 'tertiary': return theme.semantic.text.tertiary;
      case 'success': return theme.semantic.text.success;
      case 'error': return theme.semantic.text.error;
      case 'warning': return theme.semantic.text.warning;
      case 'inverse': return theme.semantic.text.inverse;
      case 'disabled': return theme.semantic.text.disabled;
      default: return theme.semantic.text.primary;
    }
  };

  return (
    <View style={style}>
      <Ionicons
        name={name}
        size={getSize()}
        color={getColor()}
      />
    </View>
  );
};
