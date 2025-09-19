import { useTheme } from "@/theme/themeContext"
import { Image as NativeImage, View } from "react-native"
export default function Image(){
    const theme = useTheme()
    return <View  style={{borderRadius: theme.image.borderRadius.default}}>
        <NativeImage />
    </View>
}