import { useTheme } from "@/theme/themeContext"
import Ionicons from "@expo/vector-icons/Ionicons"

type IconProps = {
  name: keyof typeof Ionicons.glyphMap
  size?: "small" | "medium" | "large"
  color?: string
}

export default function Icon({ name, size = "medium", color }: IconProps) {
  const theme = useTheme()

  const sizeMap = {
    small: theme.icon.sizeSmall,
    medium: theme.icon.sizeMedium,
    large: theme.icon.sizeLarge,
  }

  return (
    <Ionicons
      name={name}
      size={sizeMap[size]}
      color={color || theme.icon.color}
    />
  )
}
