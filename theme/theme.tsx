

const primitives = {
    color: {
        green: "#20A761",
        green1: "#D0F1DF",
        lightGreen: "#62D097",
        darkGreen: "#1C5F3C",
        grey: "#888888",
        lightGrey: "#DDDDDD",
        white: "#ffffff",
        black: "#131516",
        lightBlack: "#373E40",
        red: "#DB222A",
        yellow: "#F0E100",
    },
    sizing: {
        sizingXs: 4,
        sizingS: 8,
        sizingSm: 12,
        sizingM: 16,
        sizingLm: 20,
        sizingLg: 24,
        sizingLX: 28,
        sizingXL: 32,
      },
      spacing: {
        spacingXs: 4,
        spacingS: 8,
        spacingSm: 12,
        spacingM: 16,
        spacingLm: 20,
        spacingLg: 24,
        spacingLX: 28,
        spacingXL: 32,
        spacingXXL: 48,
        spacingXXXL: 64,
      },
    typography: {
        fontSizeS: 14,
        fontSizeM: 16,
        fontSizeL: 18,
        fontSizeXL: 24,
        fontSizeXXL: 32,
        fontWeight4: "400",
        fontWeight5: "500",
        fontWeight7: "700",
        fontWeight8: "800",
        lineHeight: 1.5,
    },
    border:{
        borderWidth1: 1,
        borderWidth2: 2,
        borderWidth3: 3,
    },
    radius: {
        radiusS: 2,
        radiusM: 4,
        radiusL: 6,
        radiusXL: 8,
    },
    shadow: {
        shadowS: "0 2 rgba(0, 0, 0, 0.2)",
        shadowM: "0 2 rgba(0, 0, 0, 0.5)",
        shadowL: "0 2 rgba(0, 0, 0, 1)"
    }
    
    
    
}

const semantic = {
    color: {
        primary: primitives.color.green,
        primaryActive: primitives.color.lightGreen,
        primaryHover: primitives.color.darkGreen,
        primaryVariant: primitives.color.lightGreen,
        onPrimary: primitives.color.white,
        onSurface: primitives.color.black,
        background: primitives.color.white,
        text: primitives.color.black,
        secondaryText: primitives.color.grey,
        successText: primitives.color.darkGreen,
        errorText: primitives.color.red,
        surface: primitives.color.white,
        success: primitives.color.green1,
        error: primitives.color.red,
        warning: primitives.color.yellow,
        border: primitives.color.lightGrey,
        focusRing: primitives.color.lightGreen,
        focusError: primitives.color.red,
        
    },
    shadow: {
        shadowSmall: primitives.shadow.shadowS,
        shadowMedium: primitives.shadow.shadowM,
        shadowLarge: primitives.shadow.shadowL,
    },
    radius: {
        radiusSmall: primitives.radius.radiusS,
        radiusMedium: primitives.radius.radiusM,
        radiusLarge: primitives.radius.radiusL,
        radiusXL: primitives.radius.radiusXL
    },
    typography: {
        fontWeightNormal: primitives.typography.fontWeight4,
        fontWeightBold: primitives.typography.fontWeight7,
        fontSizeBase: primitives.typography.fontSizeM,
        fontSizeSmall: primitives.typography.fontSizeS,
        fontSizeLarge: primitives.typography.fontSizeL,
        fontSizeXL: primitives.typography.fontSizeXL,
        fontSizeXXL: primitives.typography.fontSizeXXL,
        lineHeightBase: primitives.typography.lineHeight,
    },
    border: {
        borderWidthSmall: primitives.border.borderWidth1,
        borderWidthMedium: primitives.border.borderWidth2,
        borderWidthLarge: primitives.border.borderWidth3,
        borderColorDefault: primitives.color.lightGrey,    
        borderColorSuccess: primitives.color.lightGreen,
        borderColorError: primitives.color.red 
    },
    spacing: {
        spacingExtraSmall: primitives.spacing.spacingXs,
        spacingSmall: primitives.spacing.spacingS,
        spacingMedium: primitives.spacing.spacingM,
        spacingLarge: primitives.spacing.spacingLg,
        spacingXL: primitives.spacing.spacingXL
    },
    sizing: {
        sizingExtraSmall: primitives.sizing.sizingXs,
        sizingSmall: primitives.sizing.sizingS,
        sizingMedium: primitives.spacing.spacingM,
        sizingLarge: primitives.spacing.spacingLg,
        sizingXL: primitives.sizing.sizingXL
    }
    


}

const theme = {
    text: {
        defaultColor: semantic.color.text,
        secondaryColor: semantic.color.secondaryText,
        successText: semantic.color.successText,
        errorText: semantic.color.errorText,
        lineHeight: semantic.typography.lineHeightBase,
        fontSizeSmall: semantic.typography.fontSizeSmall,
        fontSizeBase: semantic.typography.fontSizeBase,
        fontSizeLarge: semantic.typography.fontSizeLarge,
        fontSizeXL: semantic.typography.fontSizeXL,
        fontSizeXXL: semantic.typography.fontSizeXXL,
        fontWeightNormal: primitives.typography.fontWeight4,
        fontWeightBold: primitives.typography.fontWeight7,
    },
    button: {
        background: semantic.color.primary,
        hover: semantic.color.primaryHover,
        active: semantic.color.primaryActive,
        borderColor: semantic.border.borderColorDefault,
        borderWidth: semantic.border.borderWidthSmall,
        borderRadius: semantic.radius.radiusMedium,
        focusRing: semantic.color.focusRing,
        focusError: semantic.color.focusError,
        color: semantic.color.onPrimary,
        shadow: semantic.shadow.shadowMedium,
        padding: semantic.spacing.spacingMedium,
        margin: semantic.spacing.spacingSmall
    },
    background: {
        color: semantic.color.background, 
      },
      
    card: {
        background: semantic.color.surface, 
        border: semantic.color.border,       
        borderWidth: semantic.border.borderWidthSmall,
        shadow: semantic.shadow.shadowSmall,  
        radius: semantic.radius.radiusXL, 
        padding: semantic.spacing.spacingLarge,
        margin: semantic.spacing.spacingMedium,
        successBackgroundColor: semantic.color.success,
        successBorderColor: semantic.border.borderColorSuccess
      },
    badge: {
        borderColor: semantic.border.borderColorDefault,
        borderRadius: semantic.radius.radiusXL,
        borderWidth: semantic.border.borderWidthSmall,
        padding: semantic.spacing.spacingSmall,
        success: {
            color: semantic.color.successText,
            backgroundColor: semantic.color.success,
            borderColor: semantic.border.borderColorSuccess
        },
        error:{
            color: semantic.color.errorText,
            backgroundColor: semantic.color.error,
            borderColor: semantic.border.borderColorError
        }
    },
    progressBar: {
        borderRadius: semantic.radius.radiusLarge,
        loadingColor: semantic.color.primary,
        backgroundColor: semantic.color.primaryVariant
    },
    icon: {
        color: semantic.color.secondaryText,
        colorActive: semantic.color.primary, 
        colorDisabled: semantic.color.secondaryText,
        sizeSmall: semantic.sizing.sizingSmall,
        sizeMedium: semantic.sizing.sizingMedium,
        sizeLarge: semantic.sizing.sizingLarge,
      },
      image: {
        borderRadius: {
          default: semantic.radius.radiusSmall,
          circle: "50%",
        },
        borderColor: semantic.color.border,
        shadow: semantic.shadow.shadowSmall,
        sizeSmall: semantic.sizing.sizingLarge,
        sizeMedium: semantic.sizing.sizingXL,
      }

}

export default theme

export type Theme = typeof theme