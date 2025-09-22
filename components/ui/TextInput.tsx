import { theme } from '@/theme';
import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface ThemedTextInputProps extends Omit<TextInputProps, 'style'> {
  variant?: 'default' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  variant = 'default',
  size = 'md',
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing[4],
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      height: theme.semantic.components.input.height[size],
      paddingHorizontal: theme.semantic.components.input.padding.horizontal,
      borderWidth: theme.borderWidths[1],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.semantic.background.primary,
    };

    if (isFocused) {
      baseStyle.borderColor = theme.semantic.border.focus;
    } else if (variant === 'error' || error) {
      baseStyle.borderColor = theme.semantic.border.error;
    } else if (variant === 'success') {
      baseStyle.borderColor = theme.semantic.border.success;
    } else {
      baseStyle.borderColor = theme.semantic.border.default;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontSize: theme.typography.fontSizes[size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base'],
      color: theme.semantic.text.primary,
      paddingVertical: theme.semantic.components.input.padding.vertical,
    };

    return baseStyle;
  };

  const getLabelColor = (): 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'error' | 'warning' | 'disabled' => {
    if (error || variant === 'error') return 'error';
    if (variant === 'success') return 'success';
    return 'primary';
  };

  const getHelperTextColor = (): 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'error' | 'warning' | 'disabled' => {
    if (error || variant === 'error') return 'error';
    if (variant === 'success') return 'success';
    return 'secondary';
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <ThemedText
          variant="sm"
          color={getLabelColor()}
          weight="medium"
          style={{ marginBottom: theme.spacing[2] }}
        >
          {label}
        </ThemedText>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing[2] }}>
            {leftIcon}
          </View>
        )}
        
        <RNTextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.semantic.text.tertiary}
          {...props}
        />
        
        {rightIcon && (
          <View style={{ marginLeft: theme.spacing[2] }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <ThemedText
          variant="xs"
          color={getHelperTextColor()}
          style={{ marginTop: theme.spacing[1] }}
        >
          {error || helperText}
        </ThemedText>
      )}
    </View>
  );
};
