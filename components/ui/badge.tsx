import { useTheme } from "@/theme/themeContext"
import { Text, View } from "react-native"
export default function Badge({ children }: { children: React.ReactNode }){
    const theme = useTheme()
    return <View style={{backgroundColor: theme.badge.success.backgroundColor, borderWidth: theme.badge.borderWidth, borderRadius: theme.badge.borderRadius, paddingHorizontal: theme.badge.padding }}><Text style={{color: theme.badge.success.color}}>{children}</Text></View>
}