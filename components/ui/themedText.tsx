import { useTheme } from "@/theme/themeContext"
import { Text } from "react-native"

interface Props {
  children: React.ReactNode
  variant?: "title" | "heading" | "default" | "secondary" | "success"
  color?: string
}

export default function ThemedText({ children, color, variant = "default" }: Props) {
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
      : theme.text.defaultColor

  return <Text style={{ color: textColor, fontSize }}>{children}</Text>
}
