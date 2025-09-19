import { useTheme } from "@/theme/themeContext"
import { Text } from "react-native"
export default function Card({ children }: { children: React.ReactNode }){
    const theme = useTheme()
    return <Text style={{color: theme.text.defaultColor}}>{children}</Text>
}