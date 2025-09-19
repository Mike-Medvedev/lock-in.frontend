import { useTheme } from "@/theme/themeContext"
import { Text } from "react-native"
export default function ThemedText({ children, variant }: { children: React.ReactNode, variant?: "title" | "heading" }){
    const theme = useTheme()

    return <Text style={{color: theme.text.defaultColor, 
        fontSize: 
        variant === "title" ? theme.text.fontSizeXL :
        variant === "heading" ? theme.text.fontSizeLarge :
        theme.text.fontSizeBase}}>{children}</Text>
}