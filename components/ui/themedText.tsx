import { useTheme } from "@/theme/themeContext"
import { Text } from "react-native"
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes"

interface Props {
  children: React.ReactNode
  variant?: "title" | "heading" | "default" | "secondary" | "success" | "error"
  color?: string,
  styles?: TextStyle
}

export default function ThemedText({ children, color, variant = "default", styles }: Props) {
  const theme = useTheme()

  const fontSize =
    variant === "title"
      ? theme.text.fontSizeXL
      : variant === "heading"
      ? theme.text.fontSizeLarge
      : theme.text.fontSizeBase

  const textColor =
    color
      ? color
      : variant === "secondary"
      ? theme.text.secondaryColor 
      : variant === "success"
      ? theme.text.successText
      : variant === "error"
      ? theme.text.errorText
      : theme.text.defaultColor
    
    const fontWeight = variant === "success" ?  theme.text.fontWeightBold : theme.text.fontWeightNormal

  return <Text style={[{ color: textColor, fontSize: fontSize, fontWeight: fontWeight as any }, styles]}>{children}</Text>
}
