import { useTheme } from "@/theme/themeContext"
import { Pressable, Text } from "react-native"
export default function Button(){
    const theme = useTheme()
    return <Pressable style={{backgroundColor: theme.button.background, borderWidth: theme.button.borderWidth, borderRadius: theme.button.borderRadius, padding: theme.button.padding}}><Text style={{color: theme.button.color}}>Yo</Text></Pressable>
}