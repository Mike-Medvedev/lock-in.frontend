import { theme } from '@/theme';
import React from 'react';
import { ImageProps, ImageStyle, Image as RNImage } from 'react-native';

interface ThemedImageProps extends Omit<ImageProps, 'style'> {
  variant?: 'default' | 'rounded' | 'circle';
  style?: ImageStyle;
}

export const ThemedImage: React.FC<ThemedImageProps> = ({
  variant = 'default',
  style,
  ...props
}) => {
  const getImageStyle = (): ImageStyle => {
    const baseStyle: ImageStyle = {};

    switch (variant) {
      case 'rounded':
        return {
          ...baseStyle,
          borderRadius: theme.borderRadius.lg,
        };
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: theme.borderRadius.full,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <RNImage
      style={[getImageStyle(), style]}
      {...props}
    />
  );
};
