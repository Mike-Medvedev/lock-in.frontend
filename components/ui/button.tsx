import { useTheme } from "@/theme/themeContext"
import { Pressable, StyleSheet } from "react-native"
import ThemedText from "./themedText"

type ButtonProps = {
  variant?: "outlined" | "filled"
  children?: React.ReactNode
  left?: React.ReactNode
  disabled?: boolean
  title?: string
  onPress?: () => void
}

export default function Button({ variant = "filled", children, left, disabled = false, onPress, title}: ButtonProps) {
  const theme = useTheme()

  const styles = StyleSheet.create({
    base: {
      borderRadius: theme.button.borderRadius,
      padding: theme.button.padding,
      gap: 8,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      margin: theme.button.margin,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    filled: {
      backgroundColor: theme.button.background,
    },
    outlined: {
      backgroundColor: "transparent",
      borderWidth: theme.button.borderWidth,
      borderColor: theme.button.borderColor,
    },
    text: {
      color: theme.button.color,
    },
    textOutlined: {
      color: "black", 
    },
  })

  return (
    <Pressable
    disabled={disabled}
    onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "filled" && {
          backgroundColor: pressed ? theme.button.hover : theme.button.background,
        },
        variant === "outlined" && {...styles.outlined, backgroundColor: pressed ? "rgb(212, 212, 212)": "transparent"},
      ]}
    >
        {left && left}
      <ThemedText styles={{...styles.text, ...(variant === "outlined" ? styles.textOutlined : {})}}>
        {title || children || "A Button"}
      </ThemedText>
    </Pressable>
  )
}
