import { theme } from '@/theme';
import React, { useRef, useState } from 'react';
import { Pressable, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxAmount?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
  disabled?: boolean;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "$0.00",
  maxAmount = 10000,
  style,
  inputStyle,
  error,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Format currency for display
  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Parse input value
  const parseInput = (text: string): string => {
    // Remove all non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return cleaned;
  };

  const handleTextChange = (text: string) => {
    const parsed = parseInput(text);
    const numValue = parseFloat(parsed);
    
    // Check max amount
    if (numValue > maxAmount) {
      return;
    }
    
    onChange(parsed);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsEditing(true);
    // Small delay to ensure the input is rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsEditing(false);
  };

  const getContainerStyle = (): ViewStyle => ({
    borderWidth: theme.borderWidths[2],
    borderColor: error 
      ? theme.semantic.border.error 
      : isFocused 
        ? theme.semantic.border.focus 
        : theme.semantic.border.default,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: disabled ? theme.semantic.background.tertiary : theme.semantic.background.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  });

  const getInputStyle = (): TextStyle => ({
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.bold as any,
    color: disabled ? theme.semantic.text.disabled : theme.semantic.text.primary,
    textAlign: 'center',
    width: '100%',
  });

  const displayValue = isEditing && value !== '' ? `$${value}` : formatCurrency(value || '0');

  return (
    <View style={style}>
      <Pressable
        style={({ pressed }) => [
          getContainerStyle(),
          pressed && { opacity: 0.7 }
        ]}
        onPress={handleFocus}
        disabled={disabled}
      >
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={[getInputStyle(), inputStyle]}
            value={displayValue}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={theme.semantic.text.tertiary}
            editable={!disabled}
            autoFocus={isFocused}
            selectTextOnFocus
          />
        ) : (
          <ThemedText
            variant="3xl"
            weight="bold"
            color={disabled ? 'disabled' : 'primary'}
            align="center"
            style={{ width: '100%' }}
          >
            {displayValue}
          </ThemedText>
        )}
      </Pressable>
      
      {error && (
        <ThemedText
          variant="xs"
          color="error"
          align="center"
          style={{ marginTop: theme.spacing[2] }}
        >
          {error}
        </ThemedText>
      )}
    </View>
  );
};
