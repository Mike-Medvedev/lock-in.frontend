import { theme } from '@/theme';
import React from 'react';
import { Pressable, PressableProps, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'error';
  style?: ViewStyle;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  color = 'primary',
  style,
  children,
  disabled,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      minHeight: theme.semantic.components.button.height[size],
      paddingHorizontal: theme.semantic.components.button.padding[size].horizontal,
      paddingVertical: theme.semantic.components.button.padding[size].vertical,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing[2],
      flexShrink: 0,

    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.semantic.interactive.primary.disabled,
        borderWidth: 0,
      };
    }

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.semantic.interactive[color].default,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderColor: '#FFFFFF', // Explicit white border
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'error' | 'warning' | 'disabled' => {
    if (disabled) return 'disabled';
    
    switch (variant) {
      case 'filled':
        return 'inverse';
      case 'outlined':
        return 'inverse'; // White text for outlined buttons
      case 'ghost':
        return color === 'primary' ? 'primary' : color;
      default:
        return 'primary';
    }
  };

  const getTextSize = (): 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' => {
    switch (size) {
      case 'sm': return 'sm';
      case 'md': return 'base';
      case 'lg': return 'lg';
      default: return 'base';
    }
  };

  // Check if children is just a string
  const isTextOnly = typeof children === 'string';
  
  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && { opacity: 0.8 },
        style
      ]}
      disabled={disabled}
      {...props}
    >
      {isTextOnly ? (
        <ThemedText
          variant={getTextSize()}
          color={getTextColor()}
          weight="semibold"
          align="center"
          style={{ textAlign: 'center' }}
        >
          {children}
        </ThemedText>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
          {children}
        </View>
      )}
    </Pressable>
  );
};