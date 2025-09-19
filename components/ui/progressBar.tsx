import { useTheme } from "@/theme/themeContext"
import { View } from "react-native"
export default function ProgressBar({value = 0}: {value?: number}){
    const theme = useTheme()
    return <View style={{backgroundColor: theme.progressBar.backgroundColor, width: 150, height: 10, borderRadius: theme.progressBar.borderRadius}}>
        <View style={{width: `${value}%`, backgroundColor: theme.progressBar.loadingColor, height: 10, borderRadius: theme.progressBar.borderRadius}}></View>
    </View>
}