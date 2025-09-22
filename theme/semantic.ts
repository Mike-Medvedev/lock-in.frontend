import { tokens } from './tokens';

// Semantic Design Tokens
export const semantic = {
  // Background colors
  background: {
    primary: tokens.colors.white,
    secondary: tokens.colors.neutral[50],
    tertiary: tokens.colors.neutral[100],
    inverse: tokens.colors.neutral[900],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text colors
  text: {
    primary: tokens.colors.neutral[900],
    secondary: tokens.colors.neutral[600],
    tertiary: tokens.colors.neutral[500],
    inverse: tokens.colors.white,
    disabled: tokens.colors.neutral[400],
    success: tokens.colors.success[600],
    error: tokens.colors.error[600],
    warning: tokens.colors.warning[600],
  },
  
  // Interactive colors
  interactive: {
    primary: {
      default: tokens.colors.primary[600],
      hover: tokens.colors.primary[700],
      active: tokens.colors.primary[800],
      disabled: tokens.colors.neutral[300],
    },
    secondary: {
      default: tokens.colors.neutral[200],
      hover: tokens.colors.neutral[300],
      active: tokens.colors.neutral[400],
      disabled: tokens.colors.neutral[100],
    },
    success: {
      default: tokens.colors.success[600],
      hover: tokens.colors.success[700],
      active: tokens.colors.success[800],
    },
    error: {
      default: tokens.colors.error[600],
      hover: tokens.colors.error[700],
      active: tokens.colors.error[800],
    },
    warning: {
      default: tokens.colors.warning[600],
      hover: tokens.colors.warning[700],
      active: tokens.colors.warning[800],
    },
  },
  
  // Border colors
  border: {
    default: tokens.colors.neutral[200],
    subtle: tokens.colors.neutral[100],
    strong: tokens.colors.neutral[300],
    focus: tokens.colors.primary[500],
    success: tokens.colors.success[500],
    error: tokens.colors.error[500],
  },
  
  // Status colors
  status: {
    success: {
      background: tokens.colors.success[50],
      border: tokens.colors.success[200],
      text: tokens.colors.success[800],
      icon: tokens.colors.success[600],
    },
    error: {
      background: tokens.colors.error[50],
      border: tokens.colors.error[200],
      text: tokens.colors.error[800],
      icon: tokens.colors.error[600],
    },
    warning: {
      background: tokens.colors.warning[50],
      border: tokens.colors.warning[200],
      text: tokens.colors.warning[800],
      icon: tokens.colors.warning[600],
    },
    info: {
      background: tokens.colors.primary[50],
      border: tokens.colors.primary[200],
      text: tokens.colors.primary[800],
      icon: tokens.colors.primary[600],
    },
  },
  
  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: 40,
        md: 48,
        lg: 56,
      },
      padding: {
        sm: { horizontal: tokens.spacing[3], vertical: tokens.spacing[2] },
        md: { horizontal: tokens.spacing[4], vertical: tokens.spacing[3] },
        lg: { horizontal: tokens.spacing[6], vertical: tokens.spacing[4] },
      },
    },
    
    input: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      padding: {
        horizontal: tokens.spacing[4],
        vertical: tokens.spacing[3],
      },
    },
    
    card: {
      padding: tokens.spacing[5],
      borderRadius: tokens.borderRadius.lg,
      shadow: tokens.shadows.base,
    },
    
    badge: {
      padding: {
        sm: { horizontal: tokens.spacing[2], vertical: tokens.spacing[1] },
        md: { horizontal: tokens.spacing[3], vertical: tokens.spacing[2] },
      },
      borderRadius: tokens.borderRadius.full,
    },
  },
};
