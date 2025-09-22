import { theme } from '@/theme';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface ThemedTextProps extends Omit<TextProps, 'style'> {
  variant?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'error' | 'warning' | 'disabled';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'base',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle: TextStyle = {
    fontSize: theme.typography.fontSizes[variant],
    fontWeight: theme.typography.fontWeights[weight] as any,
    color: theme.semantic.text[color],
    textAlign: align,
    lineHeight: theme.typography.fontSizes[variant] * 1.2, // Tighter line height
  };

  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};
