import { useTheme } from "@/theme/themeContext"
import { View } from "react-native"
export default function Background({ children }: { children: React.ReactNode }){
    const theme = useTheme()
    return <View style={{backgroundColor: theme.background.color, width: "100%", flex: 1}}>
{children}
    </View>
}