import { useTheme } from "@/theme/themeContext"
import { Pressable, Text } from "react-native"
export default function Button(){
    const theme = useTheme()
    return <Pressable style={{backgroundColor: theme.button.background,
        borderRadius: theme.button.borderRadius, padding: theme.button.padding,
        minWidth: 50, maxWidth: 100, justifyContent: "center", alignItems: "center",
        margin: theme.button.margin,  shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }}><Text style={{color: theme.button.color}}>A Button</Text></Pressable>
}